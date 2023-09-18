const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth-controller");
const orderController = require("../controllers/order-controller");

router.use(authController.protect);

router.post(
  "/cash-order/:cartId",
  authController.restrictTo("user"),
  orderController.createCashOnDeliveryOrder
);

router.get(
  "/my-orders",
  authController.restrictTo("user", "admin", "manager"),
  orderController.filterOrdersForLoggedInUser,
  orderController.getMyOrders
);
router.get("/:id", orderController.getSpecificOrder);

router.put(
  "/order-pay/:orderId",
  authController.restrictTo("admin", "manager"),
  orderController.updateOrderToPaid
);
router.put(
  "/order-deliver/:orderId",
  authController.restrictTo("admin", "manager"),
  orderController.updateOrderToDelivered
);

module.exports = router;
