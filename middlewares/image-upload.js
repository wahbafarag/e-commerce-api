const multer = require("multer");
const ApiError = require("../utils/apiError");

exports.uploadSingleImage = (fieldName) => {
  const multerStorage = multer.memoryStorage();
  const multerFileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) cb(null, true);
    else
      cb(new ApiError("Not an image! Please upload only images.", 400), false);
  };

  const upload = multer({
    storage: multerStorage,
    fileFilter: multerFileFilter,
  });
  return upload.single(fieldName);
};

// from category controller

// this solution will not work if image processing is required 'use memoryStorage instead'
// const multerStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/categories");
//   },
//   filename: function (req, file, cb) {
//     const ext = file.mimetype.split("/")[1];
//     const fileName = `category-${uuidv4()}-${Date.now()}.${ext}`;
//     cb(null, fileName);
//   },
// });

// const multerStorage = multer.memoryStorage();

// const multerFileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image")) cb(null, true);
//   else cb(new ApiError("Not an image! Please upload only images.", 400), false);
// };

// const upload = multer({ storage: multerStorage, fileFilter: multerFileFilter });
