const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const Product = require("../models/productModel");
const factory = require("./handler-factory");
const ApiError = require("../utils/apiError");
const { uploadMultipleImages } = require("../middlewares/image-upload");

exports.uploadProductImages = uploadMultipleImages([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

exports.resizeProductImages = asyncHandler(async (req, res, next) => {
  if (!req.files.imageCover || !req.files.images)
    return next(new ApiError("Please upload your product images", 400));

  // 1) Cover image
  const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(1500, 1500)
    .toFormat("jpeg")
    .jpeg({ quality: 99 })
    .toFile(`uploads/products/${imageCoverFileName}`);

  req.body.imageCover = imageCoverFileName;

  // 2) Images
  req.body.images = [];
  await Promise.all(
    req.files.images.map(async (file, i) => {
      const fileName = `product-${uuidv4()}-${Date.now()}-${i + 1}.jpeg`;
      await sharp(file.buffer)
        .resize(600, 600)
        .toFormat("jpeg")
        .jpeg({ quality: 95 })
        .toFile(`uploads/products/${fileName}`);

      req.body.images.push(fileName);
    })
  );

  next();
});

exports.getAllProducts = factory.getAll(Product, "Product");

exports.getProduct = factory.getOne(Product);

exports.createProduct = factory.createOne(Product);

exports.updateProduct = factory.updateOne(Product);

exports.deleteProduct = factory.deleteOne(Product);
