const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  last_name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },
  image_path: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    minlength: 4,
    trim: true,
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error('Password cannot contain "password"');
      }
    },
  },
  contact: {
    type: Number,
    trim: true,
  },
  otp: {
    type: String,
    trim: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

// generating the authentication token
userSchema.methods.generateAuthToken = async function () {
  const user = this;

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

  return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await UserModal.findOne({ email });

  if (!user) {
    return false;
  }
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return false;
  }

  return user;
};

userSchema.statics.findByEmail = async (email) => {
  const user = await UserModal.findOne({ email });

  if (!user) {
    return false;
  }

  return user;
};

userSchema.statics.findByContact = async (contact) => {
  const user = await UserModal.findOne({ contact });

  if (!user) {
    return false;
  }

  return user;
};

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  if (user.isModified("otp")) {
    user.otp = await bcrypt.hash(user.otp, 8);
  }

  next();
});

const UserModal = mongoose.model("UserModal", userSchema);

module.exports = UserModal;
