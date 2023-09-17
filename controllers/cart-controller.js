const AsyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const Cart = require("../models/cart-model");
const Product = require("../models/productModel");

const calculateCartPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    totalPrice += item.quantity * item.price;
  });
  cart.totalCartPrice = totalPrice;
  return totalPrice;
};

// scenarios:
// 1. Check if cart exists for the user
// 2. If cart exists, check if the product already exists in cart
// 3. If product exists, increment the quantity
// if product exists and the color is different, add the product as a new item in cart
// 4. If product does not exist, add the product to cart
// 5. If cart does not exist, create a new cart and add the product to cart
// 6. Calculate the total cart price
// 7. Calculate the price after discount (if coupon is applied)
// 8. Save the cart
exports.addProductToCart = AsyncHandler(async (req, res, next) => {
  const { productId, color } = req.body;
  const product = await Product.findById(productId).select("price");

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    const newCart = await Cart.create({
      user: req.user._id,
      cartItems: [
        {
          product: productId,
          price: product.price,
          color: color,
        },
      ],
    });
  } else {
    // product exists in cart - increment the quantity
    const productIndex = cart.cartItems.findIndex(
      (item) =>
        item.product.toString() === productId.toString() && item.color === color
    );
    if (productIndex > -1) {
      const cartItem = cart.cartItems[productIndex];
      cartItem.quantity += 1;
      cart.cartItems[productIndex] = cartItem;
    } else {
      // product does not exist in cart - add the product to cart
      cart.cartItems.push({
        product: productId,
        price: product.price,
        color: color,
      });
    }
  }

  // calculate the total cart price
  // let totalCartPrice = 0;
  // cart.cartItems.forEach((prod) => {
  //   totalCartPrice += prod.quantity * prod.price;
  // });
  calculateCartPrice(cart);
  await cart.save();

  res.status(200).json({
    status: "success",
    message: "Product added to your cart successfully",
    noOfCartItem: cart.cartItems.length,
    data: cart,
  });
});

exports.currentUserCart = AsyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate({
    path: "cartItems.product",
    select: "name price productPictures",
  });
  if (!cart) {
    return next(new ApiError("No cart found for this user", 404));
  }
  res.status(200).json({
    status: "success",
    noOfCartItem: cart.cartItems.length,
    data: cart,
  });
});

exports.removeCartItem = AsyncHandler(async (req, res, next) => {
  const { itemId } = req.params;
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: {
        cartItems: {
          _id: itemId,
        },
      },
    },
    {
      new: true,
    }
  );
  calculateCartPrice(cart);
  await cart.save();
  res.status(200).json({
    status: "success",
    message: "Product removed from cart successfully",
    noOfCartItem: cart.cartItems.length,
    data: cart,
  });
});

exports.clearCart = AsyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndDelete({ user: req.user._id });

  res.status(200).json({
    status: "success",
    message: "Cart cleared successfully",
  });
});

exports.updateCartItemQuantity = AsyncHandler(async (req, res, next) => {
  const { itemId } = req.params;
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError("You dont have any available carts", 404));
  }

  const itemIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() === itemId.toString()
  );
  if (itemIndex > -1) {
    const cartItem = cart.cartItems[itemIndex];
    cartItem.quantity = quantity;
    cart.cartItems[itemIndex] = cartItem;
  } else {
    return next(new ApiError("Item not found in your cart", 404));
  }

  calculateCartPrice(cart);
  await cart.save();

  res.status(200).json({
    status: "success",
    message: "Cart item updated successfully",
    noOfCartItem: cart.cartItems.length,
    data: cart,
  });
});
