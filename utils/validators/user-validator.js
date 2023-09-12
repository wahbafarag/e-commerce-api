const { check, body } = require("express-validator");
const bcrypt = require("bcryptjs");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const slugify = require("slugify");
const User = require("../../models/user-model");
const ApiError = require("../../utils/apiError");

exports.getUserValidator = [
  // 1 rules
  check("id")
    .isMongoId()
    .withMessage("Invalid format for Brand Id ")
    .notEmpty()
    .withMessage("Brand Id must have a valid value"),
  validatorMiddleware,
];

exports.createUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("User Name is required")
    .isLength({ min: 4 })
    .withMessage("User name is too short")
    .isLength({ max: 30 })
    .withMessage("User name is too long")
    .custom((value, { req }) => {
      if (value) req.body.slug = slugify(value);
      return true;
    }),
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

  check("profileImage").optional(),

  check("role").optional(),

  check("phone")
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number"),

  validatorMiddleware,
];

exports.updateUserValidator = [
  check("id").isMongoId().withMessage("Invalid format for User Id"),
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

  check("profileImage").optional(),

  check("phone")
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number"),

  check("role").optional(),

  validatorMiddleware,
];

exports.changeUserPasswordValidator = [
  check("currentPassword")
    .notEmpty()
    .withMessage("Please enter your current password")
    .custom(async (value, { req }) => {
      return await User.findById(req.params.id).then(async (user) => {
        if (!user) {
          return Promise.reject(new ApiError("User not found", 404));
        }

        return await bcrypt
          .compare(req.body.currentPassword, user.password)
          .then((result) => {
            if (!result) {
              return Promise.reject(
                new ApiError("Current password is Incorrect", 400)
              );
            }
          });
      });
    }),

  check("password").notEmpty().withMessage("Please enter your new password"),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("Please confirm your password")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new ApiError("Password confirm does not match password", 400);
      }
      return true;
    }),
  validatorMiddleware,
];

exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid format for Brand Id"),
  validatorMiddleware,
];

exports.updateMeValidator = [
  body("name")
    .optional()
    .custom((value, { req }) => {
      if (value) req.body.slug = slugify(value);
      return true;
    }),
  check("name")
    .optional()
    .isLength({ min: 4 })
    .withMessage("User name is too short")
    .isLength({ max: 30 })
    .withMessage("User name is too long"),

  check("email")
    .optional()
    .isEmail()
    .withMessage("Email is invalid")
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then((user) => {
        if (user) {
          return Promise.reject(new ApiError("Email already in use", 400));
        }
      });
    }),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number"),

  validatorMiddleware,
];
