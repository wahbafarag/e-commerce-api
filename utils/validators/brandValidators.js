const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const slugify = require("slugify");

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
    .withMessage("Brand name is too long")
    .custom((value, { req }) => {
      if (value) req.body.slug = slugify(value);
      return true;
    }),
  validatorMiddleware,
];

exports.updateBrandValidator = [
  check("id").isMongoId().withMessage("Invalid format for Brand Id"),
  body("name")
    .optional()
    .custom((value, { req }) => {
      if (value) req.body.slug = slugify(value);
      return true;
    }),
  check("name")
    .notEmpty()
    .optional()
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
