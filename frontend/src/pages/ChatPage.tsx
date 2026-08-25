import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { IConversation } from '../types';
import { ChatWindow } from '../components/ChatWindow';
import { MessageSquare } from 'lucide-react';

export const ChatPage: React.FC = () => {
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<IConversation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await api.get('/chat/conversations');
        if (res.data.success) {
          setConversations(res.data.conversations);
          if (res.data.conversations.length > 0) {
            setSelectedConv(res.data.conversations[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching conversations', err);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center space-x-2">
          <MessageSquare className="h-6 w-6 text-blue-600" />
          <span>Messages & Real-Time Communication</span>
        </h1>
        <p className="text-slate-500 text-sm">
          Communicate directly with your logistics partners regarding consignment bookings and pickup details
        </p>
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-400 font-semibold">Loading conversation list...</div>
      ) : conversations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-2">
          <MessageSquare className="h-10 w-10 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">No Active Conversations</h3>
          <p className="text-slate-500 text-sm">Create a cargo space booking to initiate direct chat with logistics providers.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Conversation List Sidebar */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-2 max-h-[520px] overflow-y-auto">
            <h3 className="text-xs font-bold uppercase text-slate-500 px-2 py-1">Booking Conversations</h3>
            {conversations.map((conv) => {
              const isSelected = selectedConv?._id === conv._id;
              const booking = conv.bookingId as any;

              return (
                <button
                  key={conv._id}
                  onClick={() => setSelectedConv(conv)}
                  className={`w-full text-left p-3 rounded-xl transition border ${
                    isSelected ? 'bg-blue-50 border-blue-200' : 'bg-slate-50/70 border-slate-100 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-slate-900 text-sm">{booking?.bookingNumber || 'Booking Ref'}</span>
                    <span className="text-[10px] text-slate-400">
                      {conv.lastMessageAt ? new Date(conv.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-slate-600 block mt-0.5">
                    {booking?.route?.origin} → {booking?.route?.destination}
                  </span>
                  <p className="text-xs text-slate-400 truncate mt-1">{conv.lastMessage || 'Click to view messages'}</p>
                </button>
              );
            })}
          </div>

          {/* Chat Window Panel */}
          <div className="md:col-span-2">
            {selectedConv ? (
              <ChatWindow
                conversationId={selectedConv._id}
                bookingNumber={(selectedConv.bookingId as any)?.bookingNumber}
                recipientName={(selectedConv.bookingId as any)?.providerName}
              />
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
                Select a conversation from the sidebar to view chat.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
