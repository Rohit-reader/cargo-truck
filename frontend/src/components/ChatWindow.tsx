import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import { IMessage } from '../types';
import { Send, MessageSquare, User, Clock } from 'lucide-react';

interface ChatWindowProps {
  conversationId: string;
  bookingNumber?: string;
  recipientName?: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ conversationId, bookingNumber, recipientName }) => {
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/chat/messages/${conversationId}`);
        if (res.data.success) {
          setMessages(res.data.messages);
        }
      } catch (err) {
        console.error('Error loading messages', err);
      } finally {
        setLoading(false);
      }
    };

    if (conversationId) {
      fetchMessages();
    }
  }, [conversationId]);

  useEffect(() => {
    if (!socket || !conversationId) return;

    socket.emit('join_conversation', conversationId);

    const handleReceiveMessage = (msg: IMessage) => {
      if (msg.conversationId === conversationId) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on('receive_message', handleReceiveMessage);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
    };
  }, [socket, conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !user) return;

    const messageText = text.trim();
    setText('');

    // Send via socket if connected
    if (socket && isConnected) {
      socket.emit('send_message', {
        conversationId,
        bookingId: messages[0]?.bookingId || '',
        senderId: user.id,
        senderName: user.fullName,
        senderRole: user.role,
        text: messageText,
      });
    } else {
      // Fallback via HTTP REST
      try {
        const res = await api.post('/chat/messages', {
          conversationId,
          text: messageText,
        });
        if (res.data.success) {
          setMessages((prev) => [...prev, res.data.message]);
        }
      } catch (err) {
        console.error('Error sending message', err);
      }
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-[520px]">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              {recipientName ? `Chat with ${recipientName}` : 'Booking Conversation'}
            </h4>
            {bookingNumber && (
              <span className="text-xs text-slate-500 font-medium">Ref: {bookingNumber}</span>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-1.5 text-xs font-semibold">
          <span className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          <span className="text-slate-500">{isConnected ? 'Live Chat Online' : 'Connecting...'}</span>
        </div>
      </div>

      {/* Message History */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
        {loading ? (
          <div className="text-center text-slate-400 text-sm py-8">Loading chat history...</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-slate-400 text-sm py-8">
            No messages yet. Send a message to start communicating with the provider.
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === user?.id;
            return (
              <div key={msg._id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div
                  className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                    isMe ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
                  }`}
                >
                  <div className={`text-[11px] font-bold mb-1 ${isMe ? 'text-blue-100' : 'text-slate-500'}`}>
                    {msg.senderName} ({msg.senderRole})
                  </div>
                  <p className="leading-relaxed font-medium">{msg.text}</p>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Form */}
      <form onSubmit={handleSend} className="p-3 border-t border-slate-200 bg-white rounded-b-xl flex items-center space-x-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder:text-slate-400"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-bold text-sm transition flex items-center space-x-1 shadow-sm"
        >
          <span>Send</span>
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};
