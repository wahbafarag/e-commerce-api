const express = require("express");
const router = express.Router();

const userValidator = require("../utils/validators/user-validator");
const usersController = require("../controllers/users-controller");
const authController = require("../controllers/auth-controller");

router.use(authController.protect);

router
  .route("/")
  .post(
    authController.restrictTo("admin"),
    usersController.uploadUserImage,
    usersController.resizeBrandImage,
    userValidator.createUserValidator,
    usersController.createUser
  )
  .get(authController.restrictTo("admin"), usersController.getAllUser);

//  all about current logged in user

router.get("/me", usersController.getMe, usersController.getUser);

router.patch(
  "/me/update-password",

  usersController.getMe,
  usersController.updateLoggedUserPassword
);

router.patch(
  "/me/update-profile",

  usersController.getMe,
  userValidator.updateMeValidator,
  usersController.updateMe
);

router.delete(
  "/me/delete-profile",
  authController.protect,

  usersController.getMe,
  usersController.deactivateMe
);

router.patch(
  "/me/activate-profile",
  authController.protect,
  usersController.getMe,
  usersController.activateMe
);

//
router.patch(
  "/:id/update-password",

  authController.restrictTo("admin"),
  userValidator.changeUserPasswordValidator,
  usersController.updatePassword
);

router
  .route("/:id")
  .get(
    authController.restrictTo("admin"),
    userValidator.getUserValidator,
    usersController.getUser
  )
  .patch(
    authController.restrictTo("admin"),
    usersController.uploadUserImage,
    usersController.resizeBrandImage,
    userValidator.updateUserValidator,
    usersController.updateUser
  )
  .delete(
    authController.restrictTo("admin"),
    userValidator.deleteUserValidator,
    usersController.deleteUser
  );

module.exports = router;
