import axios, { AxiosError, AxiosResponse } from 'axios';

import jwtService from '../../Utils/JwtService';
import { ChatResponse, CreateChatRequest, MessageRequest, MessageResponse } from '../../types/ChatTypes';

const API_BASE_URL = process.env.REACT_APP_API_URL || '';

// Custom error class for HTML responses
class HtmlResponseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'HtmlResponseError';
  }
}

// Axios response interceptor to handle HTML responses
axios.interceptors.response.use(
  (response: AxiosResponse) => {
    // Check if the response is HTML (server error page)
    if (
      response.data && 
      typeof response.data === 'string' && 
      response.data.trim().startsWith('<')
    ) {
      throw new HtmlResponseError(
        'Received HTML instead of JSON. Server likely returned an error page.'
      );
    }
    return response;
  },
  (error: AxiosError) => {
    // Check if the error response is HTML
    if (
      error.response?.data && 
      typeof error.response.data === 'string' && 
      error.response.data.trim().startsWith('<')
    ) {
      return Promise.reject(
        new HtmlResponseError(
          'Received HTML error page from server. You may need to log in again.'
        )
      );
    }
    return Promise.reject(error);
  }
);

class ChatApiService {
  // Helper method to get headers
  private async getAuthHeaders() {
    const jwt = await jwtService.getToken();
    if (!jwt) {
      throw new Error('No JWT token found. Please log in again.');
    }
    
    return {
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    };
  }
  
  // Helper method for API requests with error handling
  private async apiRequest<T>(
    method: 'get' | 'post' | 'put' | 'delete',
    url: string,
    data?: any
  ): Promise<T> {
    try {
      const config = await this.getAuthHeaders();
      let response;
      
      switch (method) {
        case 'get':
          response = await axios.get(`${API_BASE_URL}${url}`, config);
          break;
        case 'post':
          response = await axios.post(`${API_BASE_URL}${url}`, data, config);
          break;
        case 'put':
          response = await axios.put(`${API_BASE_URL}${url}`, data, config);
          break;
        case 'delete':
          response = await axios.delete(`${API_BASE_URL}${url}`, config);
          break;
      }
      
      return response.data;
    } catch (error) {
      console.error(`API request error (${method.toUpperCase()} ${url}):`, error);
      throw error;
    }
  }
  
  // ===== User Endpoints =====
  
  /**
   * Create a new chat for a user
   */
  async createChat(request: CreateChatRequest): Promise<ChatResponse> {
    return this.apiRequest<ChatResponse>('post', '/api/user/chats/create', request);
  }
  
  /**
   * Get all chats for the logged-in user
   */
  async getUserChats(): Promise<ChatResponse[]> {
    console.log('Fetching user chats');
    console.log('JWT Token available:', !!(await jwtService.getToken()));
    
    return this.apiRequest<ChatResponse[]>('get', '/api/user/chats');
  }
  
  /**
   * Get a specific chat by ID for the user
   */
  async getUserChatById(chatId: number): Promise<ChatResponse> {
    return this.apiRequest<ChatResponse>('get', `/api/user/chats/${chatId}`);
  }
  
  /**
   * Get all messages for a specific chat for the user
   */
  async getUserChatMessages(chatId: number): Promise<MessageResponse[]> {
    return this.apiRequest<MessageResponse[]>('get', `/api/user/chats/${chatId}/messages`);
  }
  
  /**
   * Send a message from the user
   */
  async sendUserMessage(request: MessageRequest): Promise<MessageResponse> {
    return this.apiRequest<MessageResponse>('post', '/api/user/chats/messages', request);
  }
  
  /**
   * Mark messages as read for the user
   */
  async markUserMessagesAsRead(chatId: number): Promise<void> {
    return this.apiRequest<void>('put', `/api/user/chats/${chatId}/read`, {});
  }
  
  // ===== Seller Endpoints =====
  
  /**
   * Get all chats for the logged-in seller
   */
  async getSellerChats(): Promise<ChatResponse[]> {
    console.log('ChatApiService: Fetching seller chats...');
    console.log('API URL being used:', `${API_BASE_URL}/api/seller/chats`);
    console.log('JWT Token available:', !!(await jwtService.getToken()));
    
    try {
      const response = await this.apiRequest<ChatResponse[]>('get', '/api/seller/chats');
      console.log('ChatApiService: Successfully fetched seller chats:', response);
      return response;
    } catch (error) {
      console.error('ChatApiService ERROR: Failed to fetch seller chats:', error);
      throw error;
    }
  }
  
  /**
   * Get a specific chat by ID for the seller
   */
  async getSellerChatById(chatId: number): Promise<ChatResponse> {
    return this.apiRequest<ChatResponse>('get', `/api/seller/chats/${chatId}`);
  }
  
  /**
   * Get all messages for a specific chat for the seller
   */
  async getSellerChatMessages(chatId: number): Promise<MessageResponse[]> {
    return this.apiRequest<MessageResponse[]>('get', `/api/seller/chats/${chatId}/messages`);
  }
  
  /**
   * Send a message from the seller
   */
  async sendSellerMessage(request: MessageRequest): Promise<MessageResponse> {
    return this.apiRequest<MessageResponse>('post', '/api/seller/chats/messages', request);
  }
  
  /**
   * Mark messages as read for the seller
   */
  async markSellerMessagesAsRead(chatId: number): Promise<void> {
    return this.apiRequest<void>('put', `/api/seller/chats/${chatId}/read`, {});
  }
}

// Create a singleton instance
const chatApiService = new ChatApiService();
export default chatApiService; 