import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import NavBar from "./components/NavBar";
import Login from "./pages/Login";
import Home from "./pages/Home";
import CropRecommendation from "./pages/CropRecommendation";
import Chatbot from "./pages/Chatbot";
import Community from "./pages/Community";
import ExpertList from "./pages/ExpertList";
import ExpertDashboard from "./pages/ExpertDashboard";
import LiveChat from "./pages/LiveChat";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import ApplyExpert from "./pages/ApplyExpert";
import ExpertProfile from "./pages/ExpertProfile";
import Market from "./pages/Market";
import Dashboard from "./pages/Dashboard";
import PestDetection from "./pages/PestDetection";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = () => {
      const u = JSON.parse(localStorage.getItem("user"));
      setUser(u);
    };
    checkUser();
    
    // Watch storage changes
    window.addEventListener("storage", checkUser);
    const interval = setInterval(checkUser, 1000);
    return () => {
      window.removeEventListener("storage", checkUser);
      clearInterval(interval);
    };
  }, []);

  return (
    <Router>
      <div className="sidebar-layout">
        {user && <NavBar />}
        <main className="main-content" style={{ 
          marginLeft: user ? "var(--sidebar-width)" : "0", 
          width: user ? "calc(100% - var(--sidebar-width))" : "100%", 
          transition: "margin-left 0.3s ease, width 0.3s ease",
          padding: user ? "40px" : "0"
        }}>
          <Routes>
            <Route path="/" element={user ? <Navigate to={user.role === "admin" ? "/admin" : (user.role === "expert" ? "/expert-dashboard" : "/dashboard")} /> : <Home />} />
            <Route path="/login" element={user ? <Navigate to={user.role === "admin" ? "/admin" : (user.role === "expert" ? "/expert-dashboard" : "/dashboard")} /> : <Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/ai-assistant" element={<Chatbot />} />
            <Route path="/crop-recommend" element={<CropRecommendation />} />
            <Route path="/disease-detection" element={<PestDetection />} />
            <Route path="/community" element={<Community />} />
            <Route path="/experts" element={<ExpertList />} />
            <Route path="/expert-dashboard" element={<ExpertDashboard />} />
            <Route path="/chat" element={<LiveChat />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/apply-expert" element={<ApplyExpert />} />
            <Route path="/expert-profile" element={<ExpertProfile />} />
            <Route path="/market" element={<Market />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
