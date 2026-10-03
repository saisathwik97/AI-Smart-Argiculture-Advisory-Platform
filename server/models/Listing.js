const mongoose = require("mongoose");

const ListingSchema = new mongoose.Schema({
  seller_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  category: { type: String, required: true, enum: ["produce", "equipment", "fertilizer"] },
  price: { type: Number, required: true },
  quantity: { type: String, required: true },
  location: { type: String, required: true },
  image: { type: String, default: "" },
  description: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model("Listing", ListingSchema);
