const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.getCategoryValidator = [
  // 1 rules
  check("id")
    .isMongoId()
    .withMessage("Invalid format for Category Id ")
    .notEmpty()
    .withMessage("Category Id must have a valid value"),
  validatorMiddleware,
];

exports.createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Category Name is required")
    .isLength({ min: 4 })
    .withMessage("Category name is too short")
    .isLength({ max: 30 })
    .withMessage("Category name is too long"),
  validatorMiddleware,
];

exports.updateCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid format for Category Id"),
  check("name")
    .notEmpty()
    .withMessage("Category Name is required")
    .isLength({ min: 4 })
    .withMessage("Category name is too short")
    .isLength({ max: 30 })
    .withMessage("Category name is too long"),
  validatorMiddleware,
];

exports.deleteCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid format for Category Id"),
  validatorMiddleware,
];
