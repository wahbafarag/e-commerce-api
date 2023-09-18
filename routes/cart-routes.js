const express = require("express");
const router = express.Router();

const cartController = require("../controllers/cart-controller");
const authController = require("../controllers/auth-controller");

router.use(authController.protect, authController.restrictTo("user"));

router.post("/add-to-cart", cartController.addProductToCart);
router.put("/apply-coupon", cartController.applyCouponOnCart);
router.get("/get-cart", cartController.currentUserCart);
router.patch("/:itemId/remove-from-cart", cartController.removeCartItem);
router.patch("/:itemId/update-item-qty", cartController.updateCartItemQuantity);
router.delete("/clear-cart", cartController.clearCart);
module.exports = router;
