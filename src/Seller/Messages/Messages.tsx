import React, { useState, useEffect } from 'react';
import './Messages.css';

// Typdefinitionen für die Nachrichten
interface MessageThread {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
  isCustomer: boolean;
}

interface Message {
  id: number;
  sender: string;
  senderEmail?: string; // E-Mail-Adresse des Absenders
  avatar: string;
  type: 'customer' | 'system' | 'platform';
  subject: string;
  preview: string;
  date: string;
  read: boolean;
  messages: MessageThread[];
}

// API-Service für Nachrichten (wird vom Backend implementiert)
const MessageService = {
  // Alle Nachrichten abrufen
  getMessages: async (): Promise<Message[]> => {
    // Hier wird später die API-Anfrage implementiert
    // return await fetch('/api/messages').then(res => res.json());
    return []; // Leeres Array zurückgeben, bis Backend verfügbar ist
  },
  
  // Nachricht als gelesen markieren
  markAsRead: async (id: number): Promise<void> => {
    // Hier wird später die API-Anfrage implementiert
    // await fetch(`/api/messages/${id}/read`, { method: 'PUT' });
  },
  
  // Nachricht als ungelesen markieren
  markAsUnread: async (id: number): Promise<void> => {
    // Hier wird später die API-Anfrage implementiert
    // await fetch(`/api/messages/${id}/unread`, { method: 'PUT' });
  },
  
  // Alle Nachrichten als gelesen markieren
  markAllAsRead: async (): Promise<void> => {
    // Hier wird später die API-Anfrage implementiert
    // await fetch('/api/messages/read-all', { method: 'PUT' });
  },
  
  // Antwort auf eine Nachricht senden
  sendReply: async (messageId: number, content: string): Promise<MessageThread> => {
    // Hier wird später die API-Anfrage implementiert
    // return await fetch(`/api/messages/${messageId}/reply`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ content })
    // }).then(res => res.json());
    
    // Dummy-Antwort zurückgeben, bis Backend verfügbar ist
    return {
      id: Date.now(),
      sender: 'Verkäufer',
      content,
      timestamp: new Date().toISOString(),
      isCustomer: false
    };
  }
};

