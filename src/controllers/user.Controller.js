const User = require("../models/user.Model.js");
const {CustomError} = require("../utils/CustomError.js")
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken')

module.exports.currentUser = (req, res, next) => {
  res.status(200).json({
    user: req.user,
  });
};

module.exports.signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    // user already exist ?
    const existingUser = await User.findOne({ email });
    if (existingUser) return next(new CustomError("User already exist", 400));

    // user create
    const user = await User.create({ username, email, password });
    await user.save();

    // generate token
    const token = user.generateAuthToken();

    // cookie m set krnge
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 5,
    });

    // res send krnege message token
    res.status(201).json({
      message: "User created successfully",
      token,
    });
  } catch (error) {
    next(new CustomError(error.message, 500));
  }
};

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    // kya user exist ?
    const existingUser = await User.findOne({ email });
    if (!existingUser) return next(new CustomError("User already exist", 400));

    const user = await User.authenticate(email, password);
   

    const token = user.generateAuthToken();

    // cookie m set krnge
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 5,
    });
    console.log(user);
    

    // res send krnege message token
    res.status(201).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    next(new CustomError(error.message, 500));
  }
};

module.exports.logout = async (req, res, next) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
    });
    res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    next(new CustomError("Logout Failed", 500));
  }
};

module.exports.updateProfile = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    if (username) req.user.username = username;
    if (email) req.user.email = email;
    if (password) req.user.password = password;

    await req.user.save();

    const user = req.user;

    // delete user.password; //Remove password from req.user object
    // console.log(user)

    res.status(200).json({
      message: "Profile updated successfully",
      user: user,
    });
  } catch (error) {
    next(new CustomError(error.message, 500));
  }
};