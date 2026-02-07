const express = require("express");
const router = express.Router();

const chatController = require("../controllers/chatController");
const authMiddleware = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/roleMiddleware");

// auth
router.get("/", authMiddleware, chatController.getChats);

// admin
router.get("/admin/all", authMiddleware, adminOnly, chatController.getAllChats);

// auth
router.get("/:id", authMiddleware, chatController.getChatById);

// auth protected
router.post("/", authMiddleware, chatController.createChat);
router.put("/:id", authMiddleware, chatController.updateChat);
router.delete("/:id", authMiddleware, chatController.deleteChat);

module.exports = router;
