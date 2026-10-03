import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Market() {
  const [marketData, setMarketData] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  
  const [calcInput, setCalcInput] = useState({
    crop: "Rice",
    acres: 1
  });

  const [farmerSoil, setFarmerSoil] = useState("black soil");
  const [listings, setListings] = useState([]);
  const [listingForm, setListingForm] = useState({ title: "", category: "produce", price: "", quantity: "", location: "", description: "" });
  const user = JSON.parse(localStorage.getItem("user"));

  const loadListings = () => axios.get(`http://${window.location.hostname}:5000/api/market/listings`)
    .then((res) => setListings(res.data))
    .catch(() => console.error("Could not fetch marketplace listings"));
  
  useEffect(() => {
    // Attempt to load farmer memory to auto-fill their soil type
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.role === "farmer") {
      axios.get(`http://${window.location.hostname}:5000/memory/${user._id}`)
           .then(res => {
             if (res.data && res.data.soilType) {
               setFarmerSoil(res.data.soilType);
             }
           }).catch(() => {});
    }

    axios.get(`http://${window.location.hostname}:5000/api/market/data`)
         .then(res => setMarketData(res.data))
         .catch(() => console.error("Could not fetch market data"));
    loadListings();
  }, []);

  useEffect(() => {
    // Fetch recommendations when farmer's soil type is confirmed or changes
    axios.get(`http://${window.location.hostname}:5000/api/market/recommendations?soilType=${farmerSoil}`)
         .then(res => setRecommendations(res.data))
         .catch(() => console.error("Could not fetch recommendations"));
  }, [farmerSoil]);

  const selectedCropData = marketData.find(c => c.name === calcInput.crop);

  const createListing = async (event) => {
    event.preventDefault();
    if (!user?._id) return;
    try {
      await axios.post(`http://${window.location.hostname}:5000/api/market/listings`, {
        ...listingForm,
        seller_id: user._id,
        price: Number(listingForm.price)
      });
      setListingForm({ title: "", category: "produce", price: "", quantity: "", location: "", description: "" });
      loadListings();
    } catch (error) {
      alert("Could not publish listing. Please check the required fields.");
    }
  };

  const deleteListing = async (listingId) => {
    try {
      await axios.delete(`http://${window.location.hostname}:5000/api/market/listings/${listingId}`);
      loadListings();
    } catch (error) {
      alert("Could not remove listing.");
    }
  };

  let potentialProfit = 0;
  let revenue = 0;
  let cost = 0;

  if (selectedCropData) {
    revenue = (selectedCropData.yieldPerAcre * calcInput.acres) * selectedCropData.currentPrice;
    cost = selectedCropData.costPerAcre * calcInput.acres;
    potentialProfit = revenue - cost;
  }

  const chartData = {
    labels: selectedCropData ? selectedCropData.history.map(h => h.date).reverse() : [],
    datasets: [
      {
        label: `${calcInput.crop} Price (INR / Qtl)`,
        data: selectedCropData ? selectedCropData.history.map(h => h.price).reverse() : [],
        borderColor: "rgb(16, 185, 129)",
        backgroundColor: "rgba(16, 185, 129, 0.5)",
      }
    ]
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1100px", margin: "auto", display: "grid", gridTemplateColumns: "2fr 1fr", gap: "25px" }}>
      
      {/* Left Column: Historical Prices and Calculator */}
      <div>
        <h2 style={{ color: "var(--accent-color)", display: "flex", alignItems: "center", gap: "10px" }}>
          <span>📈</span> Market & Yield Profitability
        </h2>
        
        <div className="glass-panel" style={{ padding: "25px", marginBottom: "20px" }}>
          <h3>Profit Calculator</h3>
          <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", marginBottom: "5px", color: "var(--text-secondary)" }}>Select Crop</label>
              <select 
                value={calcInput.crop}
                onChange={e => setCalcInput({...calcInput, crop: e.target.value})}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.2)", background: "rgba(0,0,0,0.5)", color: "white" }}
              >
                {marketData.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", marginBottom: "5px", color: "var(--text-secondary)" }}>Acreage (Acres)</label>
              <input 
                type="number" 
                min="0.1" step="0.1"
                value={calcInput.acres}
                onChange={e => setCalcInput({...calcInput, acres: Number(e.target.value)})}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.2)", background: "rgba(0,0,0,0.5)", color: "white" }}
              />
            </div>
          </div>
          
          {selectedCropData && (
            <div style={{ background: "rgba(16, 185, 129, 0.1)", padding: "15px", borderRadius: "10px", border: "1px dashed var(--emerald-primary)" }}>
              <p style={{ margin: "0 0 5px 0" }}>Expected Yield: <strong>{(selectedCropData.yieldPerAcre * calcInput.acres).toFixed(2)} Quintals</strong></p>
              <p style={{ margin: "0 0 5px 0" }}>Estimated Cost: <strong>₹{cost.toLocaleString()}</strong></p>
              <p style={{ margin: "0 0 5px 0" }}>Estimated Revenue: <strong>₹{revenue.toLocaleString()}</strong></p>
              <hr style={{ borderColor: "rgba(255,255,255,0.1)", margin: "10px 0" }}/>
              <h4 style={{ margin: 0, color: potentialProfit > 0 ? "var(--emerald-primary)" : "red" }}>
                Potential Profit: ₹{potentialProfit.toLocaleString()}
              </h4>
            </div>
          )}
        </div>

        <div className="glass-panel" style={{ padding: "25px" }}>
          <h3>Historical Price Trend (Last 7 Days)</h3>
          {selectedCropData ? (
            <Line data={chartData} options={{ responsive: true, color: "grey" }} />
          ) : <p>Loading data...</p>}
        </div>

      </div>
      
      {/* Right Column: Recommendations */}
      <div>
        <div className="glass-panel" style={{ padding: "25px" }}>
          <h3 style={{ color: "var(--emerald-primary)" }}>Best Crops for You</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9em", marginBottom: "20px" }}>
            Based on your Auto-detected <strong>{farmerSoil}</strong>. We dynamically match these for maximum profit based on today's simulated market snapshot.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {recommendations.length > 0 ? recommendations.map((rec, idx) => (
              <div key={rec.name} style={{ background: "rgba(0,0,0,0.4)", borderRadius: "10px", padding: "15px", position: "relative" }}>
                 {idx === 0 && <span style={{ position: "absolute", top: -10, right: -10, fontSize: "1.5em" }}>🌟</span>}
                 <h4 style={{ margin: "0 0 5px 0" }}>{rec.name}</h4>
                 <p style={{ margin: "0 0 5px 0", fontSize: "0.85em", color: "var(--text-secondary)" }}>Current Price: ₹{rec.currentPrice}/Qtl</p>
                 <p style={{ margin: 0, fontWeight: "bold", color: "var(--emerald-primary)" }}>Max Profit: ₹{rec.profitPerAcre.toLocaleString()} / Acre</p>
              </div>
            )) : <p>No specific recommendations.</p>}
          </div>
        </div>
      </div>

      <section style={{ gridColumn: "1 / -1" }}>
        <div className="glass-panel" style={{ padding: "25px", marginTop: "5px" }}>
          <h3 style={{ margin: "0 0 8px" }}>Buy, sell, or rent locally</h3>
          <p style={{ margin: "0 0 20px", color: "var(--text-secondary)" }}>Publish produce, equipment-rental, and fertilizer listings for nearby farming communities.</p>

          {user?.role === "farmer" && (
            <form onSubmit={createListing} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "12px", marginBottom: "24px" }}>
              <input required placeholder="Listing title" value={listingForm.title} onChange={(e) => setListingForm({ ...listingForm, title: e.target.value })} />
              <select value={listingForm.category} onChange={(e) => setListingForm({ ...listingForm, category: e.target.value })}>
                <option value="produce">Produce</option><option value="equipment">Equipment rental</option><option value="fertilizer">Fertilizer</option>
              </select>
              <input required type="number" min="0" placeholder="Price (₹)" value={listingForm.price} onChange={(e) => setListingForm({ ...listingForm, price: e.target.value })} />
              <input required placeholder="Quantity / rental period" value={listingForm.quantity} onChange={(e) => setListingForm({ ...listingForm, quantity: e.target.value })} />
              <input required placeholder="Location" value={listingForm.location} onChange={(e) => setListingForm({ ...listingForm, location: e.target.value })} />
              <input placeholder="Short description" value={listingForm.description} onChange={(e) => setListingForm({ ...listingForm, description: e.target.value })} />
              <button type="submit" style={{ gridColumn: "1 / -1", justifySelf: "start" }}>Publish listing</button>
            </form>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px" }}>
            {listings.length ? listings.map((listing) => (
              <article key={listing._id} style={{ border: "1px solid var(--border-color)", borderRadius: "12px", padding: "16px", background: "rgba(0,0,0,0.1)" }}>
                <p style={{ margin: "0 0 6px", color: "var(--accent)", fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase" }}>{listing.category}</p>
                <h4 style={{ margin: "0 0 8px" }}>{listing.title}</h4>
                <p style={{ margin: "0 0 6px", fontWeight: 700 }}>₹{Number(listing.price).toLocaleString()}</p>
                <p style={{ margin: "0 0 6px", color: "var(--text-secondary)", fontSize: "0.86rem" }}>{listing.quantity} · {listing.location}</p>
                {listing.description && <p style={{ margin: "0", color: "var(--text-secondary)", fontSize: "0.82rem" }}>{listing.description}</p>}
                {user?._id === (listing.seller_id?._id || listing.seller_id) && <button className="danger" onClick={() => deleteListing(listing._id)} style={{ marginTop: "12px", padding: "6px 10px" }}>Remove</button>}
              </article>
            )) : <p style={{ color: "var(--text-secondary)" }}>No community listings yet. Be the first to publish one.</p>}
          </div>
        </div>
      </section>
      
    </div>
  );
}
