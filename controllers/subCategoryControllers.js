const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const SubCategory = require("../models/subCategoryModel");
const ApiError = require("../utils/apiError");

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
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 15;
  const skip = (page - 1) * limit;

  const subCategories = await SubCategory.find(req.filterObj)
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    page,
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

exports.updateSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, category } = req.body;
  const subCategory = await SubCategory.findByIdAndUpdate(
    { _id: id },
    { name, category, slug: slugify(name) },
    { new: true, runValidators: true }
  );
  if (!subCategory)
    return next(new ApiError("Cant find SubCategory to update", 404));
  res.status(200).json({
    status: "success",
    subCategory,
  });
});

exports.deleteSubCategory = asyncHandler(async (req, res, next) => {
  const subCategory = await SubCategory.findByIdAndDelete(req.params.id);
  if (!subCategory)
    return next(new ApiError("No SubCategory found to delete", 404));

  res.status(204).json(); // no content -> deleted
});
