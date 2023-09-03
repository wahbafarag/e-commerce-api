const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const Category = require("../models/categoryModel");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");
const factory = require("./handler-factory");

exports.createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const category = await Category.create({ name, slug: slugify(name) });
  res.status(201).json({
    status: "success",
    data: category,
  });
});

exports.getAllCategories = asyncHandler(async (req, res) => {
  const productsCount = await Category.countDocuments();
  const apiFeatures = new ApiFeatures(Category.find(), req.query, Category)
    .filter()
    .paginate(productsCount)
    .search()
    .fieldsLimiting()
    .sort();

  const categories = await apiFeatures.query;

  res.status(200).json({
    pagination: apiFeatures.paginationResult,
    results: categories.length,
    status: "success",
    categories,
  });
});

exports.getCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) return next(new ApiError("Category not found", 404));

  res.status(200).json({
    status: "success",
    category,
  });
});

exports.updateCategory = factory.updateOne(Category);

// asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   const { name } = req.body;
//   const category = await Category.findByIdAndUpdate(
//       id,
//       { name, slug: slugify(name) },
//       {
//         new: true,
//         runValidators: true,
//       }
//   );
//   if (!category)
//     return next(new ApiError("No Categories found to update", 404));
//
//   res.status(200).json({
//     status: "success",
//     category,
//   });
// });

exports.deleteCategory = factory.deleteOne(Category);

// exports.deleteCategory = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   const category = await Category.findByIdAndDelete(id);
//   if (!category)
//     return next(new ApiError("No Categories found to delete", 404));
//
//   res.status(204).json(); // no content -> deleted
// });
