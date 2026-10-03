const express = require("express");
const router = express.Router();
const Listing = require("../models/Listing");
const { requireAuth } = require("../middleware/auth");

const SEED_PRICES = {
  Rice: { basePrice: 2000, costPerAcre: 15000, yieldPerAcre: 20 },
  Wheat: { basePrice: 2125, costPerAcre: 12000, yieldPerAcre: 15 },
  Cotton: { basePrice: 6000, costPerAcre: 25000, yieldPerAcre: 10 },
  Maize: { basePrice: 1960, costPerAcre: 14000, yieldPerAcre: 25 },
  Soyabean: { basePrice: 4600, costPerAcre: 16000, yieldPerAcre: 8 },
  Groundnut: { basePrice: 5850, costPerAcre: 18000, yieldPerAcre: 9 },
  Sugarcane: { basePrice: 315, costPerAcre: 40000, yieldPerAcre: 350 }, // Per quintal
};

const SOIL_SUITABILITY = {
  "black soil": ["Cotton", "Soyabean", "Wheat"],
  "red soil": ["Groundnut", "Maize", "Cotton"],
  "alluvial soil": ["Rice", "Wheat", "Sugarcane"],
  "laterite soil": ["Tea", "Coffee", "Cashew"],
  "sandy soil": ["Pearl Millet", "Maize"]
};

// Generates a predictable "random" multiplier for the given date
function getMultiplier(cropName, dateStr) {
  let hash = 0;
  const str = cropName + dateStr;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  // Yields a modifier between 0.85 and 1.15
  const normalized = (Math.abs(hash) % 100) / 100;
  return 0.85 + (normalized * 0.30);
}

router.get("/data", (req, res) => {
  try {
    const todayStr = new Date().toISOString().split("T")[0];
    const cropData = Object.keys(SEED_PRICES).map(crop => {
      const modifier = getMultiplier(crop, todayStr);
      const currentPrice = Math.round(SEED_PRICES[crop].basePrice * modifier);
      
      // Generate a simple historical trend (last 7 days)
      const history = [];
      for(let i=6; i>=0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dStr = d.toISOString().split("T")[0];
        const m = getMultiplier(crop, dStr);
        history.push({
          date: dStr,
          price: Math.round(SEED_PRICES[crop].basePrice * m)
        });
      }

      return {
        name: crop,
        currentPrice, // INR per Quintal
        costPerAcre: SEED_PRICES[crop].costPerAcre,
        yieldPerAcre: SEED_PRICES[crop].yieldPerAcre,
        history
      };
    });

    res.json(cropData);
  } catch (error) {
    console.error("Market route error:", error);
    res.status(500).json({ error: "Failed to fetch market data" });
  }
});

// Provides recommended crops for a specific soil type along with profitability based on today's simulated price
router.get("/recommendations", (req, res) => {
  try {
    let { soilType } = req.query;
    if (!soilType) soilType = "black soil";
    soilType = soilType.toLowerCase();

    const recommended = SOIL_SUITABILITY[soilType] || ["Maize", "Wheat"];
    
    const todayStr = new Date().toISOString().split("T")[0];
    
    // Build profitability
    const profits = recommended.map(crop => {
      const seed = SEED_PRICES[crop] || { basePrice: 2000, costPerAcre: 15000, yieldPerAcre: 15 };
      const modifier = getMultiplier(crop, todayStr);
      const currentPrice = Math.round(seed.basePrice * modifier);
      
      const potentialRevenue = currentPrice * seed.yieldPerAcre;
      const profit = potentialRevenue - seed.costPerAcre;

      return {
        name: crop,
        profitPerAcre: profit,
        revenue: potentialRevenue,
        cost: seed.costPerAcre,
        currentPrice
      };
    });
    
    // Sort by most profitable
    profits.sort((a,b) => b.profitPerAcre - a.profitPerAcre);
    
    res.json(profits);
  } catch (error) {
    console.error("Recommendation route error:", error);
    res.status(500).json({ error: "Failed to calculate recommendations" });
  }
});

// Marketplace Listings CRUD
router.post("/listings", requireAuth, async (req, res) => {
  try {
    const listing = new Listing({ ...req.body, seller_id: req.auth.id });
    await listing.save();
    res.status(201).json({ message: "Listing created successfully", listing });
  } catch (error) {
    console.error("Create listing error:", error);
    res.status(500).json({ error: "Failed to create listing" });
  }
});

router.get("/listings", async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const listings = await Listing.find(filter).populate("seller_id", "name email").sort({ createdAt: -1 });
    res.json(listings);
  } catch (error) {
    console.error("Get listings error:", error);
    res.status(500).json({ error: "Failed to fetch listings" });
  }
});

router.delete("/listings/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) return res.status(404).json({ error: "Listing not found" });
    if (listing.seller_id.toString() !== req.auth.id && req.auth.role !== "admin") {
      return res.status(403).json({ error: "You can only delete your own listing" });
    }
    await listing.deleteOne();
    res.json({ message: "Listing deleted successfully" });
  } catch (error) {
    console.error("Delete listing error:", error);
    res.status(500).json({ error: "Failed to delete listing" });
  }
});

module.exports = router;
