const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const Review = require("../../models/review-model");

exports.createReviewValidator = [
  check("title").optional().isString().withMessage("Title must be a string"),
  check("ratings")
    .notEmpty()
    .withMessage("Ratings must not be empty")
    .isFloat({
      min: 1,
      max: 5,
    })
    .withMessage("Ratings must be between 1 and 5"),

  check("user").isMongoId().withMessage("User id must be valid id"),

  check("product")
    .isMongoId()
    .withMessage("Product id must be valid id")
    .custom((val, { req }) =>
      Review.findOne({ user: req.user._id, product: req.body.product }).then(
        (review) => {
          if (review) {
            return Promise.reject(
              new Error("You already reviewed this product")
            );
          }
        }
      )
    ),
  validatorMiddleware,
];

exports.getReviewByIdValidator = [
  check("id").isMongoId().withMessage("Review id must be valid "),
  validatorMiddleware,
];

exports.updateReviewByIdValidator = [
  check("id")
    .isMongoId()
    .withMessage("Review id must be valid id")

    .custom((val, { req }) =>
      Review.findById(val).then((review) => {
        if (!review) {
          return Promise.reject(
            new Error("Review not found or already deleted")
          );
        }
        if (review.user._id.toString() !== req.user._id.toString()) {
          return Promise.reject(
            new Error("You are not allowed to update this review")
          );
        }
      })
    ),
  validatorMiddleware,
];

exports.deleteReviewByIdValidator = [
  check("id")
    .isMongoId()
    .withMessage("Review id must be valid id")
    .custom((val, { req }) => {
      if (req.user.role === "user") {
        return Review.findById(val).then((review) => {
          if (!review) {
            return Promise.reject(
              new Error("Review not found or already deleted")
            );
          }
          if (review.user._id.toString() !== req.user._id.toString()) {
            return Promise.reject(
              new Error("You are not allowed to delete this review")
            );
          }
        });
      }

      return true; // allow admin and manager to delete any review
    }),
  validatorMiddleware,
];
