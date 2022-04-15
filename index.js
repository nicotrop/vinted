//Import des modules

const express = require("express");
require("dotenv").config();

const formidable = require("express-formidable");
const mongoose = require("mongoose");

// Initialisation du serveur

const app = express();
app.use(formidable());

// Connection a la bdd mongodb authentification

mongoose.connect(process.env.MONGODB_URI);

// Import des routes

const loginsRoute = require("./routes/userlogins");
app.use(loginsRoute);

const offerRoute = require("./routes/offer");
app.use(offerRoute);

// Creation de la route introuvable

app.all("*", (req, res) => {
  res.status(404).json({
    message: "Page introuvable",
  });
});

// Lancer le serveur

app.listen(process.env.PORT, () => {
  console.log("Server has started!");
});
