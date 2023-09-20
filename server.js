const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");

const { dbConnection } = require("./config/db");
const ApiError = require("./utils/apiError");
const globalErrorHandler = require("./middlewares/errorHandling");
const mountRoutes = require("./routes");
const { webhookCheckout } = require("./controllers/order-controller");

// Database Connection
dbConnection();

//Express App
const app = express();

// Middlewares
app.use(cors());
app.options("*", cors()); // pre-flight request
app.use(compression());
app.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  webhookCheckout
);
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Mounting Routes
mountRoutes(app);

// 404 error handler
app.all("*", (req, res, next) => {
  next(new ApiError("Page not found!", 400));
});

// global error handler (express errors)
app.use(globalErrorHandler);

// running app
const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`Server up and running on port ${port}...`);
});

// unhandled rejections (outside express) (event -> listen -> callback fun)
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection Error : ${err.name} | ${err.message}`);
  server.close(() => {
    console.log("Shutting Server down....");

    process.exit(1);
  });
});
