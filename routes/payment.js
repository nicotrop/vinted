//Import packages
const express = require("express");
const Payment = require("../models/Payment");
const Userlogins = require("../models/Userlogins");
const router = express.Router();
const getDate = require("../getDate");
const stripe = require("stripe")(process.env.PRIVATE_KEY);

router.post("/pay", async (req, res) => {
  // Réception du token créer via l'API Stripe depuis le Frontend
  const stripeToken = req.fields.stripeToken;
  // Créer la transaction
  const response = await stripe.charges.create({
    amount: req.fields.amount,
    currency: "eur",
    description: req.fields.description,
    // On envoie ici le token
    source: stripeToken,
  });
  console.log(response.status);

  //Trouver l'utilisateurs en base de donnees
  const user = Userlogins.findById(req.fields.id);

  const day = getDate();

  // Sauvegarder la transaction dans une BDD MongoDB
  const newPayment = new Payment({
    amount: req.fields.amount,
    date: day,
    owner: user,
  });
  await newPayment.save();

  res.json(response);
});

module.exports = router;
