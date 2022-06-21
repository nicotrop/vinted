const mongoose = require("mongoose");

//Create model for offer
const Payment = mongoose.model("Offer", {
  amount: String,
  date: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Userlogins",
  },
});

module.exports = Payment;
