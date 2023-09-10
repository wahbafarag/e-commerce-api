const express = require("express");
const router = express.Router();

const userValidator = require("../utils/validators/user-validator");
const usersController = require("../controllers/users-controller");
const authController = require("../controllers/auth-controller");

router
  .route("/")
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    usersController.uploadUserImage,
    usersController.resizeBrandImage,
    userValidator.createUserValidator,
    usersController.createUser
  )
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    usersController.getAllUser
  );

router.patch(
  "/:id/update-password",
  userValidator.changeUserPasswordValidator,
  usersController.updatePassword
);

router
  .route("/:id")
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    userValidator.getUserValidator,
    usersController.getUser
  )
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    usersController.uploadUserImage,
    usersController.resizeBrandImage,
    userValidator.updateUserValidator,
    usersController.updateUser
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    userValidator.deleteUserValidator,
    usersController.deleteUser
  );

module.exports = router;
