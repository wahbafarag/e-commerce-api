const express = require("express");
const router = express.Router({ mergeParams: true });
const reviewController = require("../controllers/review-controller");
const authController = require("../controllers/auth-controller");

router
  .route("/")
  .post(
    authController.protect,
    authController.restrictTo("user"),
    reviewController.createReview
  )
  .get(reviewController.getAllReviews);

router
  .route("/:id")
  .get(reviewController.getReviewById)
  .patch(
    authController.protect,
    authController.restrictTo("user"),
    reviewController.updateReviewById
  )
  .delete(
    authController.protect,
    authController.restrictTo("user", "admin", "manager"),
    reviewController.deleteReviewById
  );

module.exports = router;
