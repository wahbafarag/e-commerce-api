const asyncHandler = require("express-async-handler");
const User = require("../models/user-model");

exports.addUserAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    { _id: req.user._id },
    { $addToSet: { address: req.body } },
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: "Address added Successfully",
    address: user.address,
  });
});

exports.updateUserAddress = asyncHandler(async (req, res, next) => {
  const { addressId } = req.params;
  const user = await User.findOneAndUpdate(
    { _id: req.user._id, "address._id": addressId },
    { $set: { "address.$": req.body } },
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: "Address updated Successfully",
    address: user.address,
  });
});

exports.deleteUserAddress = asyncHandler(async (req, res, next) => {
  const { addressId } = req.params;
  const user = await User.findByIdAndUpdate(
    { _id: req.user._id },
    { $pull: { address: { _id: addressId } } },
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: "Address deleted Successfully",
    address: user.address,
  });
});

exports.getUserAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("address");

  res.status(200).json({
    success: true,
    results: user.address.length,
    address: user.address,
  });
});

exports.clearUserAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    { _id: req.user._id },
    { $set: { address: [] } },
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: "Addresses cleared Successfully",
    address: user.address,
  });
});
