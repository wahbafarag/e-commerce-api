const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const slugify = require("slugify");

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
    .withMessage("Category name is too long")
    .custom((value, { req }) => {
      if (value) req.body.slug = slugify(value);
      return true;
    }),
  validatorMiddleware,
];

exports.updateCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid format for Category Id"),
  body("name")
    .optional()
    .custom((value, { req }) => {
      if (value) req.body.slug = slugify(value);
      return true;
    }),
  check("name")
    .notEmpty()
    .optional()
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
