const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const couponSchema = new Schema({
  name: {
    type: String,
    required: [true, "Coupon Name is required"],
    unique: true,
    trim: true,
  },
  expiry: {
    type: Date,
    required: [true, "Coupon Expiry Date is required"],
  },

  // used: {
  //   type: Boolean,
  //   default: false,
  // },

  discount: {
    type: Number,
    required: [true, "Coupon Discount is required"],
  },
});

const Coupon = mongoose.model("Coupon", couponSchema);
module.exports = Coupon;
