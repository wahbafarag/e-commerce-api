const AsyncHandler = require("express-async-handler");
const Review = require("../models/review-model");
const factory = require("./handler-factory");

exports.createReview = factory.createOne(Review);

exports.getAllReviews = factory.getAll(Review);

exports.getReviewById = factory.getOne(Review);

exports.updateReviewById = factory.updateOne(Review);

exports.deleteReviewById = factory.deleteOne(Review);

exports.setProductAndUserIds = (req, res, next) => {
  //if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};

exports.getAllReviewsForProduct = AsyncHandler(async (req, res, next) => {});
