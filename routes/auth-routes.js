const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth-controller");
const authValidator = require("../utils/validators/auth-validator");

router.post("/signup", authValidator.signupValidator, authController.signup);
router.post("/login", authValidator.loginValidator, authController.login);
router.post(
  "/forgot-password",
  authValidator.forgotPassValidator,
  authController.forgotPassword
);
router.patch(
  "/reset-password",
  authValidator.resetPassValidator,
  authController.resetPassword
);
module.exports = router;