const Messages: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [replyText, setReplyText] = useState('');

  // Nachrichten beim ersten Laden abrufen
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const data = await MessageService.getMessages();
        setMessages(data);
        setError(null);
      } catch (err) {
        setError('Fehler beim Laden der Nachrichten');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
    
    // WebSocket-Verbindung für Echtzeit-Updates einrichten
    // Dies wird später vom Backend implementiert
    // const socket = new WebSocket('ws://your-backend-url/messages');
    // socket.onmessage = (event) => {
    //   const data = JSON.parse(event.data);
    //   if (data.type === 'new_message') {
    //     setMessages(prevMessages => [data.message, ...prevMessages]);
    //   }
    // };
    
    // return () => {
    //   socket.close();
    // };
  }, []);

  // Nachricht als gelesen markieren
  const markAsRead = async (id: number) => {
    try {
      await MessageService.markAsRead(id);
      setMessages(messages.map(msg => 
        msg.id === id ? { ...msg, read: true } : msg
      ));
    } catch (err) {
      setError('Fehler beim Markieren der Nachricht als gelesen');
      console.error(err);
    }
  };

  // Nachricht als ungelesen markieren
  const markAsUnread = async (id: number) => {
    try {
      await MessageService.markAsUnread(id);
      setMessages(messages.map(msg => 
        msg.id === id ? { ...msg, read: false } : msg
      ));
      // Wenn die aktuell ausgewählte Nachricht als ungelesen markiert wird, Auswahl aufheben
      if (selectedMessage === id) {
        setSelectedMessage(null);
      }
    } catch (err) {
      setError('Fehler beim Markieren der Nachricht als ungelesen');
      console.error(err);
    }
  };

  // Alle Nachrichten als gelesen markieren
  const markAllAsRead = async () => {
    try {
      await MessageService.markAllAsRead();
      setMessages(messages.map(msg => ({ ...msg, read: true })));
    } catch (err) {
      setError('Fehler beim Markieren aller Nachrichten als gelesen');
      console.error(err);
    }
  };

  // Nachricht auswählen und als gelesen markieren
  const selectMessage = async (id: number) => {
    setSelectedMessage(id);
    await markAsRead(id);
  };

  // Antwort senden
  const sendReply = async () => {
    if (!replyText.trim() || selectedMessage === null) return;

    try {
      const newReply = await MessageService.sendReply(selectedMessage, replyText);
      
      setMessages(messages.map(msg => 
        msg.id === selectedMessage 
          ? { ...msg, messages: [...msg.messages, newReply] } 
          : msg
      ));

      setReplyText('');
    } catch (err) {
      setError('Fehler beim Senden der Antwort');
      console.error(err);
    }
  };

  // Nachrichten filtern
  const filteredMessages = activeFilter === 'all' 
    ? messages 
    : messages.filter(msg => msg.type === activeFilter);

  // Ausgewählte Nachricht finden
  const currentMessage = selectedMessage 
    ? messages.find(msg => msg.id === selectedMessage) 
    : null;

  // Datum formatieren
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Anzahl ungelesener Nachrichten
  const unreadCount = messages.filter(msg => !msg.read).length;

  if (loading) {
    return <div className="loading-messages">Nachrichten werden geladen...</div>;
  }

  if (error) {
    return <div className="error-messages">{error}</div>;
  }

  return (
    <div className="messages-container">
      <div className="messages-sidebar">
        <div className="messages-header">
          <div className="messages-title-row">
            <h2>Nachrichten</h2>
            {unreadCount > 0 && (
              <span className="unread-count">{unreadCount}</span>
            )}
          </div>
          <div className="messages-actions">
            <button 
              className="action-link"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              Alle als gelesen markieren
            </button>
          </div>
          <div className="messages-filters">
            <button 
              className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              Alle
            </button>
            <button 
              className={`filter-btn ${activeFilter === 'customer' ? 'active' : ''}`}
              onClick={() => setActiveFilter('customer')}
            >
              Kunden
            </button>
            <button 
              className={`filter-btn ${activeFilter === 'system' ? 'active' : ''}`}
              onClick={() => setActiveFilter('system')}
            >
              System
            </button>
            <button 
              className={`filter-btn ${activeFilter === 'platform' ? 'active' : ''}`}
              onClick={() => setActiveFilter('platform')}
            >
              Plattform
            </button>
          </div>
        </div>
        
        <div className="messages-list">
          {filteredMessages.length === 0 ? (
            <div className="no-messages">
              <p>Keine Nachrichten gefunden</p>
            </div>
          ) : (
            filteredMessages.map(message => (
              <div 
                key={message.id}
                className={`message-item ${!message.read ? 'unread' : ''} ${selectedMessage === message.id ? 'selected' : ''}`}
                onClick={() => selectMessage(message.id)}
              >
                <div className="message-avatar">
                  {message.avatar ? (
                    <img src={message.avatar} alt={message.sender} />
                  ) : (
                    <div className="avatar-placeholder">
                      {message.sender.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="message-content">
                  <div className="message-header">
                    <span className={`message-sender ${!message.read ? 'unread-text' : ''}`}>
                      {message.sender}
                    </span>
                    <span className="message-date">{formatDate(message.date).split(',')[0]}</span>
                  </div>
                  <div className={`message-subject ${!message.read ? 'unread-text' : ''}`}>
                    {message.subject}
                  </div>
                  <div className="message-preview">{message.preview}</div>
                </div>
                {!message.read && <div className="unread-indicator"></div>}
              </div>
            ))
          )}
        </div>
      </div>
      
      <div className="message-detail">
        {selectedMessage ? (
          <>
            <div className="detail-header">
              <div className="detail-header-info">
                <h3>{currentMessage?.subject}</h3>
                {currentMessage?.senderEmail && (
                  <div className="sender-email">{currentMessage.senderEmail}</div>
                )}
              </div>
              <div className="detail-actions">
                <button 
                  className="action-btn"
                  onClick={() => markAsUnread(selectedMessage)}
                >
                  Als ungelesen markieren
                </button>
                <button className="action-btn">Archivieren</button>
                <button className="action-btn">Löschen</button>
              </div>
            </div>
            
            <div className="message-thread">
              {currentMessage?.messages.map(msg => (
                <div key={msg.id} className={`thread-message ${msg.isCustomer ? 'customer' : 'seller'}`}>
                  <div className="thread-avatar">
                    <div className="avatar-placeholder">
                      {msg.sender.charAt(0)}
                    </div>
                  </div>
                  <div className="thread-content">
                    <div className="thread-header">
                      <span className="thread-sender">{msg.sender}</span>
                      <span className="thread-date">{formatDate(msg.timestamp)}</span>
                    </div>
                    <div className="thread-body">
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="reply-container">
              <textarea
                className="reply-input"
                placeholder="Antwort schreiben..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              ></textarea>
              <div className="reply-actions">
                <button className="reply-btn" onClick={sendReply}>Senden</button>
              </div>
            </div>
          </>
        ) : (
          <div className="no-message-selected">
            <p>Wählen Sie eine Nachricht aus, um sie anzuzeigen.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;