const path = require("path");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const sharp = require("sharp");
const factory = require("./handler-factory");
const User = require("../models/user-model");
const { uploadSingleImage } = require("../middlewares/image-upload");
const ApiError = require("../utils/apiError");

exports.uploadUserImage = uploadSingleImage("profileImage");

exports.resizeBrandImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const fileName = `user-${uuidv4()}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
      .resize(550, 550)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(path.join(__dirname, "../uploads/users/", fileName));
    req.body.profileImage = fileName;
  }

  next();
});

exports.createUser = factory.createOne(User);

exports.getAllUser = factory.getAll(User);

exports.getUser = factory.getOne(User);

exports.updateUser = asyncHandler(async (req, res, next) => {
  const doc = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      email: req.body.email,
      phone: req.body.phone,
      profileImage: req.body.profileImage,
      //role: req.body.role,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!doc) return next(new ApiError("Cant update user data", 404));

  res.status(200).json({
    status: "success",
    doc,
  });
});

exports.updatePassword = asyncHandler(async (req, res, next) => {
  const doc = await User.findById(req.params.id);
  if (!doc) return next(new ApiError("Cant update user data", 404));

  //doc.password = await bcrypt.hash(req.body.password, 12);
  doc.password = req.body.password;
  doc.passwordChangedAt = Date.now();
  await doc.save();

  res.status(200).json({
    status: "success",
    doc,
  });
});

exports.deleteUser = factory.deleteOne(User);

exports.getMe = asyncHandler(async (req, res, next) => {
  req.params.id = req.user.id;
  next();
});

exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user)
    return next(
      new ApiError("You are not Logged in , Please login and try again", 404)
    );

  user.password = req.body.password;
  user.passwordChangedAt = Date.now();
  await user.save();

  const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(200).json({
    status: "success",
    token,

    user,
  });
});

exports.updateMe = asyncHandler(async (req, res, next) => {
  // except pass , role

  const doc = await User.findByIdAndUpdate(
    { _id: req.user.id },
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    },
    { new: true }
  );
  if (!doc)
    return next(
      new ApiError("Cant update your info ,Please try again later", 404)
    );

  res.status(200).json({
    status: "success",
    data: doc,
  });
});

exports.deactivateMe = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });
  res.status(200).json({
    status: "success",

    message: "Your account is deactivated, sorry to see you go.",
  });
});

exports.activateMe = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: true });
  console.log(req.user);
  res.status(200).json({
    status: "success",
    message: "Welcome Back! Your account is activated now you can login",
  });
});
