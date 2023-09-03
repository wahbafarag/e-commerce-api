const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const SubCategory = require("../models/subCategoryModel");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");
const factory = require("./handler-factory");

exports.setCategoryId = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

exports.setFilterObject = (req, res, next) => {
  let filter = {};
  if (req.params.categoryId) filter = { category: req.params.categoryId };
  req.filterObj = filter;
  next();
};

exports.createSubCategory = asyncHandler(async (req, res) => {
  const { name, category } = req.body;
  const subCategory = await SubCategory.create({
    name,
    category,
    slug: slugify(name),
  });
  res.status(201).json({
    status: "success",
    subCategory,
  });
});

exports.getAllSubCategories = asyncHandler(async (req, res, next) => {
  const productsCount = await SubCategory.countDocuments();
  const apiFeatures = new ApiFeatures(
    SubCategory.find(),
    req.query,
    SubCategory
  )
    .filter()
    .paginate(productsCount)
    .search()
    .fieldsLimiting()
    .sort();

  const subCategories = await apiFeatures.query;

  res.status(200).json({
    pagination: apiFeatures.paginationResult,
    results: subCategories.length,
    status: "success",
    subCategories,
  });
});

exports.getSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await SubCategory.findById(id);
  if (!subCategory) return next(new ApiError("SubCategory not found", 404));
  res.status(200).json({
    status: "success",
    subCategory,
  });
});

exports.updateSubCategory = factory.updateOne(SubCategory);

exports.deleteSubCategory = factory.deleteOne(SubCategory);

// exports.deleteSubCategory = asyncHandler(async (req, res, next) => {
//   const subCategory = await SubCategory.findByIdAndDelete(req.params.id);
//   if (!subCategory)
//     return next(new ApiError("No SubCategory found to delete", 404));
//
//   res.status(204).json(); // no content -> deleted
// });
