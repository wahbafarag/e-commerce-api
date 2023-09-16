const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth-controller");
const addressController = require("../controllers/address-controller");

router.use(authController.protect, authController.restrictTo("user"));

router
  .route("/")
  .get(addressController.getUserAddress)
  .post(addressController.addUserAddress)
  .delete(addressController.clearUserAddress);

router
  .route("/:addressId")
  .patch(addressController.updateUserAddress)
  .delete(addressController.deleteUserAddress);

module.exports = router;
