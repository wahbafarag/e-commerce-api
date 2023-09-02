const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const Category = require("../models/categoryModel");
const ApiError = require("../utils/apiError");

exports.createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const category = await Category.create({ name, slug: slugify(name) });
  res.status(201).json({
    status: "success",
    data: category,
  });
});

exports.getAllCategories = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 15;
  const skip = (page - 1) * limit;

  const categories = await Category.find({}).skip(skip).limit(limit);
  res.status(200).json({
    page,
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

exports.updateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  const category = await Category.findByIdAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!category)
    return next(new ApiError("No Categories found to update", 404));

  res.status(200).json({
    status: "success",
    category,
  });
});

exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findByIdAndDelete(id);
  if (!category)
    return next(new ApiError("No Categories found to delete", 404));

  res.status(204).json(); // no content -> deleted
});
