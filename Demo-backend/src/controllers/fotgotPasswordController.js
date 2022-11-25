const UserModal = require("../Modals/UserModal");
const bcrypt = require("bcryptjs");
const sendMail = require("../utils/sendMail");
const sendSMS = require("../utils/sendMobileOtp");

// api to create otp and send otp to email or mobile number
const forgotPassword = async (req, res) => {
  try {
    const isContact = req.body.isContact; // check to send otp on contact number or email
    const findParams = isContact
      ? { contact: req.body.contact }
      : { email: req.body.email };
    let email_check_user = await UserModal.findOne(findParams);

    // check that the user with given email and number is exist or not
    if (!email_check_user)
      return res.status(406).send({
        message: `We don't have any user with the given ${
          isContact ? "mobile number" : "email"
        }.`,
      });

    // create otp
    const otp = Math.floor(100000 + Math.random() * 900000);
    const mailText =
      "Here is the opt for the forgot password, It will expire in 1 minute!\n" +
      "OTP::  " +
      otp;

    // save otp to database
    email_check_user.otp = otp;
    await email_check_user.save();
    const sendotp = isContact
      ? await sendSMS(req.body.contact, mailText) //sending otp to given contact number
      : await sendMail(req.body.email, mailText); // sending otp to given email addess
    return res.status(200).send({
      sendotp,
      message: `Otp sent to your ${
        isContact ? "mobile number" : "email"
      } successfully`,
    });
  } catch (e) {
    return res.status(400).send({ error: "Something went wrong!" });
  }
};

// API to check otp that is valid or not
const checkOtp = async (req, res) => {
  try {
    const isContact = req.params.isContact === "true";
    const findParams = isContact
      ? { contact: req.params.parameter }
      : { email: req.params.parameter };

    // check that the user with given email and number is exist or not
    const email_check_user = await UserModal.findOne(findParams);

    // check that the otp in database is equal to given otp
    const isMatch = await bcrypt.compare(req.params.otp, email_check_user.otp);
    if (isMatch) {
      res.send({ isOtpCorrect: true });
    } else {
      res.send({
        isOtpCorrect: false,
        message: "The otp you have entered is incorrect!",
      });
    }
    // res.send({ isOtpCorrect: false });
  } catch (e) {
    return res.status(400).send({ message: "Something went wrong!" });
  }
};

// API to reset password in database
const resetPassword = async (req, res) => {
  try {
    const isContact = req.body.isContact;
    const findParams = isContact
      ? { conatct: req.body.contact }
      : { email: req.body.email };
    // check that the user with given email and number is exist or not
    let user = await UserModal.findOne(findParams);
    if (!user) {
      return res.status(400).send({
        message: isContact
          ? "We don't have any user with the given contact number."
          : "We don't have any user with the given email.",
      });
    }

    user.password = req.body.password;
    user.otp = "";
    await user.save();

    // create authentication token
    const token = await user.generateAuthToken();
    res.send({ user: user, token });
  } catch (e) {
    console.log(e);
    return res.status(400).send({ error: "Authentication Fail" });
  }
};

// API to remove otp from the database of user
const removeOtp = async (req, res) => {
  try {
    const isContact = req.body.isContact; // check to send otp on contact number or email
    const findParams = isContact
      ? { contact: req.body.contact }
      : { email: req.body.email };
    const email_check_user = await UserModal.findOne(findParams);
    if (!email_check_user)
      return res.status(406).send({
        message: `We don't have any user with the given ${
          isContact ? "contact number." : "email address."
        }`,
      });
    const user = await UserModal.findByIdAndUpdate(email_check_user._id, {
      otp: "",
    });
    await user.save();
    res.send({ message: "Your otp has been expired" });
  } catch (e) {
    return res.status(400).send({ message: "Something went wrong" });
  }
};

module.exports = {
  forgotPassword,
  checkOtp,
  resetPassword,
  removeOtp,
};
