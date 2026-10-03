import {
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";

import { useState, useEffect } from "react";

import {
  LayoutDashboard,
  Bot,
  Sprout,
  ScanSearch,
  Store,
  Users,
  UserCheck,
  User,
  Settings,
  LogOut,
  Sparkles,
  ShieldCheck,
  Sun,
  Moon,
  ChevronRight,
} from "lucide-react";

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const [showSettings, setShowSettings] =
    useState(false);

  const [isLgFont, setIsLgFont] =
    useState(false);

  const [isDarkMode, setIsDarkMode] =
    useState(true);

  /* =====================================================
     LARGE FONT
  ===================================================== */

  useEffect(() => {
    if (isLgFont) {
      document.body.classList.add("lg-font");
    } else {
      document.body.classList.remove("lg-font");
    }
  }, [isLgFont]);

  /* =====================================================
     DARK / LIGHT MODE
  ===================================================== */

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.remove(
        "light-mode"
      );

      document.body.classList.add(
        "dark-mode"
      );
    } else {
      document.body.classList.remove(
        "dark-mode"
      );

      document.body.classList.add(
        "light-mode"
      );
    }
  }, [isDarkMode]);

  /* =====================================================
     GOOGLE TRANSLATE
  ===================================================== */

  useEffect(() => {
    const scriptId =
      "google-translate-script";

    if (
      !document.getElementById(scriptId)
    ) {
      const script =
        document.createElement("script");

      script.id = scriptId;

      script.setAttribute(
        "src",
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
      );

      document.body.appendChild(script);

      window.googleTranslateElementInit =
        () => {
          if (
            window.google &&
            window.google.translate
          ) {
            new window.google.translate.TranslateElement(
              {
                pageLanguage: "en",
                includedLanguages:
                  "hi,te,en",
                layout:
                  window.google.translate
                    .TranslateElement
                    .InlineLayout.SIMPLE,
              },
              "google_translate_element"
            );
          }
        };
    }
  }, []);

  /* =====================================================
     LOGOUT
  ===================================================== */

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    navigate("/");
  };

  if (!user) return null;

  const isActive = (path) =>
    location.pathname === path;

  /* =====================================================
     NAVIGATION ITEM
  ===================================================== */

  const NavItem = ({
    to,
    icon,
    label,
    exact = true,
  }) => {
    const active = exact
      ? isActive(to)
      : location.pathname.startsWith(to);

    return (
      <Link
        to={to}
        className={`agri-nav-item ${
          active ? "agri-nav-active" : ""
        }`}
      >
        <span className="agri-nav-icon">
          {icon}
        </span>

        <span className="agri-nav-label">
          {label}
        </span>

        {active && (
          <ChevronRight
            size={15}
            className="agri-nav-arrow"
          />
        )}
      </Link>
    );
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <>
      <aside className="agri-sidebar">
        {/* =================================================
            BRAND
        ================================================== */}

        <div className="agri-sidebar-top">
          <Link
            to="/dashboard"
            className="agri-brand"
          >
            <div className="agri-brand-icon">
              🌱
            </div>

            <div>
              <div className="agri-brand-name">
                Agri
                <span>AI</span>
              </div>

              <div className="agri-brand-subtitle">
                SMART AGRICULTURE
              </div>
            </div>
          </Link>

          {/* =================================================
              NAVIGATION
          ================================================== */}

          <div className="agri-navigation">
            {/* ADMIN */}

            {user.role === "admin" && (
              <>
                <div className="agri-section-title">
                  ADMINISTRATION
                </div>

                <NavItem
                  to="/admin"
                  icon={
                    <ShieldCheck size={19} />
                  }
                  label="Verification Center"
                />
              </>
            )}

            {/* FARMER */}

            {(user.role === "farmer" ||
              user.role ===
                "farmer_expert") && (
              <>
                <div className="agri-section-title">
                  FARMER
                </div>

                <NavItem
                  to="/dashboard"
                  icon={
                    <LayoutDashboard
                      size={19}
                    />
                  }
                  label="Dashboard"
                />

                <NavItem
                  to="/ai-assistant"
                  icon={<Bot size={19} />}
                  label="Smart Advisor"
                />

                <NavItem
                  to="/crop-recommend"
                  icon={
                    <Sprout size={19} />
                  }
                  label="Crop Predictor"
                />

                <NavItem
                  to="/disease-detection"
                  icon={
                    <ScanSearch size={19} />
                  }
                  label="Disease Scan"
                />

                <NavItem
                  to="/market"
                  icon={<Store size={19} />}
                  label="Marketplace"
                />

                <NavItem
                  to="/community"
                  icon={<Users size={19} />}
                  label="Community Forum"
                />

                <NavItem
                  to="/experts"
                  icon={
                    <UserCheck size={19} />
                  }
                  label="Expert Connect"
                />

                <NavItem
                  to="/profile"
                  icon={<User size={19} />}
                  label="Farmer Profile"
                />

                {user.role === "farmer" &&
                  user.originalRole !==
                    "farmer_expert" && (
                    <NavItem
                      to="/apply-expert"
                      icon={
                        <Sparkles size={19} />
                      }
                      label="Become Expert"
                    />
                  )}
              </>
            )}

            {/* EXPERT */}

            {(user.role === "expert" ||
              user.role ===
                "farmer_expert") && (
              <>
                <div className="agri-section-title agri-expert-title">
                  EXPERT PORTAL
                </div>

                <NavItem
                  to="/expert-dashboard"
                  icon={
                    <LayoutDashboard
                      size={19}
                    />
                  }
                  label="Expert Portal"
                />

                <NavItem
                  to="/expert-profile"
                  icon={<User size={19} />}
                  label="Expert Profile"
                />

                {user.role === "expert" && (
                  <NavItem
                    to="/community"
                    icon={
                      <Users size={19} />
                    }
                    label="Community Forum"
                  />
                )}
              </>
            )}
          </div>
        </div>

        {/* =================================================
            SIDEBAR FOOTER
        ================================================== */}

        <div className="agri-sidebar-footer">
          {/* Theme / Settings */}

          <div className="agri-quick-actions">
            <button
              onClick={() =>
                setIsDarkMode(
                  !isDarkMode
                )
              }
              className="agri-icon-button"
              title={
                isDarkMode
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
            >
              {isDarkMode ? (
                <Sun size={18} />
              ) : (
                <Moon size={18} />
              )}
            </button>

            <button
              onClick={() =>
                setShowSettings(
                  !showSettings
                )
              }
              className={`agri-icon-button ${
                showSettings
                  ? "agri-icon-active"
                  : ""
              }`}
              title="Accessibility settings"
            >
              <Settings size={18} />
            </button>
          </div>

          {/* =================================================
              SETTINGS PANEL
          ================================================== */}

          {showSettings && (
            <div className="agri-settings-panel">
              <div className="agri-settings-heading">
                <Settings size={15} />
                Accessibility
              </div>

              <label className="agri-setting-row">
                <input
                  type="checkbox"
                  checked={isLgFont}
                  onChange={(e) =>
                    setIsLgFont(
                      e.target.checked
                    )
                  }
                />

                <span>
                  Large Font
                </span>
              </label>

              <div className="agri-settings-divider" />

              <div className="agri-settings-heading">
                🌐 Translation
              </div>

              <div
                id="google_translate_element"
                className="agri-translate"
              />
            </div>
          )}

          {/* =================================================
              USER CARD
          ================================================== */}

          <div className="agri-user-card">
            <div className="agri-avatar">
              {user.name
                ? user.name[0].toUpperCase()
                : "U"}
            </div>

            <div className="agri-user-info">
              <div className="agri-user-name">
                {user.name || "User"}
              </div>

              <div className="agri-user-role">
                {user.role.replace(
                  "_",
                  " "
                )}
              </div>
            </div>
          </div>

          {/* =================================================
              LOGOUT
          ================================================== */}

          <button
            onClick={handleLogout}
            className="agri-logout"
          >
            <LogOut size={17} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* =====================================================
          NAVBAR STYLES
      ===================================================== */}

      <style>{`
        .agri-sidebar {
          width: 260px;
          height: 100vh;
          position: fixed;
          left: 0;
          top: 0;
          z-index: 1000;

          display: flex;
          flex-direction: column;
          justify-content: space-between;

          box-sizing: border-box;
          padding: 20px 14px;

          background:
            linear-gradient(
              180deg,
              var(--bg-surface),
              var(--bg-secondary)
            );

          border-right:
            1px solid var(--border-color);

          box-shadow:
            10px 0 35px rgba(0,0,0,0.08);

          overflow-y: auto;
        }

        .agri-sidebar-top {
          min-height: 0;
        }

        .agri-brand {
          display: flex;
          align-items: center;
          gap: 11px;

          padding: 8px 10px 22px;

          text-decoration: none;
          color: var(--text-primary);
        }

        .agri-brand-icon {
          width: 43px;
          height: 43px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 13px;

          background:
            linear-gradient(
              135deg,
              #66bb6a,
              #2e7d32
            );

          font-size: 22px;

          box-shadow:
            0 8px 20px
            rgba(76,175,80,0.22);
        }

        .agri-brand-name {
          font-size: 20px;
          line-height: 1;
          font-weight: 850;
          letter-spacing: -0.04em;
        }

        .agri-brand-name span {
          color: var(--accent);
        }

        .agri-brand-subtitle {
          margin-top: 5px;

          color: var(--text-muted);

          font-size: 8px;
          font-weight: 700;

          letter-spacing: 0.14em;
        }

        .agri-navigation {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .agri-section-title {
          margin: 17px 10px 7px;

          color: var(--text-muted);

          font-size: 9px;
          font-weight: 800;

          letter-spacing: 0.12em;
        }

        .agri-expert-title {
          margin-top: 23px;
        }

        .agri-nav-item {
          min-height: 43px;

          display: flex;
          align-items: center;
          gap: 11px;

          position: relative;

          padding: 0 11px;

          border-radius: 11px;

          text-decoration: none;

          color: var(--text-secondary);

          font-size: 12px;
          font-weight: 600;

          transition:
            background 0.2s ease,
            color 0.2s ease,
            transform 0.2s ease;
        }

        .agri-nav-item:hover {
          background: var(--accent-soft);
          color: var(--accent);

          transform: translateX(2px);
        }

        .agri-nav-active {
          background:
            linear-gradient(
              90deg,
              var(--accent-soft),
              transparent
            );

          color: var(--accent) !important;

          font-weight: 750;
        }

        .agri-nav-active::before {
          content: "";

          position: absolute;
          left: 0;
          top: 9px;
          bottom: 9px;

          width: 3px;

          border-radius: 0 4px 4px 0;

          background: var(--accent);
        }

        .agri-nav-icon {
          width: 22px;
          height: 22px;

          display: flex;
          align-items: center;
          justify-content: center;

          flex-shrink: 0;
        }

        .agri-nav-label {
          flex: 1;
        }

        .agri-nav-arrow {
          opacity: 0.7;
        }

        .agri-sidebar-footer {
          display: flex;
          flex-direction: column;
          gap: 10px;

          margin-top: 15px;
        }

        .agri-quick-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .agri-icon-button {
          height: 37px;

          display: flex;
          align-items: center;
          justify-content: center;

          border: 1px solid var(--border-color);
          border-radius: 9px;

          background: var(--bg-surface);
          color: var(--text-secondary);

          cursor: pointer;

          transition: all 0.2s ease;
        }

        .agri-icon-button:hover,
        .agri-icon-active {
          background: var(--accent-soft);
          border-color: var(--accent);
          color: var(--accent);
        }

        .agri-settings-panel {
          padding: 14px;

          border:
            1px solid var(--border-color);

          border-radius: 13px;

          background:
            var(--bg-surface);

          box-shadow:
            0 12px 30px
            rgba(0,0,0,0.12);
        }

        .agri-settings-heading {
          display: flex;
          align-items: center;
          gap: 7px;

          margin-bottom: 11px;

          color: var(--accent);

          font-size: 11px;
          font-weight: 750;
        }

        .agri-setting-row {
          display: flex;
          align-items: center;
          gap: 9px;

          color: var(--text-secondary);

          font-size: 11px;

          cursor: pointer;
        }

        .agri-setting-row input {
          accent-color: var(--accent);
        }

        .agri-settings-divider {
          height: 1px;

          margin: 13px 0;

          background: var(--border-color);
        }

        .agri-translate {
          font-size: 10px;
          overflow: hidden;
        }

        .agri-user-card {
          display: flex;
          align-items: center;
          gap: 10px;

          padding: 10px;

          border:
            1px solid var(--border-color);

          border-radius: 12px;

          background:
            var(--bg-surface);
        }

        .agri-avatar {
          width: 37px;
          height: 37px;

          flex-shrink: 0;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 50%;

          background:
            var(--accent-soft);

          color: var(--accent);

          font-size: 14px;
          font-weight: 800;
        }

        .agri-user-info {
          min-width: 0;
          flex: 1;
        }

        .agri-user-name {
          overflow: hidden;

          color: var(--text-primary);

          font-size: 11px;
          font-weight: 750;

          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .agri-user-role {
          margin-top: 3px;

          overflow: hidden;

          color: var(--text-muted);

          font-size: 9px;

          text-transform: capitalize;

          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .agri-logout {
          width: 100%;
          height: 38px;

          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;

          border: 1px solid rgba(239,68,68,0.18);
          border-radius: 9px;

          background: rgba(239,68,68,0.07);

          color: #ef4444;

          font-size: 11px;
          font-weight: 700;

          cursor: pointer;

          transition: all 0.2s ease;
        }

        .agri-logout:hover {
          background: rgba(239,68,68,0.13);
          border-color: rgba(239,68,68,0.3);
        }

        @media (max-width: 900px) {
          .agri-sidebar {
            width: 220px;
          }
        }

        @media (max-width: 700px) {
          .agri-sidebar {
            width: 72px;
            padding: 15px 9px;
          }

          .agri-brand {
            justify-content: center;
            padding: 5px 0 18px;
          }

          .agri-brand > div:last-child,
          .agri-section-title,
          .agri-nav-label,
          .agri-nav-arrow,
          .agri-user-info,
          .agri-logout span {
            display: none;
          }

          .agri-nav-item {
            justify-content: center;
            padding: 0;
          }

          .agri-nav-icon {
            width: 100%;
          }

          .agri-nav-active::before {
            left: -9px;
          }

          .agri-user-card {
            justify-content: center;
            padding: 8px;
          }

          .agri-logout {
            padding: 0;
          }

          .agri-sidebar-footer {
            gap: 8px;
          }
        }
      `}</style>
    </>
  );
}