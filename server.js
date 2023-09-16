const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const express = require("express");
const morgan = require("morgan");

const { dbConnection } = require("./config/db");
const ApiError = require("./utils/apiError");
const globalErrorHandler = require("./middlewares/errorHandling");

const categoryRoutes = require("./routes/categoryRoutes");
const subCategoryRoutes = require("./routes/subCategoryRoutes");
const brandRoutes = require("./routes/brandRoutes");
const productRoutes = require("./routes/productRoutes");
const usersRoutes = require("./routes/user-routes");
const authRoutes = require("./routes/auth-routes");
const reviewRoutes = require("./routes/review-routes");
const wishlistRoutes = require("./routes/wishlist-routes");
const addressRoutes = require("./routes/address-routes");

// Database Connection
dbConnection();

//Express App
const app = express();

// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Routes
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/subCategories", subCategoryRoutes);
app.use("/api/v1/brands", brandRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/wishlist", wishlistRoutes);
app.use("/api/v1/address", addressRoutes);

app.all("*", (req, res, next) => {
  next(new ApiError("Route You looking for not found", 400));
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
