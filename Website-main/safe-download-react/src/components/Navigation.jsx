import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navigation() {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "🏠 Home", icon: "🏠" },
    { path: "/windows", label: "🪟 Windows", icon: "🪟" },
    { path: "/office", label: "📄 Office", icon: "📄" },
    { path: "/tools", label: "🛠️ Tools", icon: "🛠️" },
    { path: "/free-antivirus", label: "🛡️ Antivirus", icon: "🛡️" },
    { path: "/virustotal-scan", label: "🔍 Quét Link", icon: "🔍" },
    { path: "/report", label: "📝 Báo cáo", icon: "📝" },
    { path: "/feedback-status", label: "📊 Phản hồi", icon: "📊" }
  ];

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav style={{
      background: "linear-gradient(135deg, #ffe08a 0%, #facc15 100%)",
      padding: "10px 0",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      borderBottom: "3px solid #d69e2e"
    }}>
      <div style={{
        maxWidth: 1200,
        margin: "0 auto",
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: "5px"
      }}>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              display: "inline-block",
              padding: "8px 16px",
              textDecoration: "none",
              color: isActive(item.path) ? "#8c3500" : "#b84e00",
              fontWeight: isActive(item.path) ? "bold" : "normal",
              background: isActive(item.path) ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.1)",
              borderRadius: "20px",
              border: isActive(item.path) ? "2px solid #8c3500" : "2px solid transparent",
              transition: "all 0.2s ease",
              fontSize: "14px",
              whiteSpace: "nowrap"
            }}
            onMouseEnter={(e) => {
              if (!isActive(item.path)) {
                e.target.style.background = "rgba(255,255,255,0.2)";
                e.target.style.transform = "translateY(-1px)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive(item.path)) {
                e.target.style.background = "rgba(255,255,255,0.1)";
                e.target.style.transform = "translateY(0)";
              }
            }}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
