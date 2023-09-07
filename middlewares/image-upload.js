const multer = require("multer");
const ApiError = require("../utils/apiError");

const multerOptions = () => {
  const multerStorage = multer.memoryStorage();
  const multerFileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) cb(null, true);
    else
      cb(new ApiError("Not an image! Please upload only images.", 400), false);
  };

  return multer({
    storage: multerStorage,
    fileFilter: multerFileFilter,
  });
};

exports.uploadSingleImage = (fieldName) => multerOptions().single(fieldName);

exports.uploadMultipleImages = (fieldsArray) =>
  multerOptions().fields(fieldsArray);
