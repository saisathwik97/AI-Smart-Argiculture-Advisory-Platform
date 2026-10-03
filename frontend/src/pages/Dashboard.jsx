import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { 
  CloudSun, 
  Thermometer, 
  Droplets, 
  Wind, 
  AlertTriangle, 
  TrendingUp, 
  Lightbulb, 
  ChevronRight, 
  MapPin, 
  Sprout, 
  PhoneCall, 
  MessageSquare,
  HelpCircle
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [profile, setProfile] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [dailyTip, setDailyTip] = useState("");
  const [aiInsights, setAiInsights] = useState("");
  const [marketPrices, setMarketPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detectingLocation, setDetectingLocation] = useState(false);

  // Weather codes mapping
  const weatherDesc = {
    0: "Clear sky",
    1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
    45: "Fog", 48: "Depositing rime fog",
    51: "Light drizzle", 53: "Moderate drizzle", 55: "Dense drizzle",
    61: "Slight rain", 63: "Moderate rain", 65: "Heavy rain",
    71: "Slight snow", 73: "Moderate snow", 75: "Heavy snow",
    95: "Thunderstorm"
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Profile / Memory
      const profileRes = await axios.get(`http://${window.location.hostname}:5000/memory/${user._id}`);
      const profData = profileRes.data;
      setProfile(profData);

      // 2. Fetch daily tip
      try {
        const tipRes = await axios.get(`http://${window.location.hostname}:5000/api/daily-tip/${user._id}`);
        setDailyTip(tipRes.data.tip);
      } catch (e) {
        console.error("Tip fetch error:", e);
      }

      // 3. Fetch simulated market prices
      try {
        const marketRes = await axios.get(`http://${window.location.hostname}:5000/api/market/data`);
        setMarketPrices(marketRes.data.slice(0, 4)); // Show top 4
      } catch (e) {
        console.error("Market fetch error:", e);
      }

      // 4. Fetch Weather if location is present
      if (profData && profData.location) {
        await getLiveWeather(profData.location, profData.farmerId);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error("Dashboard data error:", error);
      setLoading(false);
    }
  };

  const getLiveWeather = async (locationName, farmerId) => {
    try {
      // Open-Meteo Geocoding
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(locationName)}&count=1`;
      const geoRes = await axios.get(geoUrl);
      
      if (geoRes.data.results && geoRes.data.results.length > 0) {
        const { latitude, longitude } = geoRes.data.results[0];
        
        // Open-Meteo weather + forecast
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max&timezone=auto`;
        const weatherRes = await axios.get(weatherUrl);
        const wData = weatherRes.data;

        setWeatherData({
          current: {
            temp: wData.current.temperature_2m,
            humidity: wData.current.relative_humidity_2m,
            wind: wData.current.wind_speed_10m,
            code: wData.current.weather_code,
            desc: weatherDesc[wData.current.weather_code] || "Variable"
          },
          forecast: wData.daily.time.slice(1, 4).map((time, idx) => ({
            date: new Date(time).toLocaleDateString("en-US", { weekday: "short" }),
            maxTemp: wData.daily.temperature_2m_max[idx + 1],
            minTemp: wData.daily.temperature_2m_min[idx + 1],
            code: wData.daily.weather_code[idx + 1],
            desc: weatherDesc[wData.daily.weather_code[idx + 1]] || "Variable",
            rainProb: wData.daily.precipitation_probability_max[idx + 1]
          }))
        });

        // Fetch AI insights based on the weather we just fetched
        try {
          const insightsRes = await axios.get(`http://${window.location.hostname}:5000/api/dashboard/insights/${farmerId}`, {
            params: {
              temp: wData.current.temperature_2m,
              weather: weatherDesc[wData.current.weather_code] || "Clear",
              humidity: wData.current.relative_humidity_2m
            }
          });
          setAiInsights(insightsRes.data.insights);
        } catch (e) {
          console.error("Insights fetch error:", e);
        }
      }
    } catch (err) {
      console.error("Weather forecast error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationDetect = () => {
    if ("geolocation" in navigator) {
      setDetectingLocation(true);
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18`);
          const addr = res.data.address || {};
          const preciseLocality = addr.suburb || addr.neighbourhood || addr.city_district || addr.town || addr.village || addr.city || addr.county;
          const state = addr.state || addr.region || "Unknown State";
          const locationString = preciseLocality ? `${preciseLocality}, ${state}` : state;
          
          let mockSoilType = "Alluvial Soil";
          const lowerState = state.toLowerCase();
          if (lowerState.includes("telangana") || lowerState.includes("andhra") || lowerState.includes("maharashtra")) mockSoilType = "Black Soil";
          else if (lowerState.includes("tamil nadu") || lowerState.includes("karnataka") || lowerState.includes("odisha")) mockSoilType = "Red Soil";
          else if (lowerState.includes("rajasthan") || lowerState.includes("gujarat")) mockSoilType = "Desert Soil";
          else if (lowerState.includes("kerala") || lowerState.includes("assam")) mockSoilType = "Laterite Soil";

          const savePayload = {
            farmerId: user._id,
            name: user.name,
            location: locationString,
            soilType: mockSoilType,
            previousCrops: profile?.previousCrops || [],
            pastIssues: profile?.pastIssues || [],
            fertilizerUsage: profile?.fertilizerUsage || []
          };

          await axios.post(`http://${window.location.hostname}:5000/memory/save`, savePayload);
          fetchDashboardData();
        } catch (err) {
          alert("Failed to fetch location details.");
        } finally {
          setDetectingLocation(false);
        }
      }, (error) => {
        setDetectingLocation(false);
        alert("Geolocation error: " + error.message);
      });
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "25px" }} className="fade-in">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="skeleton" style={{ width: "250px", height: "35px" }}></div>
          <div className="skeleton" style={{ width: "180px", height: "20px" }}></div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "25px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
            <div className="glass-panel skeleton" style={{ height: "220px" }}></div>
            <div className="glass-panel skeleton" style={{ height: "220px" }}></div>
          </div>
          <div className="glass-panel skeleton" style={{ height: "460px" }}></div>
        </div>
      </div>
    );
  }

  // Get active crop alerts
  const showRainAlert = weatherData && weatherData.current.code >= 51; // code 51+ represents drizzle, rain, snow, thunderstorms
  const irrigationPlan = !weatherData
    ? "Add your farm location to generate a weather-aware irrigation plan."
    : showRainAlert
      ? "Pause irrigation today. Recheck soil moisture 12–24 hours after rainfall."
      : weatherData.current.temp >= 35
        ? "Irrigate early morning for 30–45 minutes; check moisture again by evening."
        : "Irrigate early morning only if the top 5 cm of soil feels dry."

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "25px" }} className="fade-in">
      
      {/* Top Welcome Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "2.2rem" }}>
            Welcome back, <span style={{ color: "var(--accent)" }}>{user.name}</span>!
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            Here is your farm dashboard summary for today.
          </p>
        </div>

        {profile?.location ? (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-secondary)", background: "var(--bg-surface)", padding: "8px 16px", borderRadius: "20px", border: "1px solid var(--border-color)" }}>
            <MapPin size={16} className="text-accent" style={{ color: "var(--accent)" }} />
            <span style={{ fontSize: "0.9rem", fontWeight: 500 }}>{profile.location}</span>
          </div>
        ) : (
          <button onClick={handleLocationDetect} disabled={detectingLocation} className="btn">
            <MapPin size={16} />
            <span>{detectingLocation ? "Detecting..." : "📍 Auto-Detect Location"}</span>
          </button>
        )}
      </div>

      {/* Main Grid: Left column for operations, Right column for sidebar details */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "25px", alignItems: "start" }}>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
          
          {/* Weather Intelligence Widget */}
          <div className="glass-panel" style={{ padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ display: "flex", alignItems: "center", gap: "10px", margin: 0, fontFamily: "var(--font-display)" }}>
                <CloudSun style={{ color: "var(--accent)" }} />
                <span>Weather Intelligence</span>
              </h3>
              {showRainAlert && (
                <div style={{ background: "var(--danger-soft)", color: "var(--danger)", padding: "4px 10px", borderRadius: "12px", display: "flex", alignItems: "center", gap: "5px", fontSize: "0.8rem", fontWeight: "bold" }}>
                  <AlertTriangle size={12} />
                  <span>Rain Alert</span>
                </div>
              )}
            </div>

            {weatherData ? (
              <div>
                <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", background: "rgba(0,0,0,0.15)", padding: "20px", borderRadius: "16px", marginBottom: "20px" }}>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ margin: 0, fontSize: "2.8rem", fontWeight: 700, color: "var(--accent)" }}>{weatherData.current.temp}°C</p>
                    <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "0.9rem", fontWeight: 500 }}>{weatherData.current.desc}</p>
                  </div>
                  
                  <div style={{ borderLeft: "1px solid var(--border-color)", paddingLeft: "25px", display: "flex", flexDirection: "column", gap: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <Thermometer size={18} style={{ color: "var(--text-muted)" }} />
                      <span style={{ fontSize: "0.9rem" }}>Wind: {weatherData.current.wind} km/h</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <Droplets size={18} style={{ color: "var(--text-muted)" }} />
                      <span style={{ fontSize: "0.9rem" }}>Humidity: {weatherData.current.humidity}%</span>
                    </div>
                  </div>
                </div>

                {/* 3-day Forecast */}
                <h4 style={{ margin: "0 0 10px 0", fontSize: "0.9rem", color: "var(--text-secondary)" }}>3-Day Forecast</h4>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                  {weatherData.forecast.map((day, idx) => (
                    <div key={idx} style={{ background: "rgba(0,0,0,0.1)", border: "1px solid var(--border-color)", borderRadius: "12px", padding: "12px", textAlign: "center" }}>
                      <p style={{ margin: "0 0 5px 0", fontWeight: "bold", fontSize: "0.85rem" }}>{day.date}</p>
                      <p style={{ margin: "0 0 5px 0", fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)" }}>{day.maxTemp}°C</p>
                      <p style={{ margin: "0 0 5px 0", fontSize: "0.75rem", color: "var(--text-secondary)" }}>{day.desc}</p>
                      <p style={{ margin: 0, fontSize: "0.7rem", color: "var(--accent)" }}>💧 {day.rainProb}% rain</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p style={{ color: "var(--text-secondary)", textAlign: "center", margin: "20px 0" }}>
                📍 Geolocation needed to show local weather data. Click "Auto-Detect Location" above.
              </p>
            )}
          </div>

          {/* Profit Analytics Calculator shortcut */}
          <div className="glass-panel" style={{ padding: "24px" }}>
            <h3 style={{ display: "flex", alignItems: "center", gap: "10px", margin: "0 0 15px 0", fontFamily: "var(--font-display)" }}>
              <TrendingUp style={{ color: "var(--accent)" }} />
              <span>Profit Analytics snapshot</span>
            </h3>
            
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "20px" }}>
              Compute expected yield, production costs, and net margins of crops grown in your farm soil.
            </p>

            <div style={{ display: "flex", gap: "15px" }}>
              <button onClick={() => navigate("/market")} className="btn" style={{ flex: 1 }}>
                <span>Open Calculator</span>
                <ChevronRight size={16} />
              </button>
              <button onClick={() => navigate("/crop-recommend")} className="btn secondary" style={{ flex: 1 }}>
                <span>Recommend Crops</span>
              </button>
            </div>
          </div>

        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
          
          {/* AI Insights & Daily Tip */}
          <div className="glass-panel" style={{ padding: "24px" }}>
            <h3 style={{ display: "flex", alignItems: "center", gap: "10px", margin: "0 0 20px 0", fontFamily: "var(--font-display)" }}>
              <Lightbulb style={{ color: "var(--accent)" }} />
              <span>AI Advisory Insights</span>
            </h3>

            {dailyTip && (
              <div style={{ background: "var(--accent-soft)", borderLeft: "4px solid var(--accent)", padding: "16px", borderRadius: "12px", marginBottom: "20px" }}>
                <p style={{ margin: "0 0 5px 0", fontWeight: "bold", fontSize: "0.85rem", color: "var(--accent)" }}>💡 Daily Tip</p>
                <p style={{ margin: 0, fontSize: "0.95rem", fontStyle: "italic", lineHeight: 1.5 }}>"{dailyTip}"</p>
              </div>
            )}

            {aiInsights ? (
              <div>
                <p style={{ margin: "0 0 10px 0", fontWeight: "bold", fontSize: "0.85rem", color: "var(--text-secondary)" }}>🌦️ Weather-Driven AI Advice</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {aiInsights.split("\n").filter(line => line.trim()).map((insight, idx) => (
                    <div key={idx} style={{ display: "flex", gap: "10px", alignItems: "flex-start", background: "rgba(0,0,0,0.1)", padding: "12px", borderRadius: "8px" }}>
                      <span style={{ color: "var(--accent)", fontWeight: "bold" }}>✦</span>
                      <p style={{ margin: 0, fontSize: "0.85rem", lineHeight: 1.4, color: "var(--text-primary)" }}>{insight.replace(/^-\s*/, "")}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>No weather insights available. Auto-detect your location to load real-time advisory suggestions.</p>
            )}
          </div>

          {/* Market Price Trends snapshot */}
          <div className="glass-panel" style={{ padding: "24px" }}>
            <h3 style={{ display: "flex", alignItems: "center", gap: "10px", margin: "0 0 15px 0", fontFamily: "var(--font-display)" }}>
              <Sprout style={{ color: "var(--accent)" }} />
              <span>Market Prices snapshot</span>
            </h3>

            {marketPrices.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "15px" }}>
                {marketPrices.map((crop, idx) => (
                  <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", background: "rgba(0,0,0,0.15)", borderRadius: "10px" }}>
                    <span style={{ fontWeight: "bold", fontSize: "0.9rem" }}>{crop.name}</span>
                    <span style={{ color: "var(--accent)", fontWeight: "bold", fontSize: "0.95rem" }}>₹{crop.currentPrice} / Qtl</span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", margin: "15px 0" }}>Loading prices...</p>
            )}

            <button onClick={() => navigate("/market")} className="btn secondary" style={{ width: "100%" }}>
              <span>View Full Marketplace</span>
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Expert Outbreak Alert widget */}
          <div className="glass-panel" style={{ padding: "24px", background: "rgba(239, 68, 68, 0.05)", borderColor: "rgba(239, 68, 68, 0.2)" }}>
            <h3 style={{ display: "flex", alignItems: "center", gap: "10px", margin: "0 0 10px 0", fontFamily: "var(--font-display)", color: "var(--danger)" }}>
              <AlertTriangle />
              <span>Disease & Pest Alerts</span>
            </h3>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
              No active disease alerts found in your immediate locality. Monitor your leaf health regularly and run a diagnostic check if you spot anomalies.
            </p>
            <button onClick={() => navigate("/disease-detection")} className="btn secondary" style={{ width: "100%", marginTop: "14px" }}>
              Run leaf diagnostic
            </button>
          </div>

          <div className="glass-panel" style={{ padding: "24px" }}>
            <h3 style={{ display: "flex", alignItems: "center", gap: "10px", margin: "0 0 10px 0", fontFamily: "var(--font-display)" }}>
              <Droplets style={{ color: "var(--accent)" }} />
              <span>Smart Irrigation</span>
            </h3>
            <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>{irrigationPlan}</p>
            <p style={{ margin: "10px 0 0", fontSize: "0.75rem", color: "var(--text-muted)" }}>Weather-aware guidance — confirm with a soil-moisture reading before watering.</p>
          </div>

        </div>

      </div>

    </div>
  );
}
