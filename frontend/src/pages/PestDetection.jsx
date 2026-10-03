import { useState } from "react";
import axios from "axios";
import {
  Upload,
  AlertTriangle,
  ShieldCheck,
  Flame
} from "lucide-react";
import Toast from "../components/Toast";

export default function PestDetection() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [toast, setToast] = useState(null);

  const validateImage = (file) => {
    if (!file) return false;

    if (!file.type.startsWith("image/")) {
      setToast({
        message: "Please select an image file.",
        type: "error"
      });
      return false;
    }

    if (file.size > 10 * 1024 * 1024) {
      setToast({
        message: "Image must be 10MB or smaller.",
        type: "error"
      });
      return false;
    }

    return true;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!validateImage(file)) {
      return;
    }

    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();

    const file = e.dataTransfer.files[0];

    if (!validateImage(file)) {
      return;
    }

    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedImage) {
      setToast({
        message: "Please upload an image first.",
        type: "error"
      });
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      const res = await axios.post(
        `http://${window.location.hostname}:5000/api/detect-disease`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      if (res.data.success) {
        setResult(res.data);

        setToast({
          message: "Leaf diagnostic check complete!",
          type: "success"
        });
      } else {
        setToast({
          message: res.data.error || "Failed to analyze leaf.",
          type: "error"
        });
      }
    } catch (err) {
      console.error("Disease detection error:", err);

      if (
        err.response?.status === 429 ||
        err.response?.data?.quotaExceeded
      ) {
        setToast({
          message:
            "AI disease detection quota has been exceeded. Please try again later.",
          type: "error"
        });
      } else if (err.response?.data?.error) {
        setToast({
          message: err.response.data.error,
          type: "error"
        });
      } else {
        setToast({
          message: "Error contacting AI vision service.",
          type: "error"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{ maxWidth: "800px", margin: "0 auto" }}
      className="fade-in"
    >
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: "2rem",
          marginBottom: "10px"
        }}
      >
        🍂 Pest & Disease Diagnostic
      </h2>

      <p
        style={{
          color: "var(--text-secondary)",
          marginBottom: "30px",
          fontSize: "0.95rem"
        }}
      >
        Upload or drag a photo of an infected crop leaf. Our AI will analyze
        the leaf details, identify the pest or disease, and suggest organic
        and chemical treatments.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: previewUrl ? "1fr 1fr" : "1fr",
          gap: "25px",
          alignItems: "start"
        }}
      >
        {/* Upload Card */}
        <div className="glass-panel" style={{ padding: "30px" }}>
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px"
            }}
          >
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              style={{
                border: "2px dashed var(--border-color)",
                borderRadius: "16px",
                padding: "40px 20px",
                textAlign: "center",
                cursor: "pointer",
                background: "rgba(0,0,0,0.1)",
                transition: "border-color 0.2s"
              }}
              onClick={() =>
                document.getElementById("leaf-upload").click()
              }
            >
              <input
                type="file"
                id="leaf-upload"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />

              <Upload
                size={40}
                style={{
                  color: "var(--accent)",
                  marginBottom: "15px"
                }}
              />

              <p
                style={{
                  margin: "0 0 5px 0",
                  fontWeight: "bold"
                }}
              >
                {selectedImage
                  ? selectedImage.name
                  : "Drag & Drop Image"}
              </p>

              <p
                style={{
                  margin: 0,
                  fontSize: "0.8rem",
                  color: "var(--text-muted)"
                }}
              >
                Supports PNG, JPG, JPEG up to 10MB
              </p>
            </div>

            {previewUrl && (
              <div
                style={{
                  borderRadius: "12px",
                  overflow: "hidden",
                  border: "1px solid var(--border-color)",
                  height: "200px"
                }}
              >
                <img
                  src={previewUrl}
                  alt="Leaf Preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
                  }}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px"
              }}
            >
              {loading ? "Diagnosing Leaf..." : "Run AI Diagnostic"}
            </button>
          </form>
        </div>

        {/* Diagnostic Results */}
        {result && (
          <div
            className="glass-panel"
            style={{
              padding: "30px",
              animation: "fadeIn 0.4s ease"
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid var(--border-color)",
                paddingBottom: "15px",
                marginBottom: "20px"
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontFamily: "var(--font-display)",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                <AlertTriangle
                  size={20}
                  style={{ color: "var(--warning)" }}
                />

                <span>Diagnostic Report</span>
              </h3>

              <span
                style={{
                  background: "var(--accent-soft)",
                  color: "var(--accent)",
                  padding: "4px 10px",
                  borderRadius: "12px",
                  fontSize: "0.8rem",
                  fontWeight: "bold"
                }}
              >
                Confidence: {result.confidence}
              </span>
            </div>

            <h4
              style={{
                fontSize: "1.4rem",
                margin: "0 0 10px 0",
                color: "var(--text-primary)"
              }}
            >
              {result.disease}
            </h4>

            {/* Causes */}
            <div style={{ marginBottom: "15px" }}>
              <h5
                style={{
                  margin: "0 0 5px 0",
                  color: "var(--text-secondary)",
                  fontSize: "0.85rem",
                  textTransform: "uppercase"
                }}
              >
                Primary Causes
              </h5>

              <ul
                style={{
                  paddingLeft: "15px",
                  fontSize: "0.9rem",
                  lineHeight: 1.5
                }}
              >
                {(result.causes || []).map((cause, idx) => (
                  <li key={idx}>{cause}</li>
                ))}
              </ul>
            </div>

            {/* Organic Treatment */}
            <div
              style={{
                background: "rgba(16, 185, 129, 0.08)",
                borderLeft: "3px solid #10b981",
                padding: "12px 15px",
                borderRadius: "8px",
                marginBottom: "15px"
              }}
            >
              <h5
                style={{
                  margin: "0 0 5px 0",
                  color: "#10b981",
                  fontSize: "0.85rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px"
                }}
              >
                <ShieldCheck size={14} />
                <span>Organic Control</span>
              </h5>

              <ul
                style={{
                  paddingLeft: "15px",
                  fontSize: "0.85rem",
                  lineHeight: 1.4,
                  color: "var(--text-primary)"
                }}
              >
                {(result.organic_treatment || []).map((treatment, idx) => (
                  <li key={idx}>{treatment}</li>
                ))}
              </ul>
            </div>

            {/* Chemical Treatment */}
            <div
              style={{
                background: "rgba(239, 68, 68, 0.08)",
                borderLeft: "3px solid #ef4444",
                padding: "12px 15px",
                borderRadius: "8px",
                marginBottom: "15px"
              }}
            >
              <h5
                style={{
                  margin: "0 0 5px 0",
                  color: "#ef4444",
                  fontSize: "0.85rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px"
                }}
              >
                <Flame size={14} />
                <span>Chemical Control</span>
              </h5>

              <ul
                style={{
                  paddingLeft: "15px",
                  fontSize: "0.85rem",
                  lineHeight: 1.4,
                  color: "var(--text-primary)"
                }}
              >
                {(result.chemical_treatment || []).map((treatment, idx) => (
                  <li key={idx}>{treatment}</li>
                ))}
              </ul>
            </div>

            {/* Prevention */}
            <div>
              <h5
                style={{
                  margin: "0 0 5px 0",
                  color: "var(--text-secondary)",
                  fontSize: "0.85rem",
                  textTransform: "uppercase"
                }}
              >
                Prevention Protocols
              </h5>

              <ul
                style={{
                  paddingLeft: "15px",
                  fontSize: "0.85rem",
                  lineHeight: 1.4
                }}
              >
                {(result.prevention_tips || []).map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}