//Import dependencies
const express = require("express");
const router = express.Router();
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");
const cloudinary = require("cloudinary").v2;

//Import models
const Userlogins = require("../models/Userlogins");

//Import functions
const validatePassword = require("../tools/validatePassword");
const verifyEmail = require("../tools/verifyEmail");

//Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_name,
  api_key: process.env.API_key,
  api_secret: process.env.API_secret,
});

// Signup
router.post("/user/signup", async (req, res) => {
  //Check all inputs have been submitted
  if (
    req.fields.password &&
    req.fields.email &&
    req.fields.username &&
    req.fields.newsletter
  ) {
    //Descructure variables
    const { password, email, username, newsletter } = req.fields;
    console.log(validatePassword(password));
    try {
      //Check password input
      if (validatePassword(password) === true) {
        //Check email input
        if (verifyEmail(email)) {
          //Lookup if email exists in database
          const emailExist = await Userlogins.findOne({
            email: email,
          });
          console.log(emailExist);
          //Condition si l'email existe deja dans la bdd
          if (emailExist === null) {
            //Lookup if username exists in database
            const usernameExist = await Userlogins.findOne({
              account: {
                username: username,
              },
            });
            console.log("username", usernameExist);
            if (usernameExist === null) {
              //Creation du salt, du hash, et du token
              const salt = uid2(16);
              const hash = SHA256(salt + password).toString(encBase64); //Create hash (password + salt) and convert to a string
              const token = uid2(16);
              //Create new user
              const newUser = new Userlogins({
                username: username,
                email: email,
                account: {
                  username: username,
                  avatar: Object,
                },
                newsletter: newsletter,
                token: token,
                hash: hash,
                salt: salt,
              });
              //Adding profile img
              if (req.files.picture?.path) {
                let imgToUpload = req.files.picture.path;
                const imgUploaded = await cloudinary.uploader.upload(
                  imgToUpload,
                  {
                    folder: "/vinted/users/",
                    public_id: newUser.account.username,
                  }
                );
                newUser.account.avatar = imgUploaded.secure_url;
              } else {
                newUser.account.avatar =
                  "https://res.cloudinary.com/dygjptmlc/image/upload/v1655380024/default_avatar_vmdgai.png";
              }
              await newUser.save();
              res.status(200).json(newUser);
            } else {
              res.status(400).json({
                error: "Username is taken",
              });
            }
          } else {
            res.status(400).json({
              error: "Email already exists",
            });
          }
        } else {
          res.status(400).json({
            error: "Enter a valid email",
          });
        }
      } else {
        res.status(400).json({
          error: validatePassword(password),
        });
      }
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  } else {
    res.status(400).json({
      error: "Please fill out all required fields.",
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
