const express = require("express");

const router = express.Router();
const categoryControllers = require("../controllers/categoryControllers");
const categoryValidators = require("../utils/validators/categoryValidators");
const subCategoryRoutes = require("./subCategoryRoutes");

router.use("/:categoryId/subCategories", subCategoryRoutes);

router
  .route("/")
  .post(
    categoryValidators.createCategoryValidator,
    categoryControllers.createCategory
  )
  .get(categoryControllers.getAllCategories);

router
  .route("/:id")
  .get(categoryValidators.getCategoryValidator, categoryControllers.getCategory)
  .patch(
    categoryValidators.updateCategoryValidator,
    categoryControllers.updateCategory
  )
  .delete(
    categoryValidators.deleteCategoryValidator,
    categoryControllers.deleteCategory
  );

module.exports = router;
