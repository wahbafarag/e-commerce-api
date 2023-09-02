const express = require("express");

const router = express.Router();
const brandControllers = require("../controllers/brandControllers");
const brandValidators = require("../utils/validators/brandValidators");

router
  .route("/")
  .post(brandValidators.createBrandValidator, brandControllers.createBrand)
  .get(brandControllers.getAllBrands);

router
  .route("/:id")
  .get(brandValidators.getBrandValidator, brandControllers.getBrand)
  .patch(brandValidators.updateBrandValidator, brandControllers.updateBrand)
  .delete(brandValidators.deleteBrandValidator, brandControllers.deleteBrand);

module.exports = router;
