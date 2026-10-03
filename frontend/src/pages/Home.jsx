import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-primary)",
        color: "var(--text-primary)",
        overflowX: "hidden",
      }}
    >
      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px clamp(20px, 5vw, 70px)",
          background: "rgba(4, 16, 12, 0.82)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(18px)",
        }}
      >
        {/* Logo */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "11px",
          }}
        >
          <div
            style={{
              width: "42px",
              height: "42px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "12px",
              background:
                "linear-gradient(135deg, #4caf50, #1b5e20)",
              boxShadow:
                "0 8px 25px rgba(76,175,80,0.25)",
              fontSize: "22px",
            }}
          >
            🌱
          </div>

          <div>
            <div
              style={{
                color: "white",
                fontSize: "20px",
                fontWeight: 800,
                lineHeight: 1,
              }}
            >
              Agri<span style={{ color: "#81c784" }}>AI</span>
            </div>

            <div
              style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: "9px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginTop: "5px",
              }}
            >
              Smart Agriculture
            </div>
          </div>
        </div>

        {/* Navigation */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <button
            onClick={() => navigate("/login")}
            style={{
              padding: "10px 20px",
              background: "transparent",
              color: "#d1fae5",
              border: "1px solid rgba(129,199,132,0.45)",
              borderRadius: "9px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            Login
          </button>

          <button
            onClick={() => navigate("/login")}
            style={{
              padding: "11px 21px",
              background:
                "linear-gradient(135deg, #4caf50, #2e7d32)",
              color: "white",
              border: "none",
              borderRadius: "9px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 700,
              boxShadow:
                "0 7px 20px rgba(76,175,80,0.25)",
            }}
          >
            Get Started →
          </button>
        </div>
      </nav>

      {/* =====================================================
          HERO
      ====================================================== */}

      <section
        style={{
          position: "relative",
          minHeight: "calc(100vh - 75px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px 24px",
          textAlign: "center",
          overflow: "hidden",

          background:
            "linear-gradient(180deg, rgba(3,15,10,0.55), rgba(3,15,10,0.94)), url('https://images.unsplash.com/photo-1628183204780-4963e6ef6107?q=80&w=1920&auto=format&fit=crop')",

          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Decorative glow */}

        <div
          style={{
            position: "absolute",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background:
              "rgba(76,175,80,0.12)",
            filter: "blur(90px)",
            top: "-200px",
            left: "-180px",
          }}
        />

        <div
          style={{
            position: "absolute",
            width: "450px",
            height: "450px",
            borderRadius: "50%",
            background:
              "rgba(129,199,132,0.08)",
            filter: "blur(100px)",
            bottom: "-200px",
            right: "-150px",
          }}
        />

        {/* Hero content */}

        <div
          style={{
            position: "relative",
            zIndex: 2,
            maxWidth: "1000px",
          }}
        >
          {/* Badge */}

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "9px 17px",
              marginBottom: "28px",
              borderRadius: "50px",
              background: "rgba(76,175,80,0.12)",
              border:
                "1px solid rgba(129,199,132,0.3)",
              color: "#a5d6a7",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.04em",
              backdropFilter: "blur(10px)",
            }}
          >
            <span>✦</span>
            AI-POWERED AGRICULTURE PLATFORM
          </div>

          {/* Heading */}

          <h1
            style={{
              margin: 0,
              fontSize:
                "clamp(3rem, 7vw, 6.2rem)",
              lineHeight: 1.02,
              fontWeight: 800,
              letterSpacing: "-0.055em",
              color: "white",
              textShadow:
                "0 8px 35px rgba(0,0,0,0.5)",
            }}
          >
            Smarter Farming.
            <br />

            <span
              style={{
                background:
                  "linear-gradient(90deg, #81c784, #c8e6c9)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Better Harvests.
            </span>
          </h1>

          {/* Description */}

          <p
            style={{
              maxWidth: "700px",
              margin: "28px auto 0",
              color: "#d1d5db",
              fontSize:
                "clamp(1rem, 2vw, 1.18rem)",
              lineHeight: 1.75,
            }}
          >
            AgriAI helps farmers make smarter decisions with
            intelligent crop recommendations, soil analysis,
            disease detection, agricultural guidance, and
            expert support.
          </p>

          {/* CTA */}

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "14px",
              flexWrap: "wrap",
              marginTop: "38px",
            }}
          >
            <button
              onClick={() => navigate("/login")}
              style={{
                padding: "15px 30px",
                borderRadius: "11px",
                border: "none",
                background:
                  "linear-gradient(135deg, #4caf50, #2e7d32)",
                color: "white",
                fontSize: "15px",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow:
                  "0 12px 30px rgba(76,175,80,0.28)",
              }}
            >
              Start Farming Smarter →
            </button>

            <button
              onClick={() =>
                window.scrollTo({
                  top: document.body.scrollHeight,
                  behavior: "smooth",
                })
              }
              style={{
                padding: "15px 28px",
                borderRadius: "11px",
                border:
                  "1px solid rgba(255,255,255,0.2)",
                background:
                  "rgba(255,255,255,0.07)",
                color: "white",
                fontSize: "15px",
                fontWeight: 600,
                cursor: "pointer",
                backdropFilter: "blur(10px)",
              }}
            >
              Explore AgriAI ↓
            </button>
          </div>

          {/* Trust text */}

          <div
            style={{
              marginTop: "34px",
              color: "rgba(255,255,255,0.48)",
              fontSize: "12px",
            }}
          >
            🌱 Technology • 🌾 Agriculture • 🤖 Intelligence
          </div>
        </div>
      </section>

      {/* =====================================================
          INTRO
      ====================================================== */}

      <section
        style={{
          padding:
            "90px clamp(20px, 5vw, 70px)",
          background: "var(--bg-primary)",
        }}
      >
        <div
          style={{
            maxWidth: "1150px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              maxWidth: "700px",
              margin: "0 auto 50px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                color: "var(--accent-color)",
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                marginBottom: "10px",
              }}
            >
              One Platform
            </div>

            <h2
              style={{
                margin: 0,
                fontSize:
                  "clamp(2rem, 4vw, 3rem)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
              }}
            >
              Everything you need to
              <span
                style={{
                  color: "var(--accent-color)",
                }}
              >
                {" "}
                farm smarter
              </span>
            </h2>

            <p
              style={{
                marginTop: "16px",
                color: "var(--text-secondary)",
                lineHeight: 1.7,
              }}
            >
              From understanding your soil to choosing the
              right crop, AgriAI brings essential agricultural
              intelligence together in one platform.
            </p>
          </div>

          {/* Feature cards */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "20px",
            }}
          >
            {/* Crop */}

            <FeatureCard
              icon="🌱"
              title="Crop Recommendation"
              description="Get crop recommendations based on soil nutrients, pH, temperature, humidity, and rainfall conditions."
            />

            {/* Soil */}

            <FeatureCard
              icon="🪨"
              title="Soil Analysis"
              description="Analyze soil information and understand conditions that can influence crop selection and farming decisions."
            />

            {/* Disease */}

            <FeatureCard
              icon="🔬"
              title="Disease Detection"
              description="Identify plant diseases from crop images and receive useful treatment and prevention guidance."
            />

            {/* AI */}

            <FeatureCard
              icon="🤖"
              title="AI Farming Assistant"
              description="Ask agricultural questions and receive personalized guidance through the intelligent farming assistant."
            />

            {/* Experts */}

            <FeatureCard
              icon="🧑‍🌾"
              title="Expert Consultation"
              description="Connect with agricultural experts when you need additional guidance for specialized farming problems."
            />

            {/* Weather */}

            <FeatureCard
              icon="☁️"
              title="Agricultural Insights"
              description="Use relevant agricultural information to make more informed decisions throughout the farming cycle."
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          HOW IT WORKS
      ====================================================== */}

      <section
        style={{
          padding:
            "90px clamp(20px, 5vw, 70px)",
          background: "var(--bg-secondary)",
          borderTop:
            "1px solid var(--border-color)",
          borderBottom:
            "1px solid var(--border-color)",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              textAlign: "center",
              marginBottom: "55px",
            }}
          >
            <div
              style={{
                color: "var(--accent-color)",
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
              }}
            >
              Simple Process
            </div>

            <h2
              style={{
                margin:
                  "10px 0 12px",
                fontSize:
                  "clamp(2rem, 4vw, 2.8rem)",
                fontWeight: 800,
              }}
            >
              From field to insight
            </h2>

            <p
              style={{
                color: "var(--text-secondary)",
                margin: 0,
              }}
            >
              Make better agricultural decisions in a few simple
              steps.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "25px",
            }}
          >
            <StepCard
              number="01"
              icon="📋"
              title="Enter Your Data"
              description="Provide your soil and farming information."
            />

            <StepCard
              number="02"
              icon="🧠"
              title="AI Analysis"
              description="AgriAI analyzes the available agricultural information."
            />

            <StepCard
              number="03"
              icon="🌾"
              title="Get Guidance"
              description="Receive useful recommendations for your farming decisions."
            />

            <StepCard
              number="04"
              icon="📈"
              title="Farm Smarter"
              description="Use the insights to make informed agricultural decisions."
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          FINAL CTA
      ====================================================== */}

      <section
        style={{
          padding:
            "100px 20px",
          textAlign: "center",
          background:
            "linear-gradient(135deg, #082015, #123b23)",
        }}
      >
        <div
          style={{
            maxWidth: "750px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              fontSize: "42px",
              marginBottom: "18px",
            }}
          >
            🌱
          </div>

          <h2
            style={{
              margin: 0,
              color: "white",
              fontSize:
                "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
            }}
          >
            Grow with intelligence.
          </h2>

          <p
            style={{
              margin:
                "18px auto 30px",
              maxWidth: "600px",
              color: "#b9cdbd",
              lineHeight: 1.7,
            }}
          >
            Start using AgriAI to bring intelligent agricultural
            guidance closer to your field.
          </p>

          <button
            onClick={() => navigate("/login")}
            style={{
              padding: "15px 32px",
              border: "none",
              borderRadius: "11px",
              background: "#66bb6a",
              color: "#06210f",
              fontSize: "15px",
              fontWeight: 800,
              cursor: "pointer",
              boxShadow:
                "0 10px 30px rgba(102,187,106,0.2)",
            }}
          >
            Get Started with AgriAI →
          </button>
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer
        style={{
          padding: "28px 20px",
          background: "#04100c",
          borderTop:
            "1px solid rgba(255,255,255,0.06)",
          textAlign: "center",
          color: "rgba(255,255,255,0.5)",
          fontSize: "13px",
        }}
      >
        <p style={{ margin: 0 }}>
          © 2026 AgriAI Platform · Promoting Smarter &
          Sustainable Agriculture
        </p>
      </footer>
    </div>
  );
}


