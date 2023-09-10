const AsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendEmails = require("../utils/emails");
const User = require("../models/user-model");
const ApiError = require("../utils/apiError");

exports.signup = AsyncHandler(async (req, res, next) => {
  const { name, email, password, phone } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    phone,
  });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  res.status(201).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
});

exports.login = AsyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ApiError("Please provide email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await bcrypt.compare(password, user.password)))
    return next(new ApiError("Invalid Credentials", 401));

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  res.status(200).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
});

exports.protect = AsyncHandler(async (req, res, next) => {
  // check if token is there
  // verify token
  // check if user still exists
  // check if user changed password after the token was issued
  // grant access to protected route

  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token)
    return next(
      new ApiError(
        "In order to get access to our service , Please login!.",
        401
      )
    );
  //console.log(token);
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //console.log(decoded);
  const user = await User.findById(decoded.id);
  if (!user)
    return next(
      new ApiError(
        "The user belonging to this token does no longer exist ,Please signup and try again.",
        401
      )
    );

  if (
    user.passwordChangedAt &&
    parseInt(user.passwordChangedAt.getTime() / 1000, 10) > decoded.iat
  ) {
    //console.log(parseInt(user.passwordChangedAt.getTime() / 1000, 10));
    return next(
      new ApiError(
        "Recently you changed your password , please login with the new credentials ",
        401
      )
    );
  }

  req.user = user;
  next();
});

exports.restrictTo = (...roles) =>
  AsyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new ApiError("You do not have permission to perform this action", 403)
      );
    next();
  });

// reset password
// 1 user puts his email
// 2 generate random token
// 3 send it to user's email

exports.forgotPassword = AsyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return next(new ApiError("There is no user with this email address", 404));

  const resetToken = Math.floor(100000 + Math.random() * 900000).toString();

  user.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  user.resetTokenExpires = Date.now() + 15 * 60 * 1000;
  user.resetPasswordVerified = false;
  await user.save();

  try {
    const content = `Hi ${user.name} , We received a request to reset your Oranos E-Shop password.  Your verification code is ${resetToken}. Please enter this code in the reset password page.  If you did not request a password reset, please ignore this email or reply to let us know. This password reset is only valid for the next 15 minutes. Please dont share this code with anyone.`;
    await sendEmails({
      email: user.email,
      subject: "Your password reset token (valid for 15 minutes)",
      content,
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.resetTokenExpires = undefined;
    user.resetPasswordVerified = undefined;
    await user.save();
    return next(new ApiError("There was an error sending the email", 500));
  }

  res.status(200).json({
    status: "success",
    message: "Token sent to your email!",
  });
});

// 4 user sends token and new password
// 5 check if token is valid
// 6 update password
// 7 login user

exports.resetPassword = AsyncHandler(async (req, res, next) => {
  const token = req.body.token;

  const user = await User.findOne({
    passwordResetToken: crypto.createHash("sha256").update(token).digest("hex"),
    resetTokenExpires: { $gt: Date.now() },
  });
  if (!user) return next(new ApiError("Token is invalid or has expired", 400));

  user.resetPasswordVerified = true;
  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.resetTokenExpires = undefined;
  await user.save();

  res.status(200).json({
    status: "success",
    message: "Password updated successfully!",
    token: await jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }),
  });
});
