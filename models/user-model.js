const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const { raw } = require("express");
const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name is required"],
    },

    slug: {
      type: String,
      // trim: true,
      lowercase: true,
    },

    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      lowercase: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },

    passwordChangedAt: Date,

    passwordResetToken: String,
    resetTokenExpires: Date,
    resetPasswordVerified: Boolean,

    phone: String,

    profileImage: String,

    role: {
      type: String,
      enum: ["user", "admin", "manager"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hashSync(this.password, 12);
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
