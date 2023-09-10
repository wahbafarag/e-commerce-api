const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth-controller");
const productControllers = require("../controllers/productControllers");
const productValidators = require("../utils/validators/productValidators");

router
  .route("/")
  .post(
    authController.protect,
    authController.restrictTo("admin", "manager"),
    productControllers.uploadProductImages,
    productControllers.resizeProductImages,
    productValidators.createProductValidator,
    productControllers.createProduct
  )
  .get(productControllers.getAllProducts);

router
  .route("/:id")
  .get(productValidators.deleteProductValidator, productControllers.getProduct)
  .patch(
    authController.protect,
    authController.restrictTo("admin", "manager"),
    productControllers.uploadProductImages,
    productControllers.resizeProductImages,
    productValidators.updateProductValidator,
    productControllers.updateProduct
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    productValidators.deleteProductValidator,
    productControllers.deleteProduct
  );

module.exports = router;
