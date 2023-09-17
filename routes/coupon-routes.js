const express = require("express");
const router = express.Router();

const couponController = require("../controllers/coupon-controller");
const authController = require("../controllers/auth-controller");

router.use(
  authController.protect,
  authController.restrictTo("admin", "manager")
);

router
  .route("/")
  .get(couponController.getAllCoupons)
  .post(couponController.createCoupon);

router
  .route("/:id")
  .get(couponController.getCoupon)
  .patch(couponController.updateCoupon)
  .delete(couponController.deleteCoupon);

module.exports = router;