/* =========================================================
   FEATURE CARD
========================================================= */

function FeatureCard({
  icon,
  title,
  description,
}) {
  return (
    <div
      style={{
        padding: "26px",
        borderRadius: "18px",
        background: "var(--bg-surface)",
        border:
          "1px solid var(--border-color)",
        transition:
          "transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform =
          "translateY(-5px)";
        e.currentTarget.style.borderColor =
          "var(--accent-color)";
        e.currentTarget.style.boxShadow =
          "0 18px 35px rgba(0,0,0,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform =
          "translateY(0)";
        e.currentTarget.style.borderColor =
          "var(--border-color)";
        e.currentTarget.style.boxShadow =
          "none";
      }}
    >
      <div
        style={{
          width: "52px",
          height: "52px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "14px",
          background: "var(--accent-soft)",
          fontSize: "25px",
          marginBottom: "20px",
        }}
      >
        {icon}
      </div>

      <h3
        style={{
          margin: "0 0 10px",
          color: "var(--text-primary)",
          fontSize: "18px",
          fontWeight: 750,
        }}
      >
        {title}
      </h3>

      <p
        style={{
          margin: 0,
          color: "var(--text-secondary)",
          fontSize: "14px",
          lineHeight: 1.65,
        }}
      >
        {description}
      </p>
    </div>
  );
}


/* =========================================================
   STEP CARD
========================================================= */

function StepCard({
  number,
  icon,
  title,
  description,
}) {
  return (
    <div
      style={{
        position: "relative",
        padding: "26px",
        background: "var(--bg-surface)",
        border:
          "1px solid var(--border-color)",
        borderRadius: "17px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <span
          style={{
            color: "var(--accent-color)",
            fontSize: "11px",
            fontWeight: 800,
            letterSpacing: "0.1em",
          }}
        >
          STEP {number}
        </span>

        <span
          style={{
            fontSize: "25px",
          }}
        >
          {icon}
        </span>
      </div>

      <h3
        style={{
          margin: "0 0 9px",
          color: "var(--text-primary)",
          fontSize: "17px",
          fontWeight: 700,
        }}
      >
        {title}
      </h3>

      <p
        style={{
          margin: 0,
          color: "var(--text-secondary)",
          fontSize: "13px",
          lineHeight: 1.6,
        }}
      >
        {description}
      </p>
    </div>
  );
}