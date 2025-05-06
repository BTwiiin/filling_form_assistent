import { useState, useEffect } from 'react';
import { Message, FormData, ChatResponse } from '@/types';
import { fetchWrapper } from '@/actions/fetch-wrapper';

const SESSION_INITIALIZED_KEY = 'session_initialized';

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({});
  const [typingMessageId, setTypingMessageId] = useState<number | null>(null);

  // Initialize session on component mount
  useEffect(() => {
    const initializeSession = async () => {
      try {
        // Check if session was already initialized
        const isInitialized = localStorage.getItem(SESSION_INITIALIZED_KEY);
        
        if (!isInitialized) {
          const response = await fetchWrapper.post('/session', {});
          
          if ('error' in response) {
            throw new Error('Failed to initialize session');
          }

          // Mark session as initialized
          localStorage.setItem(SESSION_INITIALIZED_KEY, 'true');
        }

        // Load chat history regardless of initialization
        await loadChatHistory();
      } catch (error) {
        console.error('Failed to initialize session:', error);
      }
    };

    initializeSession();
  }, []);

  const loadChatHistory = async () => {
    try {
      const response = await fetchWrapper.get('/chat/message');

      if ('error' in response) {
        throw new Error('Failed to load chat history');
      }

      if (response.response?.history) {
        // Convert backend message format to frontend format
        const formattedMessages: Message[] = response.response.history.map((msg: any) => {
          const content = msg.parts[0].text;
          let messageContent = content;

          // Handle JSON response format
          if (content.startsWith('{') || content.startsWith('"')) {
            try {
              // Remove quotes if the content is wrapped in them
              const cleanContent = content.replace(/^"|"$/g, '');
              const parsedContent = JSON.parse(cleanContent);
              messageContent = parsedContent.message || cleanContent;
            } catch (e) {
              // If parsing fails, use the content as is
              messageContent = content.replace(/^"|"$/g, '');
            }
          }

          return {
            role: msg.role,
            content: messageContent.replace(/\\n/g, '\n')
          };
        });
        setMessages(formattedMessages);

        // Set form data if available
        if (response.response.formData) {
          setFormData(response.response.formData);
        }
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    const userMessage = input;
    setInput('');

    // Add user message to the chat
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const response = await fetchWrapper.post('/chat/message', { message: userMessage });

      if ('error' in response) {
        throw new Error('Failed to send message');
      }

      const data = response as ChatResponse;
      
      // Add AI response to the chat and set it for typing effect
      setMessages(prev => {
        const newMessages = [...prev, { 
          role: 'model' as const, 
          content: data.response.message.replace(/\\n/g, '\n')
        }];
        setTypingMessageId(newMessages.length - 1);
        return newMessages;
      });

      // Update form data if available
      if (data.response.formData) {
        setFormData(data.response.formData);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      // Add error message to chat
      setMessages(prev => [...prev, { 
        role: 'model', 
        content: 'Sorry, there was an error processing your message. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetChat = async () => {
    try {
      // Clear local state
      setMessages([]);
      setFormData({} as FormData);
      setInput('');
      setTypingMessageId(null);

      // Remove initialization flag
      localStorage.removeItem(SESSION_INITIALIZED_KEY);

      // Create new session
      const response = await fetchWrapper.post('/session', {});

      if ('error' in response) {
        throw new Error('Failed to reset chat');
      }

      // Mark session as initialized again
      localStorage.setItem(SESSION_INITIALIZED_KEY, 'true');
    } catch (error) {
      console.error('Failed to reset chat:', error);
    }
  };

  const handleTypingComplete = () => {
    setTypingMessageId(null);
  };

  return {
    messages,
    input,
    setInput,
    handleSubmit,
    isLoading,
    formData,
    resetChat,
    typingMessageId,
    handleTypingComplete,
  };
} 