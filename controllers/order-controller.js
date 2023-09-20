const AsyncHandler = require("express-async-handler");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const ApiError = require("../utils/apiError");
const Order = require("../models/order-model");
const Cart = require("../models/cart-model");
const Product = require("../models/productModel");
const factory = require("./handler-factory");

exports.filterOrdersForLoggedInUser = AsyncHandler((req, res, next) => {
  if (req.user.role === "user") req.filterObj = { user: req.user._id };
  next();
});

// cash on delivery order
// POST /api/v1/orders/:cartId
exports.createCashOnDeliveryOrder = AsyncHandler(async (req, res, next) => {
  // 1- GET CART
  // 2- check if any coupons applied - get total price
  // 3- create order 'cash'
  // 4- decrease product quantity , increase sold
  // 5- delete user cart depending on cartId
  const { cartId } = req.params;
  const { shippingAddress } = req.body;
  const taxPrice = 0;
  const shippingPrice = 0;

  const cart = await Cart.findById(cartId);
  if (!cart)
    return next(new ApiError("You dont have any available carts", 404));

  const orderPrice = cart.priceAfterDiscount
    ? cart.priceAfterDiscount
    : cart.totalCartPrice;

  const totalOrderPrice = orderPrice + taxPrice + shippingPrice;

  // check if we have enough quantity for each product
  for (let i in cart.cartItems) {
    const item = cart.cartItems[i];
    const product = await Product.findById(item.product);
    if (product.quantity < item.quantity || product.quantity <= 0) {
      return next(
        new ApiError(
          `Sorry, Product quantity you are asking for is not available right now`,
          404
        )
      );
    }
  }

  const order = await Order.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    totalOrderPrice,
    shippingAddress,
  });

  if (order) {
    const bulkOptions = cart.cartItems.map((item) => {
      return {
        updateOne: {
          filter: { _id: item.product },
          update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
        },
      };
    });
    // bulkWrite : perform more than one operation to the database
    await Product.bulkWrite(bulkOptions, {});
    await Cart.findByIdAndDelete(cartId);

    return res.status(201).json({
      status: "success",
      message: "Order created successfully",
      data: {
        order,
      },
    });
  } else {
    return next(
      new ApiError("Cant create your order ,Please try again later", 404)
    );
  }
});

// get all orders for a specific user
// exports.getMyOrders = AsyncHandler(async (req, res, next) => {
//   const orders = await Order.find({ user: req.user._id }).sort({
//     createdAt: -1,
//   });
//   if (!orders) return next(new ApiError("You dont have any orders", 404));
//   res.status(200).json({
//     status: "success",
//     noOfOrders: orders.length,
//     data: {
//       orders,
//     },
//   });
// });

exports.getMyOrders = factory.getAll(Order);
exports.getSpecificOrder = factory.getOne(Order);

exports.updateOrderToPaid = AsyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.orderId);
  if (!order) return next(new ApiError("Order not found", 404));

  order.isPaid = true;
  order.paidAt = Date.now();
  const updatedOrder = await order.save();

  res.status(200).json({
    status: "success",
    message: "Order paid successfully",
    order: updatedOrder,
  });
});

exports.updateOrderToDelivered = AsyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.orderId);
  if (!order) return next(new ApiError("Order not found", 404));

  order.isDelivered = true;
  order.deliveredAt = Date.now();
  const updatedOrder = await order.save();

  res.status(200).json({
    status: "success",
    message: "Order delivered successfully",
    order: updatedOrder,
  });
});
exports.checkoutSession = AsyncHandler(async (req, res, next) => {
  const { cartId } = req.params;
  const taxPrice = 0;
  const shippingPrice = 0;

  const cart = await Cart.findById(cartId);
  if (!cart) {
    return next(new ApiError(`You dont have any available carts`, 404));
  }

  const cartPrice = cart.priceAfterDiscount
    ? cart.priceAfterDiscount
    : cart.totalCartPrice;
  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/api/v1/orders/my-orders`,
    cancel_url: `${req.protocol}://${req.get("host")}/api/v1/cart/get-cart`,
    customer_email: req.user.email,
    client_reference_id: req.params.cartId,
    metadata: req.body.shippingAddress,

    line_items: [
      {
        price_data: {
          currency: "egp",
          unit_amount: totalOrderPrice * 100,
          product_data: {
            name: req.user.name,
          },
        },
        quantity: 1,
      },
    ],
  });

  res.status(200).json({ status: "success", session });
});

exports.webhookCheckout = AsyncHandler(async (req, res, next) => {
  const signature = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error : ${err.message}`);
  }
  if (event.type === "checkout.session.completed") {
    console.log("Checkout Session Completed , Create Order");
  }
});
