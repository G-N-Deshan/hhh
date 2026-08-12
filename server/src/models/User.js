const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["student", "provider", "admin", "volunteer"],
      default: "student",
    },
    department: {
      type: String,
      enum: [
        "Department of Information & Communication Technology",
        "Department of Engineering Technology",
        "Department of Biosystems Technology",
        "General",
      ],
      default: "General",
    },
    location: {
      type: String,
      default: "Matara",
    },
    bio: {
      type: String,
      default: "",
    },
    interests: {
      type: [String],
      default: ["Scholarships", "Internships"],
    },
    preferredLanguage: {
      type: String,
      default: "English",
    },
    accessibilityNeeds: {
      type: String,
      default: "None",
    },
    savedOpportunities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Opportunity",
      },
    ],
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
