const ApiError = require("../utils/apiError");
const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    if (err.name === "JsonWebTokenError") {
      err.message = "Invalid Token , Please login again";
      err.statusCode = 401;
      err.status = "fail";
    }

    if (err.name === "TokenExpiredError") {
      err.message = "Your Access permission has expired , Please login again";
      err.statusCode = 401;
      err.status = "fail";
    }
    sendDevError(err, res);
  } else {
    if (err.name === "JsonWebTokenError") {
      err.message = "Invalid Token ,Please login again";
      err.statusCode = 401;
      err.status = "fail";
    }

    if (err.name === "TokenExpiredError") {
      err.message = "Your Access permission has expired , Please login again";
      err.statusCode = 401;
      err.status = "fail";
    }
    sendProdError(err, res);
  }
};

const sendDevError = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendProdError = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
module.exports = globalErrorHandler;
