const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const doc = await Model.findByIdAndDelete(id);
    if (!doc) return next(new ApiError("Nothing found to be deleted", 404));

    res.status(204).json();
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) return next(new ApiError("Nothing found to be updated", 404));

    res.status(200).json({
      status: "success",
      doc,
    });
  });

exports.createOne = (Model) =>
  asyncHandler(async (req, res) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: "success",
      data: doc,
    });
  });

exports.getOne = (Model, popOptions) =>
  asyncHandler(async (req, res, next) => {
    let doc = await Model.findById(req.params.id);
    if (!doc) return next(new ApiError("Document not found", 404));
    if (popOptions) doc = await doc.populate(popOptions);

    const document = await doc;

    res.status(200).json({
      status: "success",
      document,
    });
  });

exports.getAll = (Model, modelName = "") =>
  asyncHandler(async (req, res, next) => {
    let filter = {};
    if (req.filterObj) filter = req.filterObj;

    const productsCount = await Model.countDocuments();
    const apiFeatures = new ApiFeatures(Model.find(filter), req.query, Model)
      .filter()
      .paginate(productsCount)
      .search(modelName)
      .fieldsLimiting()
      .sort();

    const docs = await apiFeatures.query;

    res.status(200).json({
      pagination: apiFeatures.paginationResult,
      results: docs.length,
      status: "success",
      docs,
    });
  });
