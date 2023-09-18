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
      details: String,
      city: String,
      phone: String,
      postalCode: String,
    },
  },
  { timestamps: true }
);

orderSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name email phone profileImage",
  }).populate({
    path: "cartItems.product",
    select: "name price imageCover",
  });

  next();
});

module.exports = mongoose.model("Order", orderSchema);
