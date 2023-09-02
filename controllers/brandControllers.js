const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const Brand = require("../models/brandModel");
const ApiError = require("../utils/apiError");

exports.createBrand = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const brand = await Brand.create({ name, slug: slugify(name) });
  res.status(201).json({
    status: "success",
    data: brand,
  });
});

exports.getAllBrands = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 15;
  const skip = (page - 1) * limit;

  const brands = await Brand.find({}).skip(skip).limit(limit);
  res.status(200).json({
    page,
    results: brands.length,
    status: "success",
    brands,
  });
});

exports.getBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await Brand.findById(id);
  if (!brand) return next(new ApiError("Brand not found", 404));

  res.status(200).json({
    status: "success",
    brand,
  });
});

exports.updateBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  const brand = await Brand.findByIdAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!brand) return next(new ApiError("No Brands found to update", 404));

  res.status(200).json({
    status: "success",
    brand,
  });
});

exports.deleteBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await Brand.findByIdAndDelete(id);
  if (!brand) return next(new ApiError("No Brands found to delete", 404));

  res.status(204).json(); // no content -> deleted
});
