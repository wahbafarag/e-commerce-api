const express = require("express");
const router = express.Router();

const userValidator = require("../utils/validators/user-validator");
const usersController = require("../controllers/users-controller");

router
  .route("/")
  .post(
    usersController.uploadUserImage,
    usersController.resizeBrandImage,
    userValidator.createUserValidator,
    usersController.createUser
  )
  .get(usersController.getAllUser);

router.patch(
  "/:id/update-password",
  userValidator.changeUserPasswordValidator,
  usersController.updatePassword
);

router
  .route("/:id")
  .get(userValidator.getUserValidator, usersController.getUser)
  .patch(
    usersController.uploadUserImage,
    usersController.resizeBrandImage,
    userValidator.updateUserValidator,
    usersController.updateUser
  )
  .delete(userValidator.deleteUserValidator, usersController.deleteUser);

module.exports = router;
