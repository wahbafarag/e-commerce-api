const AsyncHandler = require("express-async-handler");
const Review = require("../models/review-model");
const factory = require("./handler-factory");

exports.setProductAndUserIds = (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};

exports.setFilterObject = (req, res, next) => {
  let filter = {};
  if (req.params.productId) filter = { product: req.params.productId };
  req.filterObj = filter;
  next();
};

exports.createReview = factory.createOne(Review);

exports.getAllReviews = factory.getAll(Review);

exports.getReviewById = factory.getOne(Review);

exports.updateReviewById = factory.updateOne(Review);

exports.deleteReviewById = factory.deleteOne(Review);
