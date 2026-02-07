const express = require("express");
const router = express.Router();

const messageController = require("../controllers/messageController");
const authMiddleware = require("../middleware/authMiddleware");

// auth protected
router.get("/chat/:chatId", authMiddleware, messageController.getMessagesByChat);
router.get("/chat/:chatId/search", authMiddleware, messageController.searchMessagesByChat);
router.put("/chat/:chatId/read", authMiddleware, messageController.markChatRead);
router.post("/chat/:chatId", authMiddleware, messageController.createMessage);
router.put("/:id", authMiddleware, messageController.updateMessage);
router.delete("/:id", authMiddleware, messageController.deleteMessage);

module.exports = router;
