const SubCategory = require("../models/subCategoryModel");
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

exports.createSubCategory = factory.createOne(SubCategory);

exports.getAllSubCategories = factory.getAll(SubCategory);

exports.getSubCategory = factory.getOne(SubCategory);

exports.updateSubCategory = factory.updateOne(SubCategory);

exports.deleteSubCategory = factory.deleteOne(SubCategory);
