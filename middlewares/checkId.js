const express = require("express");

const Offer = require("../models/Offer");

const checkId = async (req, res, next) => {
  try {
    if (req.fields.id) {
      const offer = await Offer.findById(req.fields.id);
      if (offer) {
        req.offer = offer;
        return next();
      } else {
        res.status(401).json({
          message: "id not found!",
        });
      }
    } else {
      res.status(401).json({ message: "id not entered!" });
    }
  } catch (error) {
    res.status(401).json({
      error: "Unauthorized access!",
    });
  }
};

module.exports = checkId;
