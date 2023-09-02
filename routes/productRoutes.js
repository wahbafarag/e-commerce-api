const express = require("express");

const router = express.Router();
const productControllers = require("../controllers/productControllers");
const productValidators = require("../utils/validators/productValidators");

router
  .route("/")
  .post(
    productValidators.createProductValidator,
    productControllers.createProduct
  )
  .get(productControllers.getAllProducts);

router
  .route("/:id")
  .get(productValidators.deleteProductValidator, productControllers.getProduct)
  .patch(
    productValidators.updateProductValidator,
    productControllers.updateProduct
  )
  .delete(
    productValidators.deleteProductValidator,
    productControllers.deleteProduct
  );

module.exports = router;
