const AsyncHandler = require("express-async-handler");
const Review = require("../models/review-model");
const Product = require("../models/productModel");
const User = require("../models/user-model");
const factory = require("./handler-factory");

exports.createReview = factory.createOne(Review);

exports.getAllReviews = factory.getAll(Review);

exports.getReviewById = factory.getOne(Review);

exports.updateReviewById = factory.updateOne(Review);

exports.deleteReviewById = factory.deleteOne(Review);

// @desc    Get all reviews for a product
// @route   GET /api/v1/products/:productId/reviews
// @access  Public
exports.getAllReviewsForProduct = AsyncHandler(async (req, res, next) => {});
