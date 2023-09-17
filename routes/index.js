const categoryRoutes = require("./categoryRoutes");
const subCategoryRoutes = require("./subCategoryRoutes");
const brandRoutes = require("./brandRoutes");
const productRoutes = require("./productRoutes");
const usersRoutes = require("./user-routes");
const authRoutes = require("./auth-routes");
const reviewRoutes = require("./review-routes");
const wishlistRoutes = require("./wishlist-routes");
const addressRoutes = require("./address-routes");
const couponRoutes = require("./coupon-routes");
const cartRoutes = require("./cart-routes");

const mountRoutes = (app) => {
  app.use("/api/v1/categories", categoryRoutes);
  app.use("/api/v1/subCategories", subCategoryRoutes);
  app.use("/api/v1/brands", brandRoutes);
  app.use("/api/v1/products", productRoutes);
  app.use("/api/v1/users", usersRoutes);
  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/reviews", reviewRoutes);
  app.use("/api/v1/wishlist", wishlistRoutes);
  app.use("/api/v1/address", addressRoutes);
  app.use("/api/v1/coupons", couponRoutes);
  app.use("/api/v1/cart", cartRoutes);
};

module.exports = mountRoutes;
