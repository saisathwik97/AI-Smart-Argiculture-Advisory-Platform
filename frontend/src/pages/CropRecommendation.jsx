import { useState } from "react";
import axios from "axios";
import "../styles/CropRecommendation.css";

export default function CropRecommendation() {
  const [formData, setFormData] = useState({
    N: "",
    P: "",
    K: "",
    temperature: "",
    humidity: "",
    ph: "",
    rainfall: ""
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: Number(e.target.value)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult("");
    setLoading(true);

    try {
      const response = await axios.post(
        `http://${window.location.hostname}:5000/crop/predict`,
        formData
      );
      setResult(response.data);
    } catch (error) {
      alert("Error connecting to backend");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="crop-section">
      <h2>Smart Crop Predictor</h2>
      <p className="crop-desc">
        Enter soil nutrients and weather values to get the smartest crop suggestion.
      </p>

      <form className="crop-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nitrogen (N)</label>
          <input type="number" name="N" placeholder="Enter nitrogen value" onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Phosphorus (P)</label>
          <input type="number" name="P" placeholder="Enter phosphorus value" onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Potassium (K)</label>
          <input type="number" name="K" placeholder="Enter potassium value" onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Temperature (°C)</label>
          <input type="number" step="0.1" name="temperature" placeholder="Enter temperature" onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Humidity (%)</label>
          <input type="number" name="humidity" placeholder="Enter humidity" onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Soil pH</label>
          <input type="number" step="0.1" name="ph" placeholder="Enter pH value" onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Rainfall (mm)</label>
          <input type="number" name="rainfall" placeholder="Enter rainfall" onChange={handleChange} required />
        </div>

        <button type="submit" disabled={loading}>{loading ? "Predicting..." : "Predict Crop"}</button>
      </form>

      {result && (
        <section className="crop-result glass-panel" aria-live="polite">
          <p className="result-eyebrow">AI crop plan</p>
          <h3>Grow {result.recommended_crop}</h3>
          <div className="result-grid">
            <article>
              <h4>Expected yield</h4>
              <p>{result.yield}</p>
            </article>
            <article>
              <h4>Fertilizer recommendation</h4>
              <p>{result.fertilizer}</p>
            </article>
            <article>
              <h4>Water & irrigation</h4>
              <p>{result.water}</p>
            </article>
          </div>
        </section>
      )}
    </div>
  );
}
