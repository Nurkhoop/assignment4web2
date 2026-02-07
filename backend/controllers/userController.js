const User = require("../models/User");
const bcrypt = require("bcryptjs");

// READ ALL USERS (auth)
exports.getUsers = async (req, res) => {
  try {
    const query = req.user.role === "admin" ? {} : { isDeleted: { $ne: true } };
    const projection = req.user.role === "admin" ? "-password" : "email";
    const users = await User.find(query).select(projection);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ ONE USER (admin)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user || user.isDeleted) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE USER ROLE (admin)
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).select("-password");

    if (!user || user.isDeleted) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// SOFT DELETE USER (admin)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || user.isDeleted) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isDeleted = true;
    user.email = `deleted+${user._id}@user.com`;
    await user.save();

    res.json({ message: "User soft deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE USER ROLE (admin)
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!role || !["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");

    if (!user || user.isDeleted) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// BLOCK/UNBLOCK USER (admin)
exports.setUserBlocked = async (req, res) => {
  try {
    const { isBlocked } = req.body;
    if (typeof isBlocked !== "boolean") {
      return res.status(400).json({ message: "isBlocked must be boolean" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBlocked },
      { new: true }
    ).select("-password");

    if (!user || user.isDeleted) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// RESTORE USER (admin)
exports.restoreUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isDeleted: false },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE MY SETTINGS (auth)
exports.updateMySettings = async (req, res) => {
  try {
    const { theme, notifications } = req.body;

    const updates = {};
    if (theme && ["light", "dark"].includes(theme)) {
      updates["preferences.theme"] = theme;
    }
    if (notifications !== undefined) updates["preferences.notifications"] = notifications;

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select("-password");

    if (!user || user.isDeleted) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE MY PROFILE (auth)
exports.updateMyProfile = async (req, res) => {
  try {
    const { displayName } = req.body;
    const updates = {};
    if (displayName !== undefined) updates.displayName = displayName.trim();

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select("-password");
    if (!user || user.isDeleted) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CHANGE PASSWORD (auth)
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new password required" });
    }

    const user = await User.findById(req.user.id);
    if (!user || user.isDeleted) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: "Password updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
