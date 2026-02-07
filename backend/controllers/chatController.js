const Chat = require("../models/Chat");
const User = require("../models/User");

const normalizeParticipants = async (participants, requesterId) => {
  const set = new Set([requesterId.toString()]);
  const input = Array.isArray(participants)
    ? participants
    : participants
    ? [participants]
    : [];

  for (const value of input) {
    if (typeof value === "string" && value.includes("@")) {
      const user = await User.findOne({ email: value, isDeleted: { $ne: true } });
      if (!user) {
        return { error: `User not found: ${value}` };
      }
      set.add(user._id.toString());
    } else if (value) {
      set.add(value.toString());
    }
  }

  const ids = Array.from(set);
  if (ids.length < 2) {
    return { error: "At least 2 valid participants required" };
  }

  const existing = await User.find({ _id: { $in: ids }, isDeleted: { $ne: true } }).select("_id");
  if (existing.length !== ids.length) {
    return { error: "Some participants do not exist" };
  }

  return { ids };
};

// CREATE (auth)
exports.createChat = async (req, res) => {
  try {
    const { title, participants } = req.body;

    const normalized = await normalizeParticipants(participants, req.user.id);
    if (normalized.error) {
      return res.status(400).json({ message: normalized.error });
    }

    const trimmedTitle = title ? title.trim() : "";
    const chat = await Chat.create({
      title: trimmedTitle || undefined,
      participants: normalized.ids,
      createdBy: req.user.id
    });

    await chat.populate("participants", "email role");
    await chat.populate("createdBy", "email role");
    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ (auth)
exports.getChats = async (req, res) => {
  try {
    const chats = await Chat.find({ participants: req.user.id })
      .populate("participants", "email role")
      .populate("createdBy", "email role");

    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ ALL (admin)
exports.getAllChats = async (req, res) => {
  try {
    const chats = await Chat.find()
      .populate("participants", "email role")
      .populate("createdBy", "email role");

    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ ONE (auth)
exports.getChatById = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id)
      .populate("participants", "email role")
      .populate("createdBy", "email role");

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const isParticipant = chat.participants.some(
      (participant) => participant._id.toString() === req.user.id
    );
    if (!isParticipant && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE (admin or creator)
exports.updateChat = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const isCreator = chat.createdBy.toString() === req.user.id;
    if (!isCreator && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    if (req.body.participants) {
      const normalized = await normalizeParticipants(req.body.participants, req.user.id);
      if (normalized.error) {
        return res.status(400).json({ message: normalized.error });
      }
      chat.participants = normalized.ids;
    }

    if (req.body.title !== undefined) {
      const trimmedTitle = req.body.title.trim();
      chat.title = trimmedTitle || "Chat";
    }

    await chat.save();
    await chat.populate("participants", "email role");
    await chat.populate("createdBy", "email role");
    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE (admin or creator)
exports.deleteChat = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const isCreator = chat.createdBy.toString() === req.user.id;
    if (!isCreator && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    await chat.deleteOne();
    res.json({ message: "Chat deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
