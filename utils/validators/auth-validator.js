const { body, check } = require("express-validator");
const slugify = require("slugify");
const User = require("../../models/user-model");
const ApiError = require("../apiError");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.signupValidator = [
  body("name")
    .optional()
    .custom((value, { req }) => {
      if (value) req.body.slug = slugify(value);
      return true;
    }),

  check("name")
    .notEmpty()
    .optional()
    .withMessage("User Name is required")
    .isLength({ min: 4 })
    .withMessage("User name is too short")
    .isLength({ max: 30 })
    .withMessage("User name is too long"),

  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email is invalid")
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then((user) => {
        if (user) {
          return Promise.reject(new ApiError("Email already in use", 400));
        }
      });
    }),

  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("Password confirm is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new ApiError("Password confirm does not match password", 400);
      }
      return true;
    }),

  check("phone")
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number"),

  validatorMiddleware,
];

exports.loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("Please Provide your email address")
    .isEmail()
    .withMessage("Email format is invalid"),
  check("password")
    .notEmpty()
    .withMessage("Provide your password please ")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  validatorMiddleware,
];

exports.forgotPassValidator = [
  check("email")
    .notEmpty()
    .withMessage("Please Provide your email address")
    .isEmail()
    .withMessage("Email format is invalid"),
  validatorMiddleware,
];

exports.resetPassValidator = [
  check("password")
    .notEmpty()
    .withMessage("Provide your password please ")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  check("token").notEmpty().withMessage("Token is required"),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("Password confirm is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new ApiError("Password confirm does not match password", 400);
      }
      return true;
    }),
  validatorMiddleware,
];
