const auth = require("../middleware/auth");
require("../database/mongoose");
const express = require("express");
const router = new express.Router();
const userController = require("../controllers/userController");
const forgotPasswordController = require("../controllers/fotgotPasswordController");

router.post("/signup", userController.signUpUser);

router.post("/signupwithGoogle", userController.signUpUserWithGoogle);

router.post("/login", userController.loginUser);

router.post("/login/google", userController.loginUserWithGoogle);

router.post("/logout", auth, userController.logoutUser);

router.patch("/forgot-password", forgotPasswordController.forgotPassword);

router.get(
  "/check-otp/:parameter/:otp/:isContact",
  forgotPasswordController.checkOtp
);

router.patch("/reset-password", forgotPasswordController.resetPassword);

router.patch("/remove-otp", forgotPasswordController.removeOtp);

router.patch("/update_user/:id", auth, userController.updateUser);

module.exports = router;
