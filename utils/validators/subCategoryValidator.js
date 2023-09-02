const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.getSubCategoryValidator = [
  // 1 rules
  check("id")
    .isMongoId()
    .withMessage("Invalid SubCategory Id format")
    .notEmpty()
    .withMessage("SubCategory Id can not be empty"),
  validatorMiddleware,
];

exports.createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("SubCategory Name is required")
    .isLength({ min: 4 })
    .withMessage("SubCategory name is too short")
    .isLength({ max: 20 })
    .withMessage("SubCategory name is too long"),

  check("category")
    .notEmpty()
    .withMessage("SubCategory must belong to parent Category")
    .isMongoId()
    .withMessage("Invalid SubCategory Id format"),

  validatorMiddleware,
];

exports.updateSubCategoryValidator = [
  check("id")
    .notEmpty()
    .withMessage("SubCategory id can not be empty")
    .isMongoId()
    .withMessage("Invalid format for SubCategory Id"),

  check("name")
    .notEmpty()
    .withMessage("SubCategory Name is required")
    .isLength({ min: 4 })
    .withMessage("SubCategory name is too short")
    .isLength({ max: 20 })
    .withMessage("SubCategory name is too long"),
  // check("category")
  //   .notEmpty()
  //   .withMessage(
  //     "SubCategory must belong to Category , Make Sure you refering to the parent Category"
  //   )
  //   .isMongoId()
  //   .withMessage("Invalid Category Id format"),
  validatorMiddleware,
];

exports.deleteSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid format for SubCategory Id"),
  validatorMiddleware,
];
