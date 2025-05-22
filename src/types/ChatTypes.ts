export interface UserDto {
  id: number;
  fullName: string;
  email: string;
}

export interface SellerDto {
  id: number;
  sellerName: string;
  email: string;
}

export interface OrderSummaryDto {
  id: number;
  orderId: number;
  orderDate: string;
}

export interface MessageDto {
  id: number;
  content: string;
  sender: string;
  timestamp: string;
  isRead: boolean;
}

export interface ChatResponse {
  id: number;
  chatTitle: string;
  user: UserDto;
  seller: SellerDto;
  order?: OrderSummaryDto;
  createdAt: string;
  updatedAt: string;
  unreadMessages: number;
  lastMessage?: MessageDto;
  isActive: boolean;
}

export interface MessageResponse {
  id: number;
  chatId: number;
  content: string;
  sender: string;
  timestamp: string;
  isRead: boolean;
}

export interface ChatMessageRequest {
  chatId: number;
  content: string;
  senderType: 'USER' | 'SELLER';
}

export interface CreateChatRequest {
  sellerId: number;
  orderId?: number;
  chatTitle?: string;
}

export interface MessageRequest {
  chatId: number;
  content: string;
}

export interface ChatNotificationResponse {
  type: 'NEW_MESSAGE' | 'READ_STATUS' | 'TYPING';
  chatId: number;
  message?: MessageResponse;
  senderType?: string;
  isTyping?: boolean;
}

export type MessageSender = 'USER' | 'SELLER';

export interface ChatState {
  chats: ChatResponse[];
  currentChat: ChatResponse | null;
  messages: MessageResponse[];
  loading: boolean;
  error: string | null;
  isTyping: {
    [chatId: number]: {
      sender: MessageSender;
      isTyping: boolean;
    } | null;
  };
} 