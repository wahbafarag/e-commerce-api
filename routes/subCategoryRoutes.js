const express = require("express");
const subCategoryControllers = require("../controllers/subCategoryControllers");
const subCategoryValidators = require("../utils/validators/subCategoryValidator");
const authController = require("../controllers/auth-controller");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
    authController.protect,
    authController.restrictTo("admin", "manager"),
    subCategoryControllers.setCategoryId,
    subCategoryValidators.createSubCategoryValidator,
    subCategoryControllers.createSubCategory
  )
  .get(
    subCategoryControllers.setFilterObject,
    subCategoryControllers.getAllSubCategories
  );

router
  .route("/:id")
  .get(
    subCategoryValidators.getSubCategoryValidator,
    subCategoryControllers.getSubCategory
  )
  .patch(
    authController.protect,
    authController.restrictTo("admin", "manager"),
    subCategoryValidators.updateSubCategoryValidator,
    subCategoryControllers.updateSubCategory
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    subCategoryValidators.deleteSubCategoryValidator,
    subCategoryControllers.deleteSubCategory
  );
module.exports = router;
