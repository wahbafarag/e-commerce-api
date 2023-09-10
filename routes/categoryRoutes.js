const express = require("express");
const router = express.Router();
const categoryControllers = require("../controllers/categoryControllers");
const categoryValidators = require("../utils/validators/categoryValidators");
const subCategoryRoutes = require("./subCategoryRoutes");
const authController = require("../controllers/auth-controller");

router.use("/:categoryId/subCategories", subCategoryRoutes);

router
  .route("/")
  .post(
    authController.protect,
    authController.restrictTo("admin", "manager"),
    categoryControllers.uploadCategoryImage,
    categoryControllers.resizeCategoryImage,
    categoryValidators.createCategoryValidator,
    categoryControllers.createCategory
  )
  .get(categoryControllers.getAllCategories);

router
  .route("/:id")
  .get(categoryValidators.getCategoryValidator, categoryControllers.getCategory)
  .patch(
    authController.protect,
    authController.restrictTo("admin", "manager"),
    categoryControllers.uploadCategoryImage,
    categoryControllers.resizeCategoryImage,
    categoryValidators.updateCategoryValidator,
    categoryControllers.updateCategory
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    categoryValidators.deleteCategoryValidator,
    categoryControllers.deleteCategory
  );

module.exports = router;
