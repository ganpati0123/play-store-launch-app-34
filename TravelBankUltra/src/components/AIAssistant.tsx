import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  FadeIn,
  SlideInUp,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';
import { useTheme } from '../context/ThemeContext';
import { getRandomAIResponse } from '../utils/mockData';

const { width, height } = Dimensions.get('window');

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface AIAssistantProps {
  visible?: boolean;
  onClose?: () => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ visible = true, onClose }) => {
  const { colors, theme } = useTheme();
  const [isOpen, setIsOpen] = useState(visible);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your TravelBank AI Assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const slideAnim = useSharedValue(0);
  const scaleAnim = useSharedValue(1);

  const toggleAssistant = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (isOpen) {
      slideAnim.value = withTiming(0, { duration: 300 });
      setTimeout(() => setIsOpen(false), 300);
    } else {
      setIsOpen(true);
      slideAnim.value = withSpring(1, { damping: 15, stiffness: 150 });
    }
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getRandomAIResponse(),
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 1500);
  };

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: slideAnim.value * 300 }],
    opacity: slideAnim.value,
  }));

  const quickActions = [
    { label: 'Book Flight', icon: '✈️' },
    { label: 'Book Hotel', icon: '🏨' },
    { label: 'Check Balance', icon: '💰' },
    { label: 'Pay Bills', icon: '📄' },
  ];

  if (!isOpen) {
    return (
      <TouchableOpacity
        style={[styles.floatingButton, { backgroundColor: colors.primary }]}
        onPress={toggleAssistant}
        activeOpacity={0.8}
      >
        <Text style={styles.floatingButtonIcon}>🤖</Text>
        <View style={styles.notificationBadge}>
          <Text style={styles.notificationText}>1</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <Animated.View
      style={[
        styles.container,
        containerStyle,
        { backgroundColor: colors.bottomSheet },
      ]}
      entering={SlideInUp.springify().damping(15)}
    >
      <BlurView intensity={20} tint={theme} style={StyleSheet.absoluteFill} />
      
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={[styles.avatarContainer, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>AI</Text>
          </View>
          <View>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              TravelBank Assistant
            </Text>
            <Text style={[styles.headerSubtitle, { color: colors.success }]}>
              ● Online
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={toggleAssistant} style={styles.closeButton}>
          <Text style={[styles.closeButtonText, { color: colors.textSecondary }]}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageWrapper,
              message.isUser ? styles.userMessageWrapper : styles.aiMessageWrapper,
            ]}
          >
            {!message.isUser && (
              <View style={[styles.aiAvatar, { backgroundColor: colors.primary }]}>
                <Text style={styles.aiAvatarText}>AI</Text>
              </View>
            )}
            <View
              style={[
                styles.messageBubble,
                message.isUser
                  ? { backgroundColor: colors.primary }
                  : { backgroundColor: colors.surfaceVariant },
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  { color: message.isUser ? '#fff' : colors.text },
                ]}
              >
                {message.text}
              </Text>
            </View>
          </View>
        ))}

        {isTyping && (
          <View style={[styles.typingContainer, styles.aiMessageWrapper]}>
            <View style={[styles.aiAvatar, { backgroundColor: colors.primary }]}>
              <Text style={styles.aiAvatarText}>AI</Text>
            </View>
            <View style={[styles.typingBubble, { backgroundColor: colors.surfaceVariant }]}>
              <View style={styles.typingDot} />
              <View style={styles.typingDot} />
              <View style={styles.typingDot} />
            </View>
          </View>
        )}
      </ScrollView>

      {!isTyping && messages.length <= 1 && (
        <View style={styles.quickActions}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.quickActionChip, { backgroundColor: colors.surfaceVariant }]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setInputText(action.label);
              }}
            >
              <Text style={styles.quickActionIcon}>{action.icon}</Text>
              <Text style={[styles.quickActionLabel, { color: colors.text }]}>
                {action.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={[styles.inputContainer, { backgroundColor: colors.surface }]}>
          <TextInput
            style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.text }]}
            placeholder="Ask me anything..."
            placeholderTextColor={colors.textTertiary}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={200}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              { backgroundColor: inputText ? colors.primary : colors.surfaceVariant },
            ]}
            onPress={handleSendMessage}
            disabled={!inputText.trim()}
          >
            <Text style={styles.sendButtonText}>➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    left: 16,
    right: 16,
    height: height * 0.5,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
    zIndex: 1000,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 999,
  },
  floatingButtonIcon: {
    fontSize: 28,
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  headerSubtitle: {
    fontSize: 12,
    marginLeft: 12,
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 18,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    gap: 12,
  },
  messageWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  userMessageWrapper: {
    justifyContent: 'flex-end',
  },
  aiMessageWrapper: {
    justifyContent: 'flex-start',
  },
  aiAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiAvatarText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    gap: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#9CA3AF',
    marginHorizontal: 2,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  quickActionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  quickActionIcon: {
    fontSize: 14,
  },
  quickActionLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  input: {
    flex: 1,
    maxHeight: 80,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    fontSize: 14,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonText: {
    fontSize: 18,
    color: '#fff',
  },
});

export default AIAssistant;
