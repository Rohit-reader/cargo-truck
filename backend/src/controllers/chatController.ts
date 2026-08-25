import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { Conversation, Message } from '../models/Conversation';
import { Booking } from '../models/Booking';

export const getConversations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    let query: any = {};
    if (req.user.role === 'TRADER') {
      query.traderId = req.user._id;
    } else if (req.user.role === 'PROVIDER') {
      query.providerUserId = req.user._id;
    } else if (req.user.role === 'ADMIN') {
      query = {};
    }

    const conversations = await Conversation.find(query)
      .populate('bookingId')
      .sort({ updatedAt: -1 });

    res.json({ success: true, count: conversations.length, conversations });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error fetching conversations.' });
  }
};

export const getMessages = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { conversationId } = req.params;
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      res.status(404).json({ success: false, message: 'Conversation not found.' });
      return;
    }

    // Authorization check
    if (
      req.user?.role !== 'ADMIN' &&
      conversation.traderId.toString() !== req.user?._id.toString() &&
      conversation.providerUserId.toString() !== req.user?._id.toString()
    ) {
      res.status(403).json({ success: false, message: 'Access denied to this conversation.' });
      return;
    }

    const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });

    // Reset unread count
    if (req.user?.role === 'TRADER') {
      conversation.unreadCountTrader = 0;
    } else if (req.user?.role === 'PROVIDER') {
      conversation.unreadCountProvider = 0;
    }
    await conversation.save();

    res.json({ success: true, count: messages.length, messages });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error fetching messages.' });
  }
};

export const sendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { conversationId, text } = req.body;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      res.status(404).json({ success: false, message: 'Conversation not found.' });
      return;
    }

    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const message = await Message.create({
      conversationId: conversation._id,
      bookingId: conversation.bookingId,
      senderId: req.user._id,
      senderName: req.user.fullName,
      senderRole: req.user.role,
      text,
      isRead: false,
    });

    conversation.lastMessage = text;
    conversation.lastMessageAt = new Date();

    if (req.user.role === 'TRADER') {
      conversation.unreadCountProvider += 1;
    } else if (req.user.role === 'PROVIDER') {
      conversation.unreadCountTrader += 1;
    }
    await conversation.save();

    res.status(201).json({ success: true, message });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error sending message.' });
  }
};
