const AsyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const Order = require("../models/order-model");
const Cart = require("../models/cart-model");
const Coupon = require("../models/coupon-model");
const Product = require("../models/productModel");
const User = require("../models/user-model");
const factory = require("./handler-factory");

// cash on delivery order
// POST /api/v1/orders/:cartId
exports.createCashOnDeliveryOrder = AsyncHandler(async (req, res, next) => {
  // 1- GET CART
  // 2- check if any coupons applied - get total price
  // 3- create order 'cash'
  // 4- decrease product quantity , increase sold
  // 5- delete user cart depending on cartId
});
