//Import des packages
const express = require("express");
const router = express.Router();

const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

//Import des models
const Userlogins = require("../models/Userlogins");

//Creation de fonctions

//Verify email
const verifyEmail = (email) => {
  let newMail = email.toLowerCase();
  if (
    newMail.includes("@") &&
    newMail.split("@").length <= 2 &&
    newMail.split("@").length >= 0 &&
    newMail.split("@")[1].includes(".")
  ) {
    return true;
  } else {
    return false;
  }
};

// verify password
const validatePassword = (p) => {
  const errors = [];
  if (p.length < 8) {
    errors.push("Your password must be at least 8 characters");
  }
  if (p.length > 32) {
    errors.push("Your password must be at max 32 characters");
  }
  if (p.search(/[a-z]/) < 0) {
    errors.push("Your password must contain at least one lower case letter.");
  }
  if (p.search(/[A-Z]/) < 0) {
    errors.push("Your password must contain at least one upper case letter.");
  }
  if (p.search(/[0-9]/) < 0) {
    errors.push("Your password must contain at least one digit.");
  }
  if (p.search(/[!@#\$%\^&\*_]/) < 0) {
    errors.push(
      "Your password must contain at least special char from -[ ! @ # $ % ^ & * _ ]"
    );
  }
  if (errors.length > 0) {
    console.log(errors.join("\n"));
    return false;
  }
  return true;
};

// Signup
router.post("/user/signup", async (req, res) => {
  console.log("routes :/signup");

  try {
    if (
      validatePassword(req.fields.password) &&
      verifyEmail(req.fields.email) &&
      req.fields.username.length > 1
    ) {
      //Verifie si l'email existe deja dans la BDD
      const emailExist = await Userlogins.findOne({ email: req.fields.email });

      //Condition si l'email existe deja dans la bdd
      if (emailExist === null || req.fields.username) {
        //Creation du salt, du hash, et du token
        const salt = uid2(16);
        const password = req.fields.password;
        const hash = SHA256(salt + password).toString(encBase64); //Creation du hash (password + salt) et convertissement en string
        const token = uid2(16);

        //Creation du compte de l'utilisateur dans la bdd
        const newUser = new Userlogins({
          username: req.fields.username,
          email: req.fields.email,
          account: {
            username: req.fields.username,
            avatar: Object, // nous verrons plus tard comment uploader une image
          },
          newsletter: req.fields.newsletter,
          token: token,
          hash: hash,
          salt: salt,
        });
        await newUser.save();
        res.status(200).json({
          _id: newUser._id,
          token: newUser.token,
          account: {
            username: newUser.account.username,
          },
        });
      } else {
        res.status(400).json({
          error: "Bad request!",
        });
      }
    } else {
      res.status(400).json({
        error: "Bad request!",
      });
    }
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
});

//Login
router.post("/user/login", async (req, res) => {
  console.log("route :/user/login");
  try {
    // Recherche de l'utilisateur dans la bdd
    const user = await Userlogins.findOne({ email: req.fields.email });
    const newHash = SHA256(user.salt + req.fields.password).toString(encBase64);
    // console.log(newHash);
    if (newHash === user.hash) {
      res.status(200).json({
        _id: user._id,
        token: user.token,
        account: {
          username: user.account.username,
        },
      });
    } else {
      res.status(400).json({
        message: "Wrong password",
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

module.exports = router;
