import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiSettings, FiLogOut, FiKey } from "react-icons/fi";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const [showLogin, setShowLogin] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });
  const [passwordForm, setPasswordForm] = useState({ 
    currentPassword: "", 
    newPassword: "", 
    confirmPassword: "" 
  });
  const [loginMessage, setLoginMessage] = useState("");
  const [loginMessageType, setLoginMessageType] = useState(""); // "success" hoặc "error"

  const tabs = [
    { id: "/", label: "Home" },
    { id: "/windows", label: "Windows" },
    { id: "/office", label: "Office" },
    { id: "/tools", label: "Tools" },
    { id: "/free-antivirus", label: "Free Antivirus / An toàn thông tin" },
  ];

  // ✅ Kiểm tra token khi load lại trang
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAdmin(!!token);
  }, []);

  // 🔐 Đăng nhập admin
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginMessage(""); // Reset message
    
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        setIsAdmin(true);
        setLoginMessage("✅ Đăng nhập thành công!");
        setLoginMessageType("success");
        
        // Đóng modal sau 1.5 giây
        setTimeout(() => {
          setShowLogin(false);
          setLoginMessage("");
          setLoginMessageType("");
          navigate("/windows");
        }, 1500);
      } else {
        setLoginMessage("❌ Sai tài khoản hoặc mật khẩu!");
        setLoginMessageType("error");
      }
    } catch (err) {
      setLoginMessage("⚠️ Lỗi kết nối máy chủ!");
      setLoginMessageType("error");
    }
  };

  // 🚪 Đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAdmin(false);
    alert("👋 Đã đăng xuất!");
    navigate("/");
  };

  // 🔑 Đổi mật khẩu
  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("❌ Mật khẩu mới và xác nhận mật khẩu không khớp!");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      alert("❌ Mật khẩu mới phải có ít nhất 6 ký tự!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Đổi mật khẩu thành công!");
        setShowChangePassword(false);
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        alert(`❌ ${data.message || "Đổi mật khẩu thất bại!"}`);
      }
    } catch (err) {
      alert("⚠️ Lỗi kết nối máy chủ!");
    }
  };

  return (
    <>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "#ffe08a",
          borderBottom: "1px solid #f2c94c",
          padding: "20px 0",
        }}
      >
        {/* ⚙️ Nút Admin / Logout */}
        <div
          style={{
            position: "fixed",
            top: 16,
            right: 20,
            display: "flex",
            alignItems: "center",
            gap: 10,
            zIndex: 1000,
          }}
        >
          {/* Nếu đã login thì hiện nút logout và đổi mật khẩu */}
          {isAdmin ? (
            <>
              <button
                onClick={() => setShowChangePassword(true)}
                title="Đổi mật khẩu"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 24,
                  color: "#b84e00",
                  transition: "transform 0.2s ease, color 0.2s ease",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#8c3500")}
                onMouseLeave={(e) => (e.target.style.color = "#b84e00")}
              >
                <FiKey />
              </button>
              <button
                onClick={handleLogout}
                title="Đăng xuất quản trị"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 24,
                  color: "#b84e00",
                  transition: "transform 0.2s ease, color 0.2s ease",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#8c3500")}
                onMouseLeave={(e) => (e.target.style.color = "#b84e00")}
              >
                <FiLogOut />
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              title="Trang quản trị"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 26,
                color: "#b84e00",
                transition: "transform 0.2s ease, color 0.2s ease",
              }}
              onMouseEnter={(e) => (e.target.style.color = "#8c3500")}
              onMouseLeave={(e) => (e.target.style.color = "#b84e00")}
            >
              <FiSettings />
            </button>
          )}
        </div>

        {/* --- Header giữa trang giữ nguyên --- */}
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 900,
                color: "#b84e00",
                letterSpacing: 0.6,
              }}
            >
              SAFE DOWNLOAD PORTAL
            </div>
            <div
              style={{
                fontSize: 13,
                color: "#6b7280",
                marginTop: 3,
              }}
            >
              Chọn danh mục tải phần mềm an toàn
            </div>
          </div>

          <nav
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 18,
              marginTop: 15,
              flexWrap: "wrap",
            }}
          >
            {tabs.map((t) => (
              <Link
                key={t.id}
                to={t.id}
                style={{
                  padding: "8px 20px",
                  borderRadius: 999,
                  border:
                    location.pathname === t.id
                      ? "2px solid #b84e00"
                      : "1px solid #e5e7eb",
                  background:
                    location.pathname === t.id ? "#fff8e1" : "#fffaf0",
                  color: "#222",
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: 15,
                  boxShadow:
                    location.pathname === t.id
                      ? "inset 0 0 4px rgba(0,0,0,0.2)"
                      : "none",
                  transition: "all 0.25s ease",
                }}
              >
                {t.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* 🪟 Popup đăng nhập */}
      {showLogin && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2000,
          }}
        >
          <form
            onSubmit={handleLogin}
            style={{
              background: "#fff",
              padding: 24,
              borderRadius: 12,
              minWidth: 300,
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}
          >
            <h3 style={{ textAlign: "center", marginBottom: 10 }}>
              🔐 Admin Login
            </h3>
            
            {/* Thông báo đăng nhập */}
            {loginMessage && (
              <div
                style={{
                  padding: "8px 12px",
                  marginBottom: 12,
                  borderRadius: 6,
                  fontSize: 14,
                  textAlign: "center",
                  background: loginMessageType === "success" ? "#d4edda" : "#f8d7da",
                  color: loginMessageType === "success" ? "#155724" : "#721c24",
                  border: `1px solid ${loginMessageType === "success" ? "#c3e6cb" : "#f5c6cb"}`,
                }}
              >
                {loginMessage}
              </div>
            )}
            
            <input
              type="text"
              placeholder="Username"
              required
              style={{
                width: "100%",
                marginBottom: 10,
                padding: 8,
                border: "1px solid #ccc",
                borderRadius: 6,
              }}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              required
              style={{
                width: "100%",
                marginBottom: 12,
                padding: 8,
                border: "1px solid #ccc",
                borderRadius: 6,
              }}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button
              type="submit"
              style={{
                width: "100%",
                padding: 8,
                background: "#b84e00",
                color: "#fff",
                border: "none",
                borderRadius: 6,
              }}
            >
              Đăng nhập
            </button>
            <button
              type="button"
              onClick={() => {
                setShowLogin(false);
                setLoginMessage("");
                setLoginMessageType("");
              }}
              style={{
                width: "100%",
                padding: 8,
                marginTop: 8,
                border: "1px solid #ccc",
                borderRadius: 6,
                background: "#fafafa",
              }}
            >
              Hủy
            </button>
          </form>
        </div>
      )}

      {/* 🔑 Popup đổi mật khẩu */}
      {showChangePassword && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2000,
          }}
        >
          <form
            onSubmit={handleChangePassword}
            style={{
              background: "#fff",
              padding: 24,
              borderRadius: 12,
              minWidth: 320,
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}
          >
            <h3 style={{ textAlign: "center", marginBottom: 15 }}>
              🔑 Đổi mật khẩu
            </h3>
            <input
              type="password"
              placeholder="Mật khẩu hiện tại"
              required
              style={{
                width: "100%",
                marginBottom: 10,
                padding: 8,
                border: "1px solid #ccc",
                borderRadius: 6,
              }}
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
            />
            <input
              type="password"
              placeholder="Mật khẩu mới"
              required
              style={{
                width: "100%",
                marginBottom: 10,
                padding: 8,
                border: "1px solid #ccc",
                borderRadius: 6,
              }}
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
            />
            <input
              type="password"
              placeholder="Xác nhận mật khẩu mới"
              required
              style={{
                width: "100%",
                marginBottom: 12,
                padding: 8,
                border: "1px solid #ccc",
                borderRadius: 6,
              }}
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
            />
            <button
              type="submit"
              style={{
                width: "100%",
                padding: 8,
                background: "#b84e00",
                color: "#fff",
                border: "none",
                borderRadius: 6,
              }}
            >
              Đổi mật khẩu
            </button>
            <button
              type="button"
              onClick={() => {
                setShowChangePassword(false);
                setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
              }}
              style={{
                width: "100%",
                padding: 8,
                marginTop: 8,
                border: "1px solid #ccc",
                borderRadius: 6,
                background: "#fafafa",
              }}
            >
              Hủy
            </button>
          </form>
        </div>
      )}
    </>
  );
}
