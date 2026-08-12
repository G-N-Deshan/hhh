const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const { OAuth2Client } = require("google-auth-library");

const googleClient = new OAuth2Client();

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, department, location, interests, bio } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill in all required fields" });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || "student",
      department: department || "General",
      location: location || "Matara",
      interests: interests || ["Scholarships", "Internships"],
      bio: bio || "",
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        location: user.location,
        interests: user.interests,
        bio: user.bio,
        savedOpportunities: user.savedOpportunities || [],
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data provided" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ email }).populate("savedOpportunities");

    if (user && (await user.matchPassword(password))) {
      if (user.isBlocked) {
        return res.status(403).json({ message: "Your account has been suspended by administration." });
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        location: user.location,
        interests: user.interests,
        bio: user.bio,
        savedOpportunities: user.savedOpportunities || [],
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Google OAuth Auth / Sign-in / Sign-up
// @route   POST /api/auth/google
// @access  Public
const googleAuth = async (req, res) => {
  try {
    const { credential, department } = req.body;

    if (!credential) {
      return res.status(400).json({ message: "Google credential is required" });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(500).json({ message: "Google sign-in is not configured on the server" });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub: googleId, email, email_verified: emailVerified, name, picture } = payload;

    if (!email || !emailVerified) {
      return res.status(401).json({ message: "Google account email could not be verified" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    let user = await User
      .findOne({ $or: [{ googleId }, { email: normalizedEmail }] })
      .populate("savedOpportunities");

    if (user) {
      if (user.isBlocked) {
        return res.status(403).json({ message: "Your account has been suspended by administration." });
      }
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }
    } else {
      // Auto-create new user account with Google credentials
      const randomPassword = Math.random().toString(36).slice(-10) + "G!1";
      user = await User.create({
        name: name || normalizedEmail.split("@")[0],
        email: normalizedEmail,
        googleId,
        password: randomPassword,
        role: "student",
        department: department || "Department of Information & Communication Technology",
        location: "Matara",
        interests: ["Scholarships", "Internships"],
        bio: "Google Authenticated Student Account",
      });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      location: user.location,
      interests: user.interests,
      bio: user.bio,
      savedOpportunities: user.savedOpportunities || [],
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password").populate("savedOpportunities");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.department = req.body.department || user.department;
      user.location = req.body.location || user.location;
      user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
      user.preferredLanguage = req.body.preferredLanguage || user.preferredLanguage;
      user.accessibilityNeeds = req.body.accessibilityNeeds || user.accessibilityNeeds;
      if (req.body.interests) user.interests = req.body.interests;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        department: updatedUser.department,
        location: updatedUser.location,
        interests: updatedUser.interests,
        bio: updatedUser.bio,
        savedOpportunities: updatedUser.savedOpportunities || [],
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle Save/Bookmark opportunity
// @route   PUT /api/auth/bookmark/:opportunityId
// @access  Private
const toggleSaveOpportunity = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const oppId = req.params.opportunityId;

    if (!user) return res.status(404).json({ message: "User not found" });

    const index = user.savedOpportunities.indexOf(oppId);
    if (index > -1) {
      user.savedOpportunities.splice(index, 1);
    } else {
      user.savedOpportunities.push(oppId);
    }

    await user.save();
    const updatedUser = await User.findById(req.user._id).populate("savedOpportunities");
    res.json(updatedUser.savedOpportunities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users (Admin)
// @route   GET /api/auth/users
// @access  Private (Admin)
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user role (Admin)
// @route   PUT /api/auth/users/:id/role
// @access  Private (Admin)
const updateUserRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = req.body.role || user.role;
    await user.save();
    res.json({ message: "User role updated", role: user.role });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle block status (Admin)
// @route   PUT /api/auth/users/:id/status
// @access  Private (Admin)
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isBlocked = !user.isBlocked;
    await user.save();
    res.json({ message: "User status updated", isBlocked: user.isBlocked });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user (Admin)
// @route   DELETE /api/auth/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot delete your own admin account while logged in." });
    }

    await user.deleteOne();
    res.json({ message: "User removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
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
};
