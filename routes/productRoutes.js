const express = require("express");

const router = express.Router();
const productControllers = require("../controllers/productControllers");
const productValidators = require("../utils/validators/productValidators");

router
  .route("/")
  .post(
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
    productControllers.uploadProductImages,
    productControllers.resizeProductImages,
    productValidators.updateProductValidator,
    productControllers.updateProduct
  )
  .delete(
    productValidators.deleteProductValidator,
    productControllers.deleteProduct
  );

module.exports = router;
