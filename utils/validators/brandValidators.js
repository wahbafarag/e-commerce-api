const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.getBrandValidator = [
  // 1 rules
  check("id")
    .isMongoId()
    .withMessage("Invalid format for Brand Id ")
    .notEmpty()
    .withMessage("Brand Id must have a valid value"),
  validatorMiddleware,
];

exports.createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("Brand Name is required")
    .isLength({ min: 4 })
    .withMessage("Brand name is too short")
    .isLength({ max: 30 })
    .withMessage("Brand name is too long"),
  validatorMiddleware,
];

exports.updateBrandValidator = [
  check("id").isMongoId().withMessage("Invalid format for Brand Id"),
  check("name")
    .notEmpty()
    .withMessage("Brand Name is required")
    .isLength({ min: 4 })
    .withMessage("Brand name is too short")
    .isLength({ max: 30 })
    .withMessage("Brand name is too long"),
  validatorMiddleware,
];

exports.deleteBrandValidator = [
  check("id").isMongoId().withMessage("Invalid format for Brand Id"),
  validatorMiddleware,
];
