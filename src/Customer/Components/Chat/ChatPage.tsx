import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../Store/Store";
import {
  fetchUserChats,
  fetchUserChatMessages,
  sendUserMessage,
  createChat,
  sendTypingStatus,
} from "../../../Services/chat/ChatSlice";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { toast } from "react-toastify";

const ChatPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { chats, currentChat, messages, loading, error, isTyping } =
    useSelector((state: RootState) => state.chat);
  const { jwt, user } = useSelector((state: RootState) => state.auth);

  const [messageInput, setMessageInput] = useState("");
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);

  useEffect(() => {
    if (!jwt) {
      navigate("/login");
      return;
    }

    dispatch(fetchUserChats());
  }, [dispatch, jwt, navigate]);

  useEffect(() => {
    if (selectedChatId) {
      dispatch(fetchUserChatMessages(selectedChatId));
    }
  }, [dispatch, selectedChatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleChatSelect = (chatId: number) => {
    setSelectedChatId(chatId);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!messageInput.trim() || !selectedChatId) return;

    dispatch(
      sendUserMessage({
        chatId: selectedChatId,
        content: messageInput,
      })
    )
      .unwrap()
      .then(() => {
        setMessageInput("");
      })
      .catch(() => {
        toast.error("Failed to send message");
      });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);

    if (selectedChatId) {
      dispatch(
        sendTypingStatus({
          chatId: selectedChatId,
          senderType: "USER",
          isTyping: e.target.value.length > 0,
        })
      );
    }
  };

  const handleCreateChat = () => {
    if (!jwt) return;

    dispatch(
      createChat({
        sellerId: 1, // This would typically come from a dropdown or search
        chatTitle: "Customer Support",
      })
    )
      .unwrap()
      .then((response) => {
        setSelectedChatId(response.id);
        toast.success("Chat created successfully");
      })
      .catch(() => {
        toast.error("Failed to create chat");
      });
  };

  if (loading && chats.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Messages</h1>

      <div className="flex flex-col md:flex-row h-[70vh] bg-white rounded-lg shadow-md overflow-hidden">
        {/* Chat list sidebar */}
        <div className="w-full md:w-1/3 border-r border-gray-200">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="font-semibold text-lg">Your Conversations</h2>
            <button
              onClick={handleCreateChat}
              className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700"
            >
              New Chat
            </button>
          </div>

          <div className="overflow-y-auto h-[calc(70vh-64px)]">
            {chats.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No conversations yet
              </div>
            ) : (
              chats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => handleChatSelect(chat.id)}
                  className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                    selectedChatId === chat.id ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold">
                      {chat.seller?.sellerName?.charAt(0) || "S"}
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex justify-between">
                        <p className="font-medium">
                          {chat.seller?.sellerName || "Seller"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(chat.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {typeof chat.lastMessage === "string"
                          ? chat.lastMessage
                          : chat.lastMessage?.content || "No messages yet"}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat messages */}
        <div className="w-full md:w-2/3 flex flex-col">
          {selectedChatId ? (
            <>
              <div className="p-4 border-b border-gray-200 flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold">
                  {currentChat?.seller?.sellerName?.charAt(0) || "S"}
                </div>
                <div className="ml-3">
                  <p className="font-medium">
                    {currentChat?.seller?.sellerName || "Seller"}
                  </p>
                  {isTyping[selectedChatId] && (
                    <p className="text-xs text-gray-500">typing...</p>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 mt-8">
                    No messages yet. Start the conversation!
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender === "USER"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg px-4 py-2 ${
                          message.sender === "USER"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        <p>{message.content}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <form
                onSubmit={handleSendMessage}
                className="border-t border-gray-200 p-4"
              >
                <div className="flex">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={handleInputChange}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={!messageInput.trim()}
                    className="bg-blue-600 text-white px-6 py-2 rounded-r hover:bg-blue-700 disabled:opacity-50"
                  >
                    Send
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <p className="mb-4">Select a conversation or start a new one</p>
                <button
                  onClick={handleCreateChat}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Start New Conversation
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
