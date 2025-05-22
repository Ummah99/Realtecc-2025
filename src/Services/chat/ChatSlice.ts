import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  ChatState, 
  ChatResponse, 
  MessageResponse, 
  CreateChatRequest, 
  MessageRequest, 
  ChatNotificationResponse,
  MessageSender
} from '../../types/ChatTypes';
import webSocketService from '../WEBSOCKET/WebSocketService';
import chatApiService from '../ChatApiService/ChatApiService';
import { showErrorToast } from '../../Utils/toast';



const initialState: ChatState = {
  chats: [],
  currentChat: null,
  messages: [],
  loading: false,
  error: null,
  isTyping: {}
};


// User chat operations
export const createChat = createAsyncThunk(
  'chat/createChat',
  async (request: CreateChatRequest, { rejectWithValue }) => {
    try {
      const response = await chatApiService.createChat(request);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create chat');
    }
  }
);

export const fetchUserChats = createAsyncThunk(
  'chat/fetchUserChats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await chatApiService.getUserChats();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch chats');
    }
  }
);

export const fetchUserChatById = createAsyncThunk(
  'chat/fetchUserChatById',
  async (chatId: number, { rejectWithValue }) => {
    try {
      const response = await chatApiService.getUserChatById(chatId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch chat');
    }
  }
);

export const fetchUserChatMessages = createAsyncThunk(
  'chat/fetchUserChatMessages',
  async (chatId: number, { rejectWithValue, dispatch }) => {
    try {
      const response = await chatApiService.getUserChatMessages(chatId);
      // Mark messages as read when fetched
      dispatch(markUserMessagesAsRead(chatId));
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch messages');
    }
  }
);

export const sendUserMessage = createAsyncThunk(
  'chat/sendUserMessage',
  async (request: MessageRequest, { rejectWithValue }) => {
    try {
      const response = await chatApiService.sendUserMessage(request);
      
      // Send via WebSocket for real-time updates
      webSocketService.sendMessage({
        chatId: request.chatId,
        content: request.content,
        senderType: 'USER'
      });
      
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send message');
    }
  }
);

export const markUserMessagesAsRead = createAsyncThunk(
  'chat/markUserMessagesAsRead',
  async (chatId: number, { rejectWithValue }) => {
    try {
      await chatApiService.markUserMessagesAsRead(chatId);
      
      // Notify via WebSocket
      webSocketService.markMessagesAsRead(chatId, 'USER');
      
      return chatId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark messages as read');
    }
  }
);

// Seller chat operations
export const fetchSellerChats = createAsyncThunk(
  'chat/fetchSellerChats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await chatApiService.getSellerChats();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch seller chats');
    }
  }
);

