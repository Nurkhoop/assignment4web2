const express = require("express");
const router = express.Router();

const feedbackController = require("../controllers/feedbackController");
const optionalAuth = require("../middleware/optionalAuth");
const authMiddleware = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/roleMiddleware");

// public create (optional auth)
router.post("/", optionalAuth, feedbackController.createFeedback);

// admin read
router.get("/", authMiddleware, adminOnly, feedbackController.getFeedback);

module.exports = router;
