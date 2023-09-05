const express = require("express");

const router = express.Router();
const brandControllers = require("../controllers/brandControllers");
const brandValidators = require("../utils/validators/brandValidators");

router
  .route("/")
  .post(
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
    brandControllers.uploadBrandImage,
    brandControllers.resizeBrandImage,
    brandValidators.updateBrandValidator,
    brandControllers.updateBrand
  )
  .delete(brandValidators.deleteBrandValidator, brandControllers.deleteBrand);

module.exports = router;
