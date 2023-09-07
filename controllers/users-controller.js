const path = require("path");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const bcrypt = require("bcryptjs");
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
  await doc.save();

  res.status(200).json({
    status: "success",
    doc,
  });
});

exports.deleteUser = factory.deleteOne(User);
