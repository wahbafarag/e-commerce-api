const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth-controller");
const wishlistController = require("../controllers/wishlist-controller");

router.use(authController.protect, authController.restrictTo("user"));

router
  .route("/")
  .post(wishlistController.addToWishlist)
  .get(wishlistController.getWishlist)
  .delete(wishlistController.clearWishlist);

router.delete("/:productId", wishlistController.removeFromWishlist);

module.exports = router;