export const fetchSellerChatById = createAsyncThunk(
  'chat/fetchSellerChatById',
  async (chatId: number, { rejectWithValue }) => {
    try {
      const response = await chatApiService.getSellerChatById(chatId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch seller chat');
    }
  }
);

export const fetchSellerChatMessages = createAsyncThunk(
  'chat/fetchSellerChatMessages',
  async (chatId: number, { rejectWithValue, dispatch }) => {
    try {
      const response = await chatApiService.getSellerChatMessages(chatId);
      // Mark messages as read when fetched
      dispatch(markSellerMessagesAsRead(chatId));
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch seller messages');
    }
  }
);

export const sendSellerMessage = createAsyncThunk(
  'chat/sendSellerMessage',
  async (request: MessageRequest, { rejectWithValue }) => {
    try {
      const response = await chatApiService.sendSellerMessage(request);
      
      // Send via WebSocket for real-time updates
      webSocketService.sendMessage({
        chatId: request.chatId,
        content: request.content,
        senderType: 'SELLER'
      });
      
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send seller message');
    }
  }
);

export const markSellerMessagesAsRead = createAsyncThunk(
  'chat/markSellerMessagesAsRead',
  async (chatId: number, { rejectWithValue }) => {
    try {
      await chatApiService.markSellerMessagesAsRead(chatId);
      
      // Notify via WebSocket
      webSocketService.markMessagesAsRead(chatId, 'SELLER');
      
      return chatId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark seller messages as read');
    }
  }
);

// Typing status thunks
export const sendTypingStatus = createAsyncThunk(
  'chat/sendTypingStatus',
  async (
    { chatId, senderType, isTyping }: { chatId: number; senderType: MessageSender; isTyping: boolean }, 
    { rejectWithValue }
  ) => {
    try {
      webSocketService.sendTypingStatus(chatId, senderType, isTyping);
      return { chatId, sender: senderType, isTyping };
    } catch (error: any) {
      return rejectWithValue('Failed to send typing status');
    }
  }
);

// The chat slice
const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setCurrentChat: (state, action: PayloadAction<ChatResponse | null>) => {
      state.currentChat = action.payload;
    },
    
    addMessage: (state, action: PayloadAction<MessageResponse>) => {
      const message = action.payload;
      // Check if message already exists
      const existingMessageIndex = state.messages.findIndex(m => m.id === message.id);
      
      if (existingMessageIndex === -1) {
        state.messages.push(message);
        
        // Update the last message in the current chat if it matches
        if (state.currentChat && state.currentChat.id === message.chatId) {
          state.currentChat = {
            ...state.currentChat,
            lastMessage: {
              id: message.id,
              content: message.content,
              sender: message.sender,
              timestamp: message.timestamp,
              isRead: message.isRead
            }
          };
        }
        
        // Update the last message in the chats list
        const chatIndex = state.chats.findIndex(c => c.id === message.chatId);
        if (chatIndex !== -1) {
          state.chats[chatIndex] = {
            ...state.chats[chatIndex],
            lastMessage: {
              id: message.id,
              content: message.content,
              sender: message.sender,
              timestamp: message.timestamp,
              isRead: message.isRead
            },
            updatedAt: message.timestamp
          };
          
          // If the message is not from the current user, increment unread count
          if (
            (message.sender === 'SELLER' && !state.currentChat) ||
            (message.sender === 'SELLER' && state.currentChat && state.currentChat.id !== message.chatId)
          ) {
            state.chats[chatIndex].unreadMessages += 1;
          }
        }
      }
    },
    
    updateMessageReadStatus: (state, action: PayloadAction<number>) => {
      const chatId = action.payload;
      
      // Mark all messages as read for the given chat
      state.messages = state.messages.map(message => 
        message.chatId === chatId ? { ...message, isRead: true } : message
      );
      
      // Update the chat in the list
      const chatIndex = state.chats.findIndex(c => c.id === chatId);
      if (chatIndex !== -1) {
        state.chats[chatIndex] = {
          ...state.chats[chatIndex],
          unreadMessages: 0
        };
        
        // Also update the lastMessage if it exists
        if (state.chats[chatIndex].lastMessage) {
          state.chats[chatIndex] = {
            ...state.chats[chatIndex],
            lastMessage: {
              ...state.chats[chatIndex].lastMessage!,
              isRead: true
            }
          };
        }
      }
      
      // Update the current chat if it matches
      if (state.currentChat && state.currentChat.id === chatId) {
        state.currentChat = {
          ...state.currentChat,
          unreadMessages: 0
        };
        
        if (state.currentChat.lastMessage) {
          state.currentChat = {
            ...state.currentChat,
            lastMessage: {
              ...state.currentChat.lastMessage,
              isRead: true
            }
          };
        }
      }
    },
    
    updateTypingStatus: (
      state, 
      action: PayloadAction<{ chatId: number; sender: MessageSender; isTyping: boolean }>
    ) => {
      const { chatId, sender, isTyping } = action.payload;
      
      if (isTyping) {
        state.isTyping[chatId] = { sender, isTyping };
      } else {
        // Only remove if the sender matches the current typing indicator
        if (state.isTyping[chatId]?.sender === sender) {
          state.isTyping[chatId] = null;
        }
      }
    },
    
    // For WebSocket notification handling
    handleChatNotification: (state, action: PayloadAction<ChatNotificationResponse>) => {
      const notification = action.payload;
      
      switch (notification.type) {
        case 'NEW_MESSAGE':
          if (notification.message) {
            // Add the new message to the list
            const message = notification.message;
            const existingMessageIndex = state.messages.findIndex(m => m.id === message.id);
            
            if (existingMessageIndex === -1) {
              state.messages.push(message);
              
              // Update the current chat if it matches
              if (state.currentChat && state.currentChat.id === message.chatId) {
                state.currentChat = {
                  ...state.currentChat,
                  lastMessage: {
                    id: message.id,
                    content: message.content,
                    sender: message.sender,
                    timestamp: message.timestamp,
                    isRead: message.isRead
                  }
                };
              }
              
              // Update chats list
              const chatIndex = state.chats.findIndex(c => c.id === message.chatId);
              if (chatIndex !== -1) {
                state.chats[chatIndex] = {
                  ...state.chats[chatIndex],
                  lastMessage: {
                    id: message.id,
                    content: message.content,
                    sender: message.sender,
                    timestamp: message.timestamp,
                    isRead: message.isRead
                  },
                  updatedAt: message.timestamp
                };
                
                // Increment unread count if not currently viewing this chat
                if (
                  !state.currentChat || 
                  (state.currentChat && state.currentChat.id !== message.chatId)
                ) {
                  state.chats[chatIndex].unreadMessages += 1;
                }
              }
            }
          }
          break;
          
        case 'READ_STATUS':
          // Update read status for all messages in the chat
          state.messages = state.messages.map(message => 
            message.chatId === notification.chatId ? { ...message, isRead: true } : message
          );
          
          // Update chats list
          const chatIndex = state.chats.findIndex(c => c.id === notification.chatId);
          if (chatIndex !== -1 && state.chats[chatIndex].lastMessage) {
            state.chats[chatIndex] = {
              ...state.chats[chatIndex],
              lastMessage: {
                ...state.chats[chatIndex].lastMessage!,
                isRead: true
              }
            };
          }
          
          // Update current chat if it matches
          if (state.currentChat && state.currentChat.id === notification.chatId && state.currentChat.lastMessage) {
            state.currentChat = {
              ...state.currentChat,
              lastMessage: {
                ...state.currentChat.lastMessage,
                isRead: true
              }
            };
          }
          break;
          
        case 'TYPING':
          if (notification.chatId && notification.senderType) {
            state.isTyping[notification.chatId] = { 
              sender: notification.senderType as MessageSender, 
              isTyping: notification.isTyping || false 
            };
          }
          break;
      }
    },
    
    resetChat: (state) => {
      state.currentChat = null;
      state.messages = [];
      state.isTyping = {};
    }
  },
  extraReducers: (builder) => {
    builder
      // Create chat
      .addCase(createChat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createChat.fulfilled, (state, action) => {
        state.loading = false;
        state.chats.push(action.payload);
        state.currentChat = action.payload;
      })
      .addCase(createChat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        showErrorToast(action.payload as string || 'Failed to create chat');
      })
      
      // Fetch user chats
      .addCase(fetchUserChats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserChats.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = action.payload;
      })
      .addCase(fetchUserChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch user chat by ID
      .addCase(fetchUserChatById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserChatById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentChat = action.payload;
        
        // Update the chat in the list if it exists
        const chatIndex = state.chats.findIndex(c => c.id === action.payload.id);
        if (chatIndex !== -1) {
          state.chats[chatIndex] = action.payload;
        } else {
          state.chats.push(action.payload);
        }
      })
      .addCase(fetchUserChatById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        showErrorToast(action.payload as string || 'Failed to fetch chat');
      })
      
      // Fetch user chat messages
      .addCase(fetchUserChatMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserChatMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchUserChatMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        showErrorToast(action.payload as string || 'Failed to fetch messages');
      })
      
      // Send user message
      .addCase(sendUserMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendUserMessage.fulfilled, (state, action) => {
        state.loading = false;
        
        // Add the message to the list
        state.messages.push(action.payload);
        
        // Update the last message in the current chat
        if (state.currentChat && state.currentChat.id === action.payload.chatId) {
          state.currentChat = {
            ...state.currentChat,
            lastMessage: {
              id: action.payload.id,
              content: action.payload.content,
              sender: action.payload.sender,
              timestamp: action.payload.timestamp,
              isRead: action.payload.isRead
            },
            updatedAt: action.payload.timestamp
          };
        }
        
        // Update the last message in the chats list
        const chatIndex = state.chats.findIndex(c => c.id === action.payload.chatId);
        if (chatIndex !== -1) {
          state.chats[chatIndex] = {
            ...state.chats[chatIndex],
            lastMessage: {
              id: action.payload.id,
              content: action.payload.content,
              sender: action.payload.sender,
              timestamp: action.payload.timestamp,
              isRead: action.payload.isRead
            },
            updatedAt: action.payload.timestamp
          };
        }
      })
      .addCase(sendUserMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        showErrorToast(action.payload as string || 'Failed to send message');
      })
      
      // Fetch seller chats
      .addCase(fetchSellerChats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSellerChats.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = action.payload;
      })
      .addCase(fetchSellerChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch seller chat by ID
      .addCase(fetchSellerChatById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSellerChatById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentChat = action.payload;
        
        // Update the chat in the list if it exists
        const chatIndex = state.chats.findIndex(c => c.id === action.payload.id);
        if (chatIndex !== -1) {
          state.chats[chatIndex] = action.payload;
        } else {
          state.chats.push(action.payload);
        }
      })
      .addCase(fetchSellerChatById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        showErrorToast(action.payload as string || 'Failed to fetch seller chat');
      })
      
      // Fetch seller chat messages
      .addCase(fetchSellerChatMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSellerChatMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchSellerChatMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        showErrorToast(action.payload as string || 'Failed to fetch seller messages');
      })
      
      // Send seller message
      .addCase(sendSellerMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendSellerMessage.fulfilled, (state, action) => {
        state.loading = false;
        
        // Add the message to the list
        state.messages.push(action.payload);
        
        // Update the last message in the current chat
        if (state.currentChat && state.currentChat.id === action.payload.chatId) {
          state.currentChat = {
            ...state.currentChat,
            lastMessage: {
              id: action.payload.id,
              content: action.payload.content,
              sender: action.payload.sender,
              timestamp: action.payload.timestamp,
              isRead: action.payload.isRead
            },
            updatedAt: action.payload.timestamp
          };
        }
        
        // Update the last message in the chats list
        const chatIndex = state.chats.findIndex(c => c.id === action.payload.chatId);
        if (chatIndex !== -1) {
          state.chats[chatIndex] = {
            ...state.chats[chatIndex],
            lastMessage: {
              id: action.payload.id,
              content: action.payload.content,
              sender: action.payload.sender,
              timestamp: action.payload.timestamp,
              isRead: action.payload.isRead
            },
            updatedAt: action.payload.timestamp
          };
        }
      })
      .addCase(sendSellerMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        showErrorToast(action.payload as string || 'Failed to send seller message');
      })
      
      // Mark messages as read
      .addCase(markUserMessagesAsRead.fulfilled, (state, action) => {
        const chatId = action.payload;
        
        // Update read status for messages in this chat
        state.messages = state.messages.map(message => 
          message.chatId === chatId ? { ...message, isRead: true } : message
        );
        
        // Update unread count for this chat
        const chatIndex = state.chats.findIndex(c => c.id === chatId);
        if (chatIndex !== -1) {
          state.chats[chatIndex].unreadMessages = 0;
          
          if (state.chats[chatIndex].lastMessage) {
            state.chats[chatIndex].lastMessage!.isRead = true;
          }
        }
        
        // Update current chat if it matches
        if (state.currentChat && state.currentChat.id === chatId) {
          state.currentChat.unreadMessages = 0;
          
          if (state.currentChat.lastMessage) {
            state.currentChat.lastMessage!.isRead = true;
          }
        }
      })
      .addCase(markSellerMessagesAsRead.fulfilled, (state, action) => {
        const chatId = action.payload;
        
        // Update read status for messages in this chat
        state.messages = state.messages.map(message => 
          message.chatId === chatId ? { ...message, isRead: true } : message
        );
        
        // Update unread count for this chat
        const chatIndex = state.chats.findIndex(c => c.id === chatId);
        if (chatIndex !== -1) {
          state.chats[chatIndex].unreadMessages = 0;
          
          if (state.chats[chatIndex].lastMessage) {
            state.chats[chatIndex].lastMessage!.isRead = true;
          }
        }
        
        // Update current chat if it matches
        if (state.currentChat && state.currentChat.id === chatId) {
          state.currentChat.unreadMessages = 0;
          
          if (state.currentChat.lastMessage) {
            state.currentChat.lastMessage!.isRead = true;
          }
        }
      })
      
      // Typing status
      .addCase(sendTypingStatus.fulfilled, (state, action) => {
        const { chatId, sender, isTyping } = action.payload;
        state.isTyping[chatId] = { sender, isTyping };
      });
  }
});

// Export actions
export const { 
  setCurrentChat, 
  addMessage, 
  updateMessageReadStatus, 
  updateTypingStatus,
  handleChatNotification,
  resetChat
} = chatSlice.actions;

// Export reducer
export default chatSlice.reducer; 