const Message = require("../models/Message");
const Chat = require("../models/Chat");
const { getIO } = require("../socket");

// CREATE (auth)
exports.createMessage = async (req, res) => {
  try {
    const chatId = req.params.chatId || req.body.chat;
    const { text } = req.body;

    if (!chatId || !text || !text.trim()) {
      return res.status(400).json({ message: "Chat and text required" });
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const isParticipant = chat.participants.some(
      (participant) => participant.toString() === req.user.id
    );
    if (!isParticipant && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const message = await Message.create({
      chat: chatId,
      sender: req.user.id,
      text: text.trim()
    });

    await message.populate("sender", "email role");

    try {
      const io = getIO();
      const chat = await Chat.findById(chatId).select("participants");
      if (chat) {
        chat.participants.forEach((participant) => {
          if (participant.toString() !== req.user.id) {
            io.to(`user:${participant.toString()}`).emit("message:new", message);
          }
        });
      }
    } catch (error) {
      // socket not available
    }
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ BY CHAT (auth)
exports.getMessagesByChat = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const isParticipant = chat.participants.some(
      (participant) => participant.toString() === req.user.id
    );
    if (!isParticipant && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "email role")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// MARK CHAT MESSAGES READ (auth)
exports.markChatRead = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const isParticipant = chat.participants.some(
      (participant) => participant.toString() === req.user.id
    );
    if (!isParticipant && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    await Message.updateMany(
      { chat: req.params.chatId, sender: { $ne: req.user.id }, isRead: false },
      { $set: { isRead: true } }
    );

    res.json({ message: "Messages marked as read" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// SEARCH MESSAGES IN CHAT (auth)
exports.searchMessagesByChat = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== "string") {
      return res.status(400).json({ message: "Query is required" });
    }

    const chat = await Chat.findById(req.params.chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const isParticipant = chat.participants.some(
      (participant) => participant.toString() === req.user.id
    );
    if (!isParticipant && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const messages = await Message.find({
      chat: req.params.chatId,
      text: { $regex: q, $options: "i" }
    })
      .populate("sender", "email role")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE (admin or sender)
exports.updateMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    const isSender = message.sender.toString() === req.user.id;
    if (!isSender && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    if (req.body.text !== undefined) {
      const trimmed = req.body.text.trim();
      if (!trimmed) {
        return res.status(400).json({ message: "Text cannot be empty" });
      }
      message.text = trimmed;
    }
    message.edited = true;
    await message.save();
    await message.populate("sender", "email role");
    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE (admin or sender)
exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    const isSender = message.sender.toString() === req.user.id;
    if (!isSender && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    await message.deleteOne();
    res.json({ message: "Message deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
