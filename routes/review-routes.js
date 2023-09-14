const express = require("express");
const router = express.Router({ mergeParams: true });
const reviewController = require("../controllers/review-controller");
const authController = require("../controllers/auth-controller");
const reviewValidators = require("../utils/validators/review-validators");

router
  .route("/")
  .post(
    authController.protect,
    authController.restrictTo("user"),
    reviewController.setProductAndUserIds,
    reviewValidators.createReviewValidator,
    reviewController.createReview
  )
  .get(reviewController.setFilterObject, reviewController.getAllReviews);

router
  .route("/:id")
  .get(reviewValidators.getReviewByIdValidator, reviewController.getReviewById)
  .patch(
    authController.protect,
    authController.restrictTo("user"),
    reviewValidators.updateReviewByIdValidator,
    reviewController.updateReviewById
  )
  .delete(
    authController.protect,
    authController.restrictTo("user", "admin", "manager"),
    reviewValidators.deleteReviewByIdValidator,
    reviewController.deleteReviewById
  );

module.exports = router;
