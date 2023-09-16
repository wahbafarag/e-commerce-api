const asyncHandler = require("express-async-handler");
const User = require("../models/user-model");

exports.addToWishlist = asyncHandler(async (req, res, next) => {
  const { productId } = req.body;
  const user = await User.findByIdAndUpdate(
    { _id: req.user._id },
    {
      $addToSet: { wishlist: productId },
    },
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: "Product added to your wishlist",
    wishlist: user.wishlist,
  });
});

exports.getWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("wishlist");

  res.status(200).json({
    success: true,
    results: user.wishlist.length,
    wishlist: user.wishlist,
  });
});

exports.removeFromWishlist = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const user = await User.findByIdAndUpdate(
    { _id: req.user._id },
    {
      $pull: { wishlist: productId },
    },
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: "Product removed from your wishlist",
    wishlist: user.wishlist,
  });
});

exports.clearWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    { _id: req.user._id },
    {
      $set: { wishlist: [] },
    },
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: "Wishlist cleared",
    wishlist: user.wishlist,
  });
});
