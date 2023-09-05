const path = require("path");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const Brand = require("../models/brandModel");
const factory = require("./handler-factory");
const { uploadSingleImage } = require("../middlewares/image-upload");

exports.uploadBrandImage = uploadSingleImage("image");

exports.resizeBrandImage = asyncHandler(async (req, res, next) => {
  const fileName = `brand-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(550, 550)
    .toFormat("jpeg")
    .jpeg({ quality: 95 })
    .toFile(path.join(__dirname, "../uploads/brands/", fileName));
  req.body.image = fileName;
  next();
});

//
exports.createBrand = factory.createOne(Brand);

exports.getAllBrands = factory.getAll(Brand);

exports.getBrand = factory.getOne(Brand);

exports.updateBrand = factory.updateOne(Brand);

exports.deleteBrand = factory.deleteOne(Brand);
