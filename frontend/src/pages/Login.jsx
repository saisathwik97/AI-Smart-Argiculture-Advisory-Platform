import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [role, setRole] = useState("farmer");
  const [loginRole, setLoginRole] = useState("farmer");

  const [proofOfExpertise, setProofOfExpertise] = useState("");
  const [location, setLocation] = useState("");
  const [soilType, setSoilType] = useState("");

  const [detectingLocation, setDetectingLocation] =
    useState(false);

  const navigate = useNavigate();

  /* =========================================================
     LOCATION DETECTION
     ========================================================= */

  const handleLocationDetect = () => {
    if ("geolocation" in navigator) {
      setDetectingLocation(true);

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            const res = await axios.get(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18`
            );

            const addr = res.data.address || {};

            const preciseLocality =
              addr.suburb ||
              addr.neighbourhood ||
              addr.city_district ||
              addr.town ||
              addr.village ||
              addr.city ||
              addr.county;

            const state =
              addr.state ||
              addr.region ||
              "Unknown State";

            const locationString = preciseLocality
              ? `${preciseLocality}, ${state}`
              : state;

            let mockSoilType = "Alluvial Soil";

            const lowerState = state.toLowerCase();

            if (
              lowerState.includes("telangana") ||
              lowerState.includes("andhra") ||
              lowerState.includes("maharashtra")
            ) {
              mockSoilType = "Black Soil";
            } else if (
              lowerState.includes("tamil nadu") ||
              lowerState.includes("karnataka") ||
              lowerState.includes("odisha")
            ) {
              mockSoilType = "Red Soil";
            } else if (
              lowerState.includes("rajasthan") ||
              lowerState.includes("gujarat")
            ) {
              mockSoilType = "Desert Soil";
            } else if (
              lowerState.includes("kerala") ||
              lowerState.includes("assam")
            ) {
              mockSoilType = "Laterite Soil";
            }

            setLocation(locationString);
            setSoilType(mockSoilType);
          } catch (err) {
            alert(
              "Failed to fetch location details."
            );
          } finally {
            setDetectingLocation(false);
          }
        },
        (error) => {
          setDetectingLocation(false);

          alert(
            "Geolocation error: " +
              error.message
          );
        }
      );
    } else {
      alert(
        "Geolocation is not supported by your browser."
      );
    }
  };

  /* =========================================================
     FORM SUBMIT
     ========================================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        const res = await axios.post(
          `http://${window.location.hostname}:5000/auth/login`,
          {
            email,
            password,
          }
        );

        const loggedUser = {
          ...res.data.user,
        };

        const effectiveRole =
          loggedUser.role === "farmer_expert"
            ? loginRole
            : loggedUser.role;

        loggedUser.originalRole =
          res.data.user.role;

        loggedUser.role = effectiveRole;

        localStorage.setItem(
          "user",
          JSON.stringify(loggedUser)
        );

        localStorage.setItem(
          "token",
          res.data.token
        );

        if (effectiveRole === "admin") {
          navigate("/admin");
        } else if (
          effectiveRole === "expert" &&
          res.data.expertData &&
          !res.data.expertData.is_approved
        ) {
          alert(
            "Your expert account is pending admin approval."
          );

          navigate("/");
        } else if (
          effectiveRole === "expert" ||
          effectiveRole === "farmer_expert"
        ) {
          navigate("/expert-dashboard");
        } else {
          navigate("/ai-assistant");
        }
      } else {
        await axios.post(
          `http://${window.location.hostname}:5000/auth/register`,
          {
            name,
            email,
            password,
            role,
            proofOfExpertise,
            location,
            soilType,
          }
        );

        alert(
          "Registered successfully! Please login."
        );

        setIsLogin(true);
      }
    } catch (err) {
      alert(
        "Error: " +
          (err.response?.data?.message ||
            err.message)
      );
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "30px 20px",
        boxSizing: "border-box",
        background:
          "radial-gradient(circle at top left, rgba(76,175,80,0.12), transparent 35%), var(--bg-primary)",
      }}
    >
      {/* =====================================================
          MAIN AUTH CARD
      ====================================================== */}

      <div
        style={{
          width: "1100px",
          maxWidth: "100%",
          minHeight: "650px",
          display: "grid",
          gridTemplateColumns:
            "minmax(0, 1fr) minmax(0, 1fr)",
          overflow: "hidden",
          borderRadius: "24px",
          background: "var(--bg-surface)",
          border:
            "1px solid var(--border-color)",
          boxShadow:
            "0 25px 70px rgba(0,0,0,0.22)",
        }}
      >
        {/* =================================================
            LEFT AGRICULTURE PANEL
        ================================================== */}

        <div
          style={{
            position: "relative",
            minHeight: "650px",
            padding: "42px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            color: "white",
            overflow: "hidden",

            background:
              "linear-gradient(160deg, rgba(3,20,12,0.55), rgba(3,20,12,0.88)), url('https://images.unsplash.com/photo-1592982537447-6f2a6a0c6c23?q=80&w=1200&auto=format&fit=crop')",

            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Decorative glow */}

          <div
            style={{
              position: "absolute",
              width: "300px",
              height: "300px",
              borderRadius: "50%",
              background:
                "rgba(76,175,80,0.15)",
              filter: "blur(70px)",
              top: "-100px",
              right: "-100px",
            }}
          />

          {/* Brand */}

          <div
            style={{
              position: "relative",
              zIndex: 2,
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "46px",
                height: "46px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "13px",
                background:
                  "linear-gradient(135deg, #66bb6a, #2e7d32)",
                fontSize: "24px",
                boxShadow:
                  "0 10px 25px rgba(0,0,0,0.2)",
              }}
            >
              🌱
            </div>

            <div>
              <div
                style={{
                  fontSize: "21px",
                  fontWeight: 800,
                  lineHeight: 1,
                }}
              >
                Agri<span style={{ color: "#81c784" }}>
                  AI
                </span>
              </div>

              <div
                style={{
                  marginTop: "5px",
                  color:
                    "rgba(255,255,255,0.6)",
                  fontSize: "9px",
                  letterSpacing: "0.13em",
                  textTransform: "uppercase",
                }}
              >
                Smart Agriculture
              </div>
            </div>
          </div>

          {/* Left content */}

          <div
            style={{
              position: "relative",
              zIndex: 2,
              maxWidth: "480px",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
                padding: "7px 12px",
                marginBottom: "18px",
                borderRadius: "30px",
                background:
                  "rgba(76,175,80,0.16)",
                border:
                  "1px solid rgba(165,214,167,0.25)",
                color: "#c8e6c9",
                fontSize: "11px",
                fontWeight: 700,
              }}
            >
              ✦ AI-POWERED FARMING
            </div>

            <h1
              style={{
                margin: "0 0 18px",
                fontSize:
                  "clamp(2.2rem, 4vw, 3.5rem)",
                lineHeight: 1.08,
                fontWeight: 800,
                letterSpacing: "-0.04em",
              }}
            >
              Grow smarter.
              <br />
              <span
                style={{
                  color: "#81c784",
                }}
              >
                Farm better.
              </span>
            </h1>

            <p
              style={{
                margin: 0,
                color:
                  "rgba(255,255,255,0.72)",
                fontSize: "15px",
                lineHeight: 1.7,
              }}
            >
              Get intelligent agricultural guidance,
              understand your farm conditions, and make
              better-informed farming decisions with AgriAI.
            </p>

            {/* Benefits */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(2, 1fr)",
                gap: "10px",
                marginTop: "28px",
              }}
            >
              <Benefit icon="🌱" text="Crop Guidance" />
              <Benefit icon="🔬" text="Disease Detection" />
              <Benefit icon="🪨" text="Soil Analysis" />
              <Benefit icon="🧑‍🌾" text="Expert Support" />
            </div>
          </div>

          {/* Bottom text */}

          <div
            style={{
              position: "relative",
              zIndex: 2,
              color:
                "rgba(255,255,255,0.45)",
              fontSize: "11px",
            }}
          >
            Technology for smarter and sustainable agriculture.
          </div>
        </div>

        {/* =================================================
            RIGHT FORM PANEL
        ================================================== */}

        <div
          style={{
            padding:
              "clamp(30px, 5vw, 55px)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            background:
              "var(--bg-surface)",
            overflowY: "auto",
          }}
        >
          {/* Heading */}

          <div
            style={{
              textAlign: "center",
              marginBottom: "28px",
            }}
          >
            <div
              style={{
                width: "50px",
                height: "50px",
                margin: "0 auto 15px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "14px",
                background:
                  "var(--accent-soft)",
                fontSize: "23px",
              }}
            >
              {isLogin ? "👋" : "🌱"}
            </div>

            <h2
              style={{
                margin: 0,
                color: "var(--text-primary)",
                fontSize: "27px",
                fontWeight: 800,
                letterSpacing: "-0.02em",
              }}
            >
              {isLogin
                ? "Welcome back"
                : "Create your account"}
            </h2>

            <p
              style={{
                margin:
                  "8px 0 0",
                color:
                  "var(--text-secondary)",
                fontSize: "13px",
              }}
            >
              {isLogin
                ? "Sign in to continue to your agricultural dashboard."
                : "Join AgriAI and start making smarter farming decisions."}
            </p>
          </div>

          {/* =================================================
              LOGIN ROLE
          ================================================== */}

          {isLogin && (
            <div
              style={{
                marginBottom: "18px",
                padding: "5px",
                display: "grid",
                gridTemplateColumns:
                  "1fr 1fr",
                gap: "5px",
                background:
                  "var(--bg-secondary)",
                border:
                  "1px solid var(--border-color)",
                borderRadius: "11px",
              }}
            >
              <RoleButton
                active={loginRole === "farmer"}
                onClick={() =>
                  setLoginRole("farmer")
                }
                icon="🌾"
                label="Farmer"
              />

              <RoleButton
                active={loginRole === "expert"}
                onClick={() =>
                  setLoginRole("expert")
                }
                icon="🧑‍🌾"
                label="Expert"
              />
            </div>
          )}

          {/* =================================================
              FORM
          ================================================== */}

          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            {/* Registration name */}

            {!isLogin && (
              <>
                <Field
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  required
                />

                {/* Registration role */}

                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "7px",
                      color:
                        "var(--text-primary)",
                      fontSize: "12px",
                      fontWeight: 700,
                    }}
                  >
                    Account Type
                  </label>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "1fr 1fr",
                      gap: "9px",
                    }}
                  >
                    <RoleButton
                      active={role === "farmer"}
                      onClick={() =>
                        setRole("farmer")
                      }
                      icon="🌾"
                      label="Farmer"
                    />

                    <RoleButton
                      active={role === "expert"}
                      onClick={() =>
                        setRole("expert")
                      }
                      icon="🧑‍🌾"
                      label="Expert"
                    />
                  </div>
                </div>

                {/* Farmer details */}

                {role === "farmer" && (
                  <div
                    style={{
                      padding: "15px",
                      borderRadius: "13px",
                      background:
                        "var(--bg-secondary)",
                      border:
                        "1px solid var(--border-color)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent:
                          "space-between",
                        gap: "10px",
                        marginBottom: "12px",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            color:
                              "var(--text-primary)",
                            fontSize: "13px",
                            fontWeight: 700,
                          }}
                        >
                          🌾 Farm Details
                        </div>

                        <div
                          style={{
                            marginTop: "3px",
                            color:
                              "var(--text-muted)",
                            fontSize: "10px",
                          }}
                        >
                          Optional
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={
                          handleLocationDetect
                        }
                        disabled={
                          detectingLocation
                        }
                        style={{
                          padding:
                            "7px 10px",
                          borderRadius: "8px",
                          border:
                            "1px solid var(--accent-color)",
                          background:
                            "var(--accent-soft)",
                          color:
                            "var(--accent-color)",
                          cursor:
                            detectingLocation
                              ? "wait"
                              : "pointer",
                          fontSize: "11px",
                          fontWeight: 700,
                        }}
                      >
                        {detectingLocation
                          ? "⏳ Detecting..."
                          : "📍 Auto-Detect"}
                      </button>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                      }}
                    >
                      <input
                        type="text"
                        placeholder="Location (City, State)"
                        value={location}
                        onChange={(e) =>
                          setLocation(
                            e.target.value
                          )
                        }
                        style={inputStyle}
                      />

                      <input
                        type="text"
                        placeholder="Soil Type"
                        value={soilType}
                        onChange={(e) =>
                          setSoilType(
                            e.target.value
                          )
                        }
                        style={inputStyle}
                      />
                    </div>
                  </div>
                )}

                {/* Expert proof */}

                {role === "expert" && (
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "7px",
                        color:
                          "var(--text-primary)",
                        fontSize: "12px",
                        fontWeight: 700,
                      }}
                    >
                      Proof of Expertise
                    </label>

                    <textarea
                      required
                      placeholder="Describe your agricultural experience, expertise, qualifications, or past success..."
                      value={
                        proofOfExpertise
                      }
                      onChange={(e) =>
                        setProofOfExpertise(
                          e.target.value
                        )
                      }
                      style={{
                        ...inputStyle,
                        minHeight: "90px",
                        resize: "vertical",
                        fontFamily:
                          "inherit",
                      }}
                    />
                  </div>
                )}
              </>
            )}

            {/* Email */}

            <Field
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

            {/* Password */}

            <Field
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />

            {/* Submit */}

            <button
              type="submit"
              style={{
                marginTop: "7px",
                padding: "14px",
                border: "none",
                borderRadius: "11px",
                background:
                  "linear-gradient(135deg, #4caf50, #2e7d32)",
                color: "white",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 800,
                boxShadow:
                  "0 9px 25px rgba(76,175,80,0.2)",
              }}
            >
              {isLogin
                ? "Sign In →"
                : "Create Account →"}
            </button>
          </form>

          {/* =================================================
              SWITCH LOGIN / REGISTER
          ================================================== */}

          <div
            style={{
              marginTop: "22px",
              paddingTop: "18px",
              borderTop:
                "1px solid var(--border-color)",
              textAlign: "center",
              color:
                "var(--text-secondary)",
              fontSize: "12px",
            }}
          >
            {isLogin
              ? "Don't have an account?"
              : "Already have an account?"}

            <button
              type="button"
              onClick={() =>
                setIsLogin(!isLogin)
              }
              style={{
                marginLeft: "5px",
                padding: 0,
                border: "none",
                background: "none",
                color:
                  "var(--accent-color)",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: "12px",
              }}
            >
              {isLogin
                ? "Create one"
                : "Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


/* =========================================================
   INPUT FIELD
========================================================= */

function Field({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
}) {
  return (
    <div>
      <label
        style={{
          display: "block",
          marginBottom: "7px",
          color: "var(--text-primary)",
          fontSize: "12px",
          fontWeight: 700,
        }}
      >
        {label}
      </label>

      <input
        required={required}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={inputStyle}
      />
    </div>
  );
}


/* =========================================================
   ROLE BUTTON
========================================================= */

function RoleButton({
  active,
  onClick,
  icon,
  label,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: "100%",
        padding: "10px 8px",
        borderRadius: "9px",
        border: active
          ? "1px solid var(--accent-color)"
          : "1px solid transparent",
        background: active
          ? "var(--accent-soft)"
          : "transparent",
        color: active
          ? "var(--accent-color)"
          : "var(--text-secondary)",
        cursor: "pointer",
        fontSize: "12px",
        fontWeight: active ? 700 : 500,
        transition: "all 0.2s ease",
      }}
    >
      {icon} {label}
    </button>
  );
}


/* =========================================================
   BENEFIT
========================================================= */

function Benefit({ icon, text }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "9px",
        padding: "10px",
        borderRadius: "9px",
        background:
          "rgba(255,255,255,0.06)",
        border:
          "1px solid rgba(255,255,255,0.07)",
        color:
          "rgba(255,255,255,0.75)",
        fontSize: "11px",
      }}
    >
      <span>{icon}</span>
      <span>{text}</span>
    </div>
  );
}


/* =========================================================
   SHARED INPUT STYLE
========================================================= */

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px 13px",
  borderRadius: "9px",
  border: "1px solid var(--border-color)",
  background: "var(--bg-secondary)",
  color: "var(--text-primary)",
  outline: "none",
  fontSize: "13px",
};