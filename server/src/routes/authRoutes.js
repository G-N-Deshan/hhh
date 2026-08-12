const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  googleAuth,
  getMe,
  updateProfile,
  toggleSaveOpportunity,
  getUsers,
  updateUserRole,
  toggleUserStatus,
  deleteUser,
} = require("../controllers/authController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleAuth);
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.put("/bookmark/:opportunityId", protect, toggleSaveOpportunity);

// Admin user management
router.get("/users", protect, adminOnly, getUsers);
router.put("/users/:id/role", protect, adminOnly, updateUserRole);
router.put("/users/:id/status", protect, adminOnly, toggleUserStatus);
router.delete("/users/:id", protect, adminOnly, deleteUser);

module.exports = router;
