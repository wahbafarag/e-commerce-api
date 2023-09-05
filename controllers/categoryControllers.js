const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const Category = require("../models/categoryModel");
const factory = require("./handler-factory");
const asyncHandler = require("express-async-handler");
const { uploadSingleImage } = require("../middlewares/image-upload");

exports.uploadCategoryImage = uploadSingleImage("image");

exports.resizeCategoryImage = asyncHandler(async (req, res, next) => {
  const fileName = `category-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(path.join(__dirname, "../uploads/categories/", fileName));
  req.body.image = fileName;
  next();
});

exports.createCategory = factory.createOne(Category);

exports.getAllCategories = factory.getAll(Category);

exports.getCategory = factory.getOne(Category);

exports.updateCategory = factory.updateOne(Category);

exports.deleteCategory = factory.deleteOne(Category);
