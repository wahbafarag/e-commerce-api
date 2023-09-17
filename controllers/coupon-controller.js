const factory = require("./handler-factory");
const Coupon = require("../models/coupon-model");

exports.createCoupon = factory.createOne(Coupon);
exports.getAllCoupons = factory.getAll(Coupon);
exports.getCoupon = factory.getOne(Coupon);
exports.updateCoupon = factory.updateOne(Coupon);
exports.deleteCoupon = factory.deleteOne(Coupon);
