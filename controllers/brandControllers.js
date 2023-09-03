const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const Brand = require("../models/brandModel");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");
const factory = require("./handler-factory");

exports.createBrand = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const brand = await Brand.create({ name, slug: slugify(name) });
  res.status(201).json({
    status: "success",
    data: brand,
  });
});

exports.getAllBrands = asyncHandler(async (req, res) => {
  const productsCount = await Brand.countDocuments();
  const apiFeatures = new ApiFeatures(Brand.find(), req.query, Brand)
    .filter()
    .paginate(productsCount)
    .search()
    .fieldsLimiting()
    .sort();

  const brands = await apiFeatures.query;

  res.status(200).json({
    pagination: apiFeatures.paginationResult,
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

exports.updateBrand = factory.updateOne(Brand);

// asyncHandler(async (req, res, next) => {
//   const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//   });
//   if (!brand) return next(new ApiError("No Brands found to update", 404));
//   console.log(brand);
//   res.status(200).json({
//     status: "success",
//     brand,
//   });
// });

exports.deleteBrand = factory.deleteOne(Brand);

// exports.deleteBrand = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   const brand = await Brand.findByIdAndDelete(id);
//   if (!brand) return next(new ApiError("No Brands found to delete", 404));
//
//   res.status(204).json(); // no content -> deleted
// });
