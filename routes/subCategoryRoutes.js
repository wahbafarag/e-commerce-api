const express = require("express");
const subCategoryControllers = require("../controllers/subCategoryControllers");
const subCategoryValidators = require("../utils/validators/subCategoryValidator");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
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
    subCategoryValidators.updateSubCategoryValidator,
    subCategoryControllers.updateSubCategory
  )
  .delete(
    subCategoryValidators.deleteSubCategoryValidator,
    subCategoryControllers.deleteSubCategory
  );
module.exports = router;
