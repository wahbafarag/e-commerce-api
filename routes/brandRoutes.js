const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth-controller");
const brandControllers = require("../controllers/brandControllers");
const brandValidators = require("../utils/validators/brandValidators");

router
  .route("/")
  .post(
    authController.protect,
    authController.restrictTo("admin", "manager"),
    brandControllers.uploadBrandImage,
    brandControllers.resizeBrandImage,
    brandValidators.createBrandValidator,
    brandControllers.createBrand
  )
  .get(brandControllers.getAllBrands);

router
  .route("/:id")
  .get(brandValidators.getBrandValidator, brandControllers.getBrand)
  .patch(
    authController.protect,
    authController.restrictTo("admin", "manager"),
    brandControllers.uploadBrandImage,
    brandControllers.resizeBrandImage,
    brandValidators.updateBrandValidator,
    brandControllers.updateBrand
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    brandValidators.deleteBrandValidator,
    brandControllers.deleteBrand
  );

module.exports = router;
