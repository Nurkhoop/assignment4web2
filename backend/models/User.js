const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },
    displayName: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      default: "offline"
    },
    isBlocked: {
      type: Boolean,
      default: false
    },
    preferences: {
      theme: {
        type: String,
        enum: ["light", "dark"],
        default: "light"
      },
      notifications: {
        type: Boolean,
        default: true
      }
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
