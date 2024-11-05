const crypto = require("crypto");
const Sheikh = require("../models/Sheikh");
const jwt = require("jsonwebtoken");
const path = require('path');
const fs = require("fs");

const register = async (req, res, next) => {
  const { username, phone, dob ,gender} = req.body;
  console.log(req.body)
  if (!username || !phone || !dob || !gender)  {
    res.status(400);
    return next(new Error("Please provide username, phone number , and date of birth"));
  }

  const userExists = await Sheikh.findOne({ phone });

  if (userExists) {
    res.status(400);
    return next(new Error("User already exists"));
  }

  try {

    const sheikh = await Sheikh.create({
      username,
      phone,
      dob,
      gender,
    });
    generateToken(sheikh, 200, res);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  const { username, phone } = req.body;

  if (!username || !phone) {
    res.status(400);
    return next(new Error("Please provide username and phone"));
  }

  const sheikh = await Sheikh.findOne({ phone });

  if (!sheikh) {
    res.status(400);
    return next(new Error("User does not exists"));
  }

  try {
    const isMatch=username===sheikh.username?true:false;

    if (!isMatch) {
      res.status(400);
      return next(new Error("User and phone does not match"));
    }

    generateToken(sheikh, 200, res);
  } catch (error) {
    next(error);
  }
};

const getUserByToken = async (req, res, next) => {
  let token;
 
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
    
  ) {
    console.log(req.headers.authorization)
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const sheikh = await Sheikh.findById(decoded.id);
      generateToken(sheikh, 200, res);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
};
const generateToken = (sheikh, statusCode, res) => {
  const token = sheikh.getSignedToken();
  return res.status(statusCode).json({
    token,
    statusCode:200,
    user: {
      username: sheikh.username,
      phone: sheikh.phone,
    },
  });
};

module.exports = {
  register,
  login,
  getUserByToken,
};
