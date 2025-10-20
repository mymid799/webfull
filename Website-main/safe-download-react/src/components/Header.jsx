import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiSettings, FiLogOut, FiKey, FiUser, FiEdit3 } from "react-icons/fi";

export default function Header() {
  const navigate = useNavigate();

  const [showLogin, setShowLogin] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showAdminInfo, setShowAdminInfo] = useState(false);
  const [showEditAdminInfo, setShowEditAdminInfo] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });
  const [passwordForm, setPasswordForm] = useState({ 
    currentPassword: "", 
    newPassword: "", 
    confirmPassword: "" 
  });
  const [adminInfo, setAdminInfo] = useState({
    adminName: "",
    adminEmail: "",
    adminPhone: "",
    adminTelegram: "",
    adminFacebook: "",
    adminZalo: "",
    adminTitle: "",
    adminDescription: "",
    workingHours: ""
  });
  const [loginMessage, setLoginMessage] = useState("");
  const [loginMessageType, setLoginMessageType] = useState(""); // "success" hoặc "error"


  // ✅ Kiểm tra token khi load lại trang
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAdmin(!!token);
    // Load thông tin admin khi component mount
    loadAdminInfo();
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
    } catch {
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

  // 👤 Load thông tin admin
  const loadAdminInfo = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/admin-info/public");
      const data = await response.json();
      setAdminInfo(data);
    } catch (error) {
      console.error("Error loading admin info:", error);
    }
  };

  // ✏️ Cập nhật thông tin admin
  const handleUpdateAdminInfo = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/admin-info", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(adminInfo),
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Cập nhật thông tin admin thành công!");
        setShowEditAdminInfo(false);
        loadAdminInfo(); // Reload thông tin
      } else {
        alert(`❌ ${data.message || "Cập nhật thất bại!"}`);
      }
    } catch {
      alert("⚠️ Lỗi kết nối máy chủ!");
    }
  };

  // 🔑 Đổi mật khẩu
  const handleChangePassword = async (e) => {
    e.preventDefault();

    // Kiểm tra mật khẩu mới và xác nhận có khớp không
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("❌ Mật khẩu mới và xác nhận mật khẩu không khớp!");
      return;
    }

    // Kiểm tra độ dài mật khẩu (ít nhất 8 ký tự)
    if (passwordForm.newPassword.length < 8) {
      alert("❌ Mật khẩu mới phải có ít nhất 8 ký tự!");
      return;
    }

    // Kiểm tra các tiêu chí bảo mật
    const password = passwordForm.newPassword;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

    if (!hasUpperCase) {
      alert("❌ Mật khẩu phải có ít nhất 1 chữ cái HOA!");
      return;
    }

    if (!hasLowerCase) {
      alert("❌ Mật khẩu phải có ít nhất 1 chữ cái thường!");
      return;
    }

    if (!hasNumbers) {
      alert("❌ Mật khẩu phải có ít nhất 1 chữ số!");
      return;
    }

    if (!hasSpecialChar) {
      alert("❌ Mật khẩu phải có ít nhất 1 ký tự đặc biệt!");
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
    } catch {
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
                onClick={() => setShowAdminInfo(true)}
                title="Thông tin admin"
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
                <FiUser />
              </button>
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
            <>
              <button
                onClick={() => setShowAdminInfo(true)}
                title="Thông tin liên hệ"
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
                <FiUser />
              </button>
              <button
                onClick={() => setShowLogin(true)}
                title="Trang quản trị"
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
                <FiSettings />
              </button>
            </>
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
            
            <div style={{ marginBottom: "12px" }}>
              <input
                type="text"
                placeholder="Username"
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  fontSize: "14px",
                  outline: "none",
                  transition: "border-color 0.3s ease",
                  boxSizing: "border-box"
                }}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                onFocus={(e) => e.target.style.borderColor = "#b84e00"}
                onBlur={(e) => e.target.style.borderColor = "#ddd"}
              />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <input
                type="password"
                placeholder="Password"
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  fontSize: "14px",
                  outline: "none",
                  transition: "border-color 0.3s ease",
                  boxSizing: "border-box"
                }}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                onFocus={(e) => e.target.style.borderColor = "#b84e00"}
                onBlur={(e) => e.target.style.borderColor = "#ddd"}
              />
            </div>
            <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
              <button
                type="submit"
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  background: "#b84e00",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "background-color 0.3s ease"
                }}
                onMouseOver={(e) => e.target.style.background = "#9a3e00"}
                onMouseOut={(e) => e.target.style.background = "#b84e00"}
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
                  flex: 1,
                  padding: "12px 16px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  background: "#f8f9fa",
                  color: "#495057",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "all 0.3s ease"
                }}
                onMouseOver={(e) => {
                  e.target.style.background = "#e9ecef";
                  e.target.style.borderColor = "#adb5bd";
                }}
                onMouseOut={(e) => {
                  e.target.style.background = "#f8f9fa";
                  e.target.style.borderColor = "#ddd";
                }}
              >
                Hủy
              </button>
            </div>
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
            
            {/* Tiêu chí bảo mật */}
            <div style={{ 
              background: "#f8f9fa", 
              padding: 12, 
              borderRadius: 6, 
              marginBottom: 15,
              fontSize: 12,
              color: "#6c757d"
            }}>
              <strong>📋 Tiêu chí mật khẩu bảo mật:</strong>
              <ul style={{ margin: "8px 0 0 0", paddingLeft: 16 }}>
                <li>✅ Ít nhất 8 ký tự</li>
                <li>✅ Có chữ cái HOA (A-Z)</li>
                <li>✅ Có chữ cái thường (a-z)</li>
                <li>✅ Có chữ số (0-9)</li>
                <li>✅ Có ký tự đặc biệt (!@#$%^&*)</li>
              </ul>
            </div>
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

      {/* 👤 Modal thông tin admin */}
      {showAdminInfo && (
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
          <div
            style={{
              background: "#fff",
              padding: 30,
              borderRadius: 12,
              minWidth: 500,
              maxWidth: "80vw",
              maxHeight: "80vh",
              overflow: "auto",
              boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ margin: 0, color: "#495057" }}>
                👤 Thông tin Admin
              </h3>
              <div style={{ display: "flex", gap: "10px" }}>
                {isAdmin && (
                  <button
                    onClick={() => setShowEditAdminInfo(true)}
                    style={{
                      background: "#007bff",
                      color: "white",
                      border: "none",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "14px",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px"
                    }}
                  >
                    <FiEdit3 /> Chỉnh sửa
                  </button>
                )}
                <button
                  onClick={() => setShowAdminInfo(false)}
                  style={{
                    background: "#6c757d",
                    color: "white",
                    border: "none",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "14px"
                  }}
                >
                  ✕ Đóng
                </button>
              </div>
            </div>
            
            {/* Hiển thị thông tin admin */}
            <div style={{ lineHeight: "1.6" }}>
              <div style={{ marginBottom: "15px" }}>
                <strong style={{ color: "#495057" }}>👤 Tên:</strong> {adminInfo.adminName || "Chưa cập nhật"}
              </div>
              <div style={{ marginBottom: "15px" }}>
                <strong style={{ color: "#495057" }}>📧 Email:</strong> {adminInfo.adminEmail || "Chưa cập nhật"}
              </div>
              {adminInfo.adminPhone && (
                <div style={{ marginBottom: "15px" }}>
                  <strong style={{ color: "#495057" }}>📞 Số điện thoại:</strong> {adminInfo.adminPhone}
                </div>
              )}
              {adminInfo.adminTelegram && (
                <div style={{ marginBottom: "15px" }}>
                  <strong style={{ color: "#495057" }}>📱 Telegram:</strong> {adminInfo.adminTelegram}
                </div>
              )}
              {adminInfo.adminFacebook && (
                <div style={{ marginBottom: "15px" }}>
                  <strong style={{ color: "#495057" }}>📘 Facebook:</strong> {adminInfo.adminFacebook}
                </div>
              )}
              {adminInfo.adminZalo && (
                <div style={{ marginBottom: "15px" }}>
                  <strong style={{ color: "#495057" }}>💬 Zalo:</strong> {adminInfo.adminZalo}
                </div>
              )}
              {adminInfo.adminTitle && (
                <div style={{ marginBottom: "15px" }}>
                  <strong style={{ color: "#495057" }}>💼 Chức vụ:</strong> {adminInfo.adminTitle}
                </div>
              )}
              {adminInfo.workingHours && (
                <div style={{ marginBottom: "15px" }}>
                  <strong style={{ color: "#495057" }}>🕒 Giờ làm việc:</strong> {adminInfo.workingHours}
                </div>
              )}
              {adminInfo.adminDescription && (
                <div style={{ marginBottom: "15px" }}>
                  <strong style={{ color: "#495057" }}>📝 Mô tả:</strong>
                  <div style={{ 
                    background: "#f8f9fa", 
                    padding: "10px", 
                    borderRadius: "6px", 
                    marginTop: "5px",
                    border: "1px solid #e9ecef"
                  }}>
                    {adminInfo.adminDescription}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ✏️ Modal chỉnh sửa thông tin admin */}
      {showEditAdminInfo && (
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
            zIndex: 2001,
          }}
        >
          <form
            onSubmit={handleUpdateAdminInfo}
            style={{
              background: "#fff",
              padding: 30,
              borderRadius: 12,
              minWidth: 600,
              maxWidth: "90vw",
              maxHeight: "90vh",
              overflow: "auto",
              boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            }}
          >
            <h3 style={{ textAlign: "center", marginBottom: 20, color: "#495057" }}>
              ✏️ Chỉnh sửa thông tin Admin
            </h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Tên Admin *</label>
                <input
                  type="text"
                  value={adminInfo.adminName}
                  onChange={(e) => setAdminInfo({...adminInfo, adminName: e.target.value})}
                  required
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #ced4da",
                    borderRadius: "6px",
                    fontSize: "14px"
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Email *</label>
                <input
                  type="email"
                  value={adminInfo.adminEmail}
                  onChange={(e) => setAdminInfo({...adminInfo, adminEmail: e.target.value})}
                  required
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #ced4da",
                    borderRadius: "6px",
                    fontSize: "14px"
                  }}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Số điện thoại</label>
                <input
                  type="tel"
                  value={adminInfo.adminPhone}
                  onChange={(e) => setAdminInfo({...adminInfo, adminPhone: e.target.value})}
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #ced4da",
                    borderRadius: "6px",
                    fontSize: "14px"
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Chức vụ</label>
                <input
                  type="text"
                  value={adminInfo.adminTitle}
                  onChange={(e) => setAdminInfo({...adminInfo, adminTitle: e.target.value})}
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #ced4da",
                    borderRadius: "6px",
                    fontSize: "14px"
                  }}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Telegram</label>
                <input
                  type="text"
                  value={adminInfo.adminTelegram}
                  onChange={(e) => setAdminInfo({...adminInfo, adminTelegram: e.target.value})}
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #ced4da",
                    borderRadius: "6px",
                    fontSize: "14px"
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Facebook</label>
                <input
                  type="text"
                  value={adminInfo.adminFacebook}
                  onChange={(e) => setAdminInfo({...adminInfo, adminFacebook: e.target.value})}
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #ced4da",
                    borderRadius: "6px",
                    fontSize: "14px"
                  }}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Zalo</label>
                <input
                  type="text"
                  value={adminInfo.adminZalo}
                  onChange={(e) => setAdminInfo({...adminInfo, adminZalo: e.target.value})}
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #ced4da",
                    borderRadius: "6px",
                    fontSize: "14px"
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Giờ làm việc</label>
                <input
                  type="text"
                  value={adminInfo.workingHours}
                  onChange={(e) => setAdminInfo({...adminInfo, workingHours: e.target.value})}
                  placeholder="VD: Thứ 2 - Thứ 6: 8:00 - 17:00"
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #ced4da",
                    borderRadius: "6px",
                    fontSize: "14px"
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Mô tả</label>
              <textarea
                value={adminInfo.adminDescription}
                onChange={(e) => setAdminInfo({...adminInfo, adminDescription: e.target.value})}
                rows="3"
                placeholder="Mô tả về admin và cách liên hệ..."
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #ced4da",
                  borderRadius: "6px",
                  fontSize: "14px",
                  resize: "vertical"
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => setShowEditAdminInfo(false)}
                style={{
                  padding: "10px 20px",
                  background: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "14px"
                }}
              >
                ❌ Hủy
              </button>
              <button
                type="submit"
                style={{
                  padding: "10px 20px",
                  background: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "14px"
                }}
              >
                💾 Lưu thay đổi
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
