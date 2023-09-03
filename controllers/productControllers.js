const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const Product = require("../models/productModel");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");
const factory = require("./handler-factory");

exports.getAllProducts = asyncHandler(async (req, res) => {
  const productsCount = await Product.countDocuments();
  const apiFeatures = new ApiFeatures(Product.find(), req.query, Product)
    .filter()
    .paginate(productsCount)
    .search("Product")
    .fieldsLimiting()
    .sort();

  const products = await apiFeatures.query;

  res.status(200).json({
    status: "success",
    results: products.length,
    pagination: apiFeatures.paginationResult,
    products,
  });
});

exports.getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) return next(new ApiError("Product not found", 404));
  res.status(200).json({
    status: "success",
    product,
  });
});

exports.createProduct = asyncHandler(async (req, res) => {
  req.body.slug = slugify(req.body.title);
  const product = await Product.create(req.body);
  res.status(201).json({
    status: "success",
    product,
  });
});

exports.updateProduct = factory.updateOne(Product);

exports.deleteProduct = factory.deleteOne(Product);

// exports.deleteProduct = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   const product = await Product.findByIdAndDelete(id);
//   if (!product) return next(new ApiError("No Products found to delete", 404));
//   res.status(204).json();
// });
