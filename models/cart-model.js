const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    cartItems: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          default: 1,
        },
        price: Number,
        color: String,
      },
    ],

    totalCartPrice: Number,
    priceAfterDiscount: Number, // if coupon is applied
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
