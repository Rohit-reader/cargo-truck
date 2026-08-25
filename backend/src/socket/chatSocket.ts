import { Server, Socket } from 'socket.io';
import { Message, Conversation } from '../models/Conversation';

export const setupChatSocket = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log(`[Socket.IO] User connected: ${socket.id}`);

    // Join room corresponding to a specific booking / conversation
    socket.on('join_conversation', (conversationId: string) => {
      socket.join(conversationId);
      console.log(`[Socket.IO] Socket ${socket.id} joined room ${conversationId}`);
    });

    // Handle sending a new message
    socket.on('send_message', async (data: { conversationId: string; bookingId: string; senderId: string; senderName: string; senderRole: string; text: string }) => {
      try {
        const { conversationId, bookingId, senderId, senderName, senderRole, text } = data;

        const message = await Message.create({
          conversationId,
          bookingId,
          senderId,
          senderName,
          senderRole,
          text,
          isRead: false,
        });

        const conversation = await Conversation.findById(conversationId);
        if (conversation) {
          conversation.lastMessage = text;
          conversation.lastMessageAt = new Date();
          if (senderRole === 'TRADER') {
            conversation.unreadCountProvider += 1;
          } else {
            conversation.unreadCountTrader += 1;
          }
          await conversation.save();
        }

        // Broadcast to all clients in this conversation room
        io.to(conversationId).emit('receive_message', message);
      } catch (err) {
        console.error('[Socket.IO] Error saving message:', err);
      }
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.IO] User disconnected: ${socket.id}`);
    });
  });
};
