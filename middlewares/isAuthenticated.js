const express = require("express");
const formidable = require("express-formidable");
const mongoose = require("mongoose");
const app = express();

const Userlogins = require("../models/Userlogins");

//MiddleWare authenticated
const isAuthenticated = async (req, res, next) => {
  if (req.headers.authorization) {
    const user = await Userlogins.findOne({
      token: req.headers.authorization.replace("Bearer ", ""),
    });
    if (!user) {
      res.status(400).json({
        error: "Unauthorized!",
      });
    } else {
      req.user = user;
      return next();
    }
  } else {
    return res.status(401).json({ error: "Unauthorized" });
  }
};

module.exports = isAuthenticated;
