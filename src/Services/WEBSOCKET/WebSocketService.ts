import { Client, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import jwtService from '../../Utils/JwtService';
import { ChatMessageRequest, ChatNotificationResponse } from '../../types/ChatTypes';


// Get the WebSocket URL from environment variables
const WEBSOCKET_URL = process.env.REACT_APP_WEBSOCKET_URL || 'http://localhost:8080/ws';

class WebSocketService {
  private client: Client | null = null;
  private subscriptions: StompSubscription[] = [];
  private messageHandlers: ((notification: ChatNotificationResponse) => void)[] = [];
  private connected: boolean = false;
  private reconnectAttempts: number = 0;
  private readonly MAX_RECONNECT_ATTEMPTS = 5;
  
  constructor() {
    this.initializeClient();
  }
  
  private async initializeClient() {
    console.log('Initializing WebSocket connection to:', WEBSOCKET_URL);
    console.log('Note: For local development, ensure your Spring Boot server has CORS enabled for http://localhost:3000');
    
    const token = await jwtService.getToken();
    
    this.client = new Client({
      // @ts-ignore - WebSocketFactory accepts SockJS implementation
      webSocketFactory: () => new SockJS(WEBSOCKET_URL),
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      debug: function(str: string) {
        console.log('STOMP:', str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: this.onConnect.bind(this),
      onDisconnect: this.onDisconnect.bind(this),
      onStompError: this.onStompError.bind(this)
    });
  }
  
  public connect() {
    if (this.client && !this.connected) {
      try {
        console.log('Activating WebSocket connection...');
        this.client.activate();
      } catch (error) {
        console.error('Error connecting to WebSocket:', error);
      }
    }
  }
  
  public disconnect() {
    if (this.client && this.connected) {
      try {
        this.unsubscribeAll();
        this.client.deactivate();
        this.connected = false;
        this.messageHandlers = [];
      } catch (error) {
        console.error('Error disconnecting from WebSocket:', error);
      }
    }
  }
  
  private onConnect() {
    this.connected = true;
    this.reconnectAttempts = 0;
    
    console.log('Connected to WebSocket successfully!');
    
    // Subscribe to personal queue for messages
    const userEmail = this.getUserEmail();
    if (userEmail) {
      try {
        console.log(`Subscribing to user queue: /user/${userEmail}/queue/chat.messages`);
        const subscription = this.client!.subscribe(
          `/user/${userEmail}/queue/chat.messages`,
          this.handleMessage.bind(this)
        );
        this.subscriptions.push(subscription);
      } catch (error) {
        console.error('Error subscribing to chat messages:', error);
      }
    } else {
      console.warn('No user email found - cannot subscribe to personal queue');
    }
  }
  
  private onDisconnect() {
    this.connected = false;
    console.log('Disconnected from WebSocket');
    
    // Attempt to reconnect
    if (this.reconnectAttempts < this.MAX_RECONNECT_ATTEMPTS) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.MAX_RECONNECT_ATTEMPTS})...`);
      setTimeout(() => {
        this.connect();
      }, 5000 * this.reconnectAttempts); // Exponential backoff
    }
  }
  
  private onStompError(frame: any) {
    console.error('WebSocket STOMP error:', frame);
  }
  
  public sendMessage(message: ChatMessageRequest) {
    if (this.client && this.connected) {
      try {
        console.log('Sending message:', message);
        this.client.publish({
          destination: '/app/chat.sendMessage',
          body: JSON.stringify(message)
        });
      } catch (error) {
        console.error('Error sending message:', error);
      }
    } else {
      console.error('Cannot send message - WebSocket not connected');
    }
  }
  
  public sendTypingStatus(chatId: number, senderType: 'USER' | 'SELLER', isTyping: boolean) {
    if (this.client && this.connected) {
      try {
        this.client.publish({
          destination: '/app/chat.typing',
          body: JSON.stringify({
            chatId,
            content: isTyping ? 'typing' : 'stopped',
            senderType
          })
        });
      } catch (error) {
        console.error('Error sending typing status:', error);
      }
    }
  }
  
  public markMessagesAsRead(chatId: number, senderType: 'USER' | 'SELLER') {
    if (this.client && this.connected) {
      try {
        this.client.publish({
          destination: '/app/chat.markRead',
          body: JSON.stringify({
            chatId,
            content: 'read',
            senderType
          })
        });
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    }
  }
  
  private handleMessage(message: any) {
    try {
      // Check if the response is HTML (error page)
      if (typeof message.body === 'string' && message.body.trim().startsWith('<')) {
        console.error('Received HTML instead of JSON. Server likely returned an error page.');
        return;
      }
      
      console.log('Received message:', message.body);
      const notification: ChatNotificationResponse = JSON.parse(message.body);
      this.messageHandlers.forEach(handler => handler(notification));
    } catch (error) {
      console.error('Error processing incoming message:', error);
    }
  }
  
  public addMessageHandler(handler: (notification: ChatNotificationResponse) => void) {
    this.messageHandlers.push(handler);
  }
  
  public removeMessageHandler(handler: (notification: ChatNotificationResponse) => void) {
    this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
  }
  
  private unsubscribeAll() {
    this.subscriptions.forEach(subscription => {
      try {
        subscription.unsubscribe();
      } catch (error) {
        console.error('Error unsubscribing:', error);
      }
    });
    this.subscriptions = [];
  }
  
  private getUserEmail(): string | null {
    try {
      // Implement based on your authentication system
      // This could come from a user context, redux store, or parsed JWT
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user.email || null;
    } catch (error) {
      console.error('Error getting user email:', error);
      return null;
    }
  }
  
  public isConnected(): boolean {
    return this.connected;
  }
}

// Create a singleton instance
const webSocketService = new WebSocketService();
export default webSocketService; 