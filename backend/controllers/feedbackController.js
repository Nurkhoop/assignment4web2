const Feedback = require("../models/Feedback");

// CREATE (public)
exports.createFeedback = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!email || !message) {
      return res.status(400).json({ message: "Email and message are required" });
    }

    const feedback = await Feedback.create({
      name: name?.trim() || undefined,
      email: email.trim().toLowerCase(),
      message: message.trim(),
      user: req.user?.id
    });

    res.status(201).json({ message: "Feedback received", id: feedback._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ ALL (admin)
exports.getFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find()
      .sort({ createdAt: -1 })
      .populate("user", "email role");

    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
