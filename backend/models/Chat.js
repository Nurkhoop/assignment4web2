const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "Chat"
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      }
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);