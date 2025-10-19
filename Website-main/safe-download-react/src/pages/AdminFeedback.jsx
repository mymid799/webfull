import React, { useEffect, useState } from "react";
import "../styles/table.css";

export default function AdminFeedback() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [filter, setFilter] = useState({
    status: "all",
    category: "all",
    type: "all"
  });
  const [selectedReport, setSelectedReport] = useState(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseData, setResponseData] = useState({
    publicResponse: "",
    responseStatus: "responded"
  });
  const [editingReport, setEditingReport] = useState(null);
  const [editData, setEditData] = useState({});
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadReports();
    loadStats();
    
    // Check if there's a specific report ID in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const reportId = urlParams.get('id');
    if (reportId) {
      // Scroll to the specific report or highlight it
      setTimeout(() => {
        const reportElement = document.querySelector(`[data-report-id="${reportId}"]`);
        if (reportElement) {
          reportElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          reportElement.style.backgroundColor = '#fff3cd';
          reportElement.style.border = '2px solid #ffc107';
        }
      }, 1000);
    }
  }, []);

  const loadReports = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/reports", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setReports(data);
    } catch (error) {
      console.error("Error loading reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/reports/public/stats");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const loadSingleReport = async (reportId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/reports/${reportId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error loading single report:", error);
      return null;
    }
  };

  const updateReportStatus = async (reportId, newStatus, adminNotes = "") => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/reports/${reportId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus, adminNotes }),
      });

      if (response.ok) {
        alert("✅ Cập nhật trạng thái thành công!");
        loadReports();
      } else {
        alert("❌ Có lỗi khi cập nhật!");
      }
    } catch (error) {
      console.error("Error updating report:", error);
      alert("❌ Có lỗi khi cập nhật!");
    }
  };

  const openResponseModal = (report) => {
    setSelectedReport(report);
    setResponseData({
      publicResponse: report.publicResponse || "",
      responseStatus: report.responseStatus || "responded"
    });
    setShowResponseModal(true);
  };

  const sendResponse = async () => {
    if (!selectedReport) return;
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/reports/${selectedReport._id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: selectedReport.status,
          adminNotes: selectedReport.adminNotes,
          publicResponse: responseData.publicResponse,
          responseStatus: responseData.responseStatus
        }),
      });

      if (response.ok) {
        alert("✅ Phản hồi đã được gửi thành công!");
        setShowResponseModal(false);
        loadReports();
      } else {
        alert("❌ Có lỗi khi gửi phản hồi!");
      }
    } catch (error) {
      console.error("Error sending response:", error);
      alert("❌ Có lỗi khi gửi phản hồi!");
    }
  };

  const startEdit = (report) => {
    setEditingReport(report._id);
    setEditData({
      status: report.status,
      responseStatus: report.responseStatus || "no_response",
      publicResponse: report.publicResponse || "",
      adminNotes: report.adminNotes || ""
    });
    setHasChanges(false);
  };

  const cancelEdit = () => {
    setEditingReport(null);
    setEditData({});
    setHasChanges(false);
  };

  const handleEditChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
  };

  const saveEdit = async (reportId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/reports/${reportId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editData),
      });

      if (response.ok) {
        alert("✅ Cập nhật thành công!");
        setEditingReport(null);
        setEditData({});
        setHasChanges(false);
        loadReports();
      } else {
        alert("❌ Có lỗi khi cập nhật!");
      }
    } catch (error) {
      console.error("Error updating report:", error);
      alert("❌ Có lỗi khi cập nhật!");
    }
  };

  const saveAllChanges = async () => {
    if (!hasChanges) {
      alert("⚠️ Không có thay đổi nào để lưu!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/reports/${editingReport}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editData),
      });

      if (response.ok) {
        alert("✅ Đã lưu tất cả thay đổi!");
        setEditingReport(null);
        setEditData({});
        setHasChanges(false);
        loadReports();
      } else {
        alert("❌ Có lỗi khi lưu!");
      }
    } catch (error) {
      console.error("Error saving changes:", error);
      alert("❌ Có lỗi khi lưu!");
    }
  };

  const deleteReport = async (reportId) => {
    if (!confirm("Bạn có chắc muốn xóa báo cáo này?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/reports/${reportId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert("✅ Xóa báo cáo thành công!");
        loadReports();
      } else {
        alert("❌ Có lỗi khi xóa!");
      }
    } catch (error) {
      console.error("Error deleting report:", error);
      alert("❌ Có lỗi khi xóa!");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "#ffc107";
      case "in_progress": return "#17a2b8";
      case "resolved": return "#28a745";
      case "rejected": return "#dc3545";
      default: return "#6c757d";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending": return "⏳ Chờ xử lý";
      case "in_progress": return "🔄 Đang xử lý";
      case "resolved": return "✅ Đã giải quyết";
      case "rejected": return "❌ Từ chối";
      default: return "❓ Không rõ";
    }
  };

  const getTypeText = (type) => {
    switch (type) {
      case "broken_link": return "🔗 Link hỏng";
      case "version_update": return "🔄 Cập nhật phiên bản";
      case "general_feedback": return "💬 Phản hồi chung";
      default: return "❓ Không rõ";
    }
  };

  const getCategoryText = (category) => {
    switch (category) {
      case "windows": return "🪟 Windows";
      case "office": return "📄 Office";
      case "tools": return "🔧 Tools";
      case "antivirus": return "🛡️ Antivirus";
      default: return "❓ Không rõ";
    }
  };

  const getRatingIcon = (rating) => {
    switch (rating) {
      case "working": return "✅";
      case "broken": return "❌";
      case "slow": return "🐌";
      default: return "❓";
    }
  };

  const getResponseStatusText = (status) => {
    switch (status) {
      case "no_response": return "❌ Chưa phản hồi";
      case "responded": return "💬 Đã phản hồi";
      case "fixed": return "✅ Đã sửa";
      case "wont_fix": return "🚫 Không sửa";
      default: return "❓ Không rõ";
    }
  };

  const getResponseStatusColor = (status) => {
    switch (status) {
      case "no_response": return "#dc3545";
      case "responded": return "#17a2b8";
      case "fixed": return "#28a745";
      case "wont_fix": return "#6c757d";
      default: return "#6c757d";
    }
  };

  const filteredReports = reports.filter(report => {
    if (filter.status !== "all" && report.status !== filter.status) return false;
    if (filter.category !== "all" && report.category !== filter.category) return false;
    if (filter.type !== "all" && report.reportType !== filter.type) return false;
    return true;
  });

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>⏳ Đang tải dữ liệu...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px 40px" }}>
      <h2 style={{ color: "#b84e00", textAlign: "center", marginBottom: "30px" }}>
        📊 QUẢN LÝ PHẢN HỒI
      </h2>

      {/* Thống kê tổng quan */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
        gap: "20px", 
        marginBottom: "30px" 
      }}>
        <div style={{ background: "#e3f2fd", padding: "20px", borderRadius: "10px", textAlign: "center" }}>
          <h3 style={{ color: "#1976d2", margin: "0 0 10px 0" }}>📊 Tổng báo cáo</h3>
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "#1976d2" }}>
            {stats.total || 0}
          </div>
        </div>
        <div style={{ background: "#fff3e0", padding: "20px", borderRadius: "10px", textAlign: "center" }}>
          <h3 style={{ color: "#f57c00", margin: "0 0 10px 0" }}>⏳ Chờ xử lý</h3>
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "#f57c00" }}>
            {stats.pending || 0}
          </div>
        </div>
        <div style={{ background: "#e8f5e8", padding: "20px", borderRadius: "10px", textAlign: "center" }}>
          <h3 style={{ color: "#388e3c", margin: "0 0 10px 0" }}>✅ Đã giải quyết</h3>
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "#388e3c" }}>
            {stats.resolved || 0}
          </div>
        </div>
        <div style={{ background: "#fce4ec", padding: "20px", borderRadius: "10px", textAlign: "center" }}>
          <h3 style={{ color: "#c2185b", margin: "0 0 10px 0" }}>🔄 Đang xử lý</h3>
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "#c2185b" }}>
            {stats.inProgress || 0}
          </div>
        </div>
      </div>

      {/* Bảng tổng hợp chi tiết */}
      <div style={{ 
        background: "#f8f9fa", 
        padding: "20px", 
        borderRadius: "10px", 
        marginBottom: "20px",
        border: "1px solid #e9ecef"
      }}>
        <h3 style={{ color: "#495057", marginBottom: "20px" }}>📈 Tổng hợp chi tiết</h3>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
          {/* Thống kê theo loại báo cáo */}
          <div style={{ background: "white", padding: "15px", borderRadius: "8px", border: "1px solid #dee2e6" }}>
            <h4 style={{ color: "#495057", margin: "0 0 15px 0" }}>📋 Theo loại báo cáo</h4>
            <div style={{ fontSize: "14px", lineHeight: "1.6" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span>🔗 Link hỏng:</span>
                <strong style={{ color: "#dc3545" }}>{stats.byType?.brokenLink || 0}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span>🔄 Cập nhật phiên bản:</span>
                <strong style={{ color: "#007bff" }}>{stats.byType?.versionUpdate || 0}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>💬 Phản hồi chung:</span>
                <strong style={{ color: "#28a745" }}>{stats.byType?.generalFeedback || 0}</strong>
              </div>
            </div>
          </div>

          {/* Thống kê theo danh mục */}
          <div style={{ background: "white", padding: "15px", borderRadius: "8px", border: "1px solid #dee2e6" }}>
            <h4 style={{ color: "#495057", margin: "0 0 15px 0" }}>📂 Theo danh mục</h4>
            <div style={{ fontSize: "14px", lineHeight: "1.6" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span>🪟 Windows:</span>
                <strong style={{ color: "#0078d4" }}>{stats.byCategory?.windows || 0}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span>📄 Office:</span>
                <strong style={{ color: "#d83b01" }}>{stats.byCategory?.office || 0}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span>🔧 Tools:</span>
                <strong style={{ color: "#107c10" }}>{stats.byCategory?.tools || 0}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>🛡️ Antivirus:</span>
                <strong style={{ color: "#e3008c" }}>{stats.byCategory?.antivirus || 0}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Thông báo thay đổi chưa lưu */}
      {hasChanges && (
        <div style={{
          background: "#fff3cd",
          border: "1px solid #ffeaa7",
          color: "#856404",
          padding: "15px",
          borderRadius: "8px",
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}>
          <span style={{ fontSize: "18px" }}>⚠️</span>
          <div>
            <strong>Có thay đổi chưa lưu!</strong>
            <div style={{ fontSize: "14px", marginTop: "5px" }}>
              Bạn có thay đổi chưa được lưu. Nhấn "💾 Lưu thay đổi" để lưu hoặc "❌ Hủy" để bỏ qua.
            </div>
          </div>
        </div>
      )}

      {/* Bộ lọc */}
      <div style={{ 
        background: "#f8f9fa", 
        padding: "20px", 
        borderRadius: "10px", 
        marginBottom: "20px",
        display: "flex",
        gap: "20px",
        flexWrap: "wrap",
        alignItems: "center"
      }}>
        <div>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Trạng thái:</label>
          <select
            value={filter.status}
            onChange={(e) => setFilter({...filter, status: e.target.value})}
            style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ced4da" }}
          >
            <option value="all">Tất cả</option>
            <option value="pending">⏳ Chờ xử lý</option>
            <option value="in_progress">🔄 Đang xử lý</option>
            <option value="resolved">✅ Đã giải quyết</option>
            <option value="rejected">❌ Từ chối</option>
          </select>
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Danh mục:</label>
          <select
            value={filter.category}
            onChange={(e) => setFilter({...filter, category: e.target.value})}
            style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ced4da" }}
          >
            <option value="all">Tất cả</option>
            <option value="windows">🪟 Windows</option>
            <option value="office">📄 Office</option>
            <option value="tools">🔧 Tools</option>
            <option value="antivirus">🛡️ Antivirus</option>
          </select>
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Loại:</label>
          <select
            value={filter.type}
            onChange={(e) => setFilter({...filter, type: e.target.value})}
            style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ced4da" }}
          >
            <option value="all">Tất cả</option>
            <option value="broken_link">🔗 Link hỏng</option>
            <option value="version_update">🔄 Cập nhật phiên bản</option>
            <option value="general_feedback">💬 Phản hồi chung</option>
          </select>
        </div>
        <button
          onClick={loadReports}
          style={{
            background: "#007bff",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          🔄 Làm mới
        </button>
        {editingReport && (
          <button
            onClick={saveAllChanges}
            disabled={!hasChanges}
            style={{
              background: hasChanges ? "#28a745" : "#6c757d",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "5px",
              cursor: hasChanges ? "pointer" : "not-allowed",
              fontWeight: "bold"
            }}
          >
            💾 Lưu thay đổi
          </button>
        )}
      </div>

      {/* Bảng báo cáo */}
      <div style={{ overflowX: "auto" }}>
        <table className="enhanced-table">
          <thead>
            <tr>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Loại</th>
              <th style={thStyle}>Danh mục</th>
              <th style={thStyle}>Sản phẩm</th>
              <th style={thStyle}>Đánh giá</th>
              <th style={thStyle}>Trạng thái</th>
              <th style={thStyle}>Phản hồi</th>
              <th style={thStyle}>Người báo</th>
              <th style={thStyle}>Ngày tạo</th>
              <th style={thStyle}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.map((report) => (
              <tr key={report._id} data-report-id={report._id}>
                <td style={tdStyle}>
                  <small>{report._id.slice(-8)}</small>
                </td>
                <td style={tdStyle}>
                  {getTypeText(report.reportType)}
                </td>
                <td style={tdStyle}>
                  {getCategoryText(report.category)}
                </td>
                <td style={tdStyle}>
                  <div>
                    <strong>{report.productName}</strong>
                    {report.version && <div><small>v{report.version}</small></div>}
                    {report.edition && <div><small>{report.edition}</small></div>}
                  </div>
                </td>
                <td style={tdStyle}>
                  {getRatingIcon(report.rating)}
                </td>
                <td style={tdStyle}>
                  {editingReport === report._id ? (
                    <select
                      value={editData.status}
                      onChange={(e) => handleEditChange("status", e.target.value)}
                      style={{
                        padding: "4px 8px",
                        borderRadius: "4px",
                        border: "1px solid #ced4da",
                        fontSize: "12px",
                        background: "white"
                      }}
                    >
                      <option value="pending">⏳ Chờ xử lý</option>
                      <option value="in_progress">🔄 Đang xử lý</option>
                      <option value="resolved">✅ Đã giải quyết</option>
                      <option value="rejected">❌ Từ chối</option>
                    </select>
                  ) : (
                    <span style={{
                      background: getStatusColor(report.status),
                      color: "white",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "12px"
                    }}>
                      {getStatusText(report.status)}
                    </span>
                  )}
                </td>
                <td style={tdStyle}>
                  {editingReport === report._id ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                      <select
                        value={editData.responseStatus}
                        onChange={(e) => handleEditChange("responseStatus", e.target.value)}
                        style={{
                          padding: "4px 8px",
                          borderRadius: "4px",
                          border: "1px solid #ced4da",
                          fontSize: "11px",
                          background: "white"
                        }}
                      >
                        <option value="no_response">❌ Chưa phản hồi</option>
                        <option value="responded">💬 Đã phản hồi</option>
                        <option value="fixed">✅ Đã sửa</option>
                        <option value="wont_fix">🚫 Không sửa</option>
                      </select>
                      <textarea
                        value={editData.publicResponse}
                        onChange={(e) => handleEditChange("publicResponse", e.target.value)}
                        placeholder="Phản hồi cho người dùng..."
                        rows="2"
                        style={{
                          padding: "4px 6px",
                          borderRadius: "4px",
                          border: "1px solid #ced4da",
                          fontSize: "11px",
                          resize: "vertical",
                          minHeight: "40px"
                        }}
                      />
                    </div>
                  ) : (
                    <div style={{ textAlign: "center" }}>
                      <span style={{
                        background: getResponseStatusColor(report.responseStatus || "no_response"),
                        color: "white",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "11px",
                        display: "inline-block",
                        marginBottom: "5px"
                      }}>
                        {getResponseStatusText(report.responseStatus || "no_response")}
                      </span>
                      {report.publicResponse && (
                        <div style={{ fontSize: "11px", color: "#6c757d", marginTop: "3px" }}>
                          <strong>Phản hồi:</strong><br/>
                          <span style={{ 
                            background: "#f8f9fa", 
                            padding: "2px 4px", 
                            borderRadius: "3px",
                            display: "inline-block",
                            maxWidth: "150px",
                            wordWrap: "break-word"
                          }}>
                            {report.publicResponse.length > 50 
                              ? report.publicResponse.substring(0, 50) + "..." 
                              : report.publicResponse}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </td>
                <td style={tdStyle}>
                  <div>
                    <div>{report.reporterName || "Anonymous"}</div>
                    {report.reporterEmail && <div><small>{report.reporterEmail}</small></div>}
                  </div>
                </td>
                <td style={tdStyle}>
                  <small>{new Date(report.createdAt).toLocaleDateString('vi-VN')}</small>
                </td>
                <td style={tdStyle}>
                  <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                    {editingReport === report._id ? (
                      <>
                        <button
                          onClick={() => saveEdit(report._id)}
                          style={{
                            background: "#28a745",
                            color: "white",
                            border: "none",
                            padding: "4px 8px",
                            borderRadius: "3px",
                            cursor: "pointer",
                            fontSize: "11px"
                          }}
                        >
                          ✅ Lưu
                        </button>
                        <button
                          onClick={cancelEdit}
                          style={{
                            background: "#6c757d",
                            color: "white",
                            border: "none",
                            padding: "4px 8px",
                            borderRadius: "3px",
                            cursor: "pointer",
                            fontSize: "11px"
                          }}
                        >
                          ❌ Hủy
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(report)}
                          style={{
                            background: "#ffc107",
                            color: "#212529",
                            border: "none",
                            padding: "4px 8px",
                            borderRadius: "3px",
                            cursor: "pointer",
                            fontSize: "11px",
                            fontWeight: "bold"
                          }}
                        >
                          ✏️ Sửa
                        </button>
                        <button
                          onClick={() => openResponseModal(report)}
                          style={{
                            background: "#007bff",
                            color: "white",
                            border: "none",
                            padding: "4px 8px",
                            borderRadius: "3px",
                            cursor: "pointer",
                            fontSize: "11px"
                          }}
                        >
                          💬 Phản hồi
                        </button>
                        <button
                          onClick={() => deleteReport(report._id)}
                          style={{
                            background: "#dc3545",
                            color: "white",
                            border: "none",
                            padding: "4px 8px",
                            borderRadius: "3px",
                            cursor: "pointer",
                            fontSize: "11px"
                          }}
                        >
                          🗑️ Xóa
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredReports.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px", color: "#6c757d" }}>
          <h3>📭 Không có báo cáo nào</h3>
          <p>Thử thay đổi bộ lọc để xem thêm báo cáo.</p>
        </div>
      )}

      {/* Modal phản hồi */}
      {showResponseModal && selectedReport && (
        <div style={{
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
        }}>
          <div style={{
            background: "white",
            padding: "30px",
            borderRadius: "10px",
            minWidth: "500px",
            maxWidth: "80vw",
            maxHeight: "80vh",
            overflow: "auto",
            boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
          }}>
            <h3 style={{ marginBottom: "20px", color: "#495057" }}>
              💬 Phản hồi cho người dùng
            </h3>
            
            {/* Thông tin báo cáo */}
            <div style={{ 
              background: "#f8f9fa", 
              padding: "15px", 
              borderRadius: "8px", 
              marginBottom: "20px",
              border: "1px solid #e9ecef"
            }}>
              <h4 style={{ margin: "0 0 10px 0", color: "#495057" }}>📋 Thông tin báo cáo:</h4>
              <div style={{ fontSize: "14px", lineHeight: "1.5" }}>
                <div><strong>Loại:</strong> {getTypeText(selectedReport.reportType)}</div>
                <div><strong>Danh mục:</strong> {getCategoryText(selectedReport.category)}</div>
                <div><strong>Sản phẩm:</strong> {selectedReport.productName}</div>
                <div><strong>Mô tả:</strong> {selectedReport.description}</div>
                {selectedReport.brokenLink && <div><strong>Link lỗi:</strong> {selectedReport.brokenLink}</div>}
              </div>
            </div>

            {/* Form phản hồi */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#495057" }}>
                Trạng thái phản hồi *
              </label>
              <select
                value={responseData.responseStatus}
                onChange={(e) => setResponseData({...responseData, responseStatus: e.target.value})}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ced4da",
                  borderRadius: "5px",
                  fontSize: "14px"
                }}
              >
                <option value="responded">💬 Đã phản hồi</option>
                <option value="fixed">✅ Đã sửa lỗi</option>
                <option value="wont_fix">🚫 Không thể sửa</option>
              </select>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#495057" }}>
                Nội dung phản hồi *
              </label>
              <textarea
                value={responseData.publicResponse}
                onChange={(e) => setResponseData({...responseData, publicResponse: e.target.value})}
                placeholder="Nhập nội dung phản hồi cho người dùng..."
                rows="4"
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ced4da",
                  borderRadius: "5px",
                  fontSize: "14px",
                  resize: "vertical"
                }}
                required
              />
            </div>

            {/* Nút hành động */}
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowResponseModal(false)}
                style={{
                  padding: "10px 20px",
                  background: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "14px"
                }}
              >
                ❌ Hủy
              </button>
              <button
                onClick={sendResponse}
                disabled={!responseData.publicResponse.trim()}
                style={{
                  padding: "10px 20px",
                  background: !responseData.publicResponse.trim() ? "#6c757d" : "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: !responseData.publicResponse.trim() ? "not-allowed" : "pointer",
                  fontSize: "14px"
                }}
              >
                📤 Gửi phản hồi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const thStyle = {
  border: "1px solid #e2e8f0",
  background: "#ffe08a",
  color: "#000",
  padding: "8px 12px",
  textAlign: "left",
  fontWeight: "bold",
};

const tdStyle = {
  border: "1px solid #eee",
  padding: "8px 10px",
  verticalAlign: "top",
};
