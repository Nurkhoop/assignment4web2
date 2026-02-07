const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/roleMiddleware");

// auth
router.get("/", authMiddleware, userController.getUsers);
router.put("/me/settings", authMiddleware, userController.updateMySettings);
router.put("/me/profile", authMiddleware, userController.updateMyProfile);
router.put("/me/password", authMiddleware, userController.changePassword);
router.put("/:id/role", authMiddleware, adminOnly, userController.updateUserRole);
router.put("/:id/block", authMiddleware, adminOnly, userController.setUserBlocked);
router.put("/:id/restore", authMiddleware, adminOnly, userController.restoreUser);
router.get("/:id", authMiddleware, adminOnly, userController.getUserById);
router.put("/:id", authMiddleware, adminOnly, userController.updateUser);
router.delete("/:id", authMiddleware, adminOnly, userController.deleteUser);

module.exports = router;
