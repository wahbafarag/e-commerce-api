const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },

    cartItems: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: Number,
        price: Number,
        color: String,
      },
    ],

    taxPrice: {
      type: Number,
      default: 0.0,
    },

    shippingPrice: {
      type: Number,
      default: 0.0,
    },

    totalOrderPrice: {
      type: Number,
    },

    paymentMethod: {
      type: String,
      enum: ["card", "cash"],
      default: "cash",
    },

    isPaid: {
      type: Boolean,
      default: false,
    },

    paidAt: Date,

    isDelivered: {
      type: Boolean,
      default: false,
    },

    deliveredAt: Date,

    shippingAddress: {
      type: String,
      required: [true, "Please tell us your detailed shipping address"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
