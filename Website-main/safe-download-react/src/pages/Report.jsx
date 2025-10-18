import React, { useState } from "react";
import "../styles/table.css";

export default function Report() {
  const [formData, setFormData] = useState({
    reportType: "broken_link",
    category: "windows",
    productName: "",
    version: "",
    edition: "",
    brokenLink: "",
    rating: "unknown",
    description: "",
    reporterName: "",
    reporterEmail: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      
      if (response.ok) {
        setSubmitMessage("success");
        // Reset form
        setFormData({
          reportType: "broken_link",
          category: "windows",
          productName: "",
          version: "",
          edition: "",
          brokenLink: "",
          rating: "unknown",
          description: "",
          reporterName: "",
          reporterEmail: ""
        });
      } else {
        setSubmitMessage("error");
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      setSubmitMessage("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: "20px 40px", maxWidth: "800px", margin: "0 auto" }}>
      <h2 style={{ color: "#b84e00", textAlign: "center", marginBottom: "30px" }}>
        📝 BÁO CÁO & ĐÁNH GIÁ
      </h2>

      <div style={{ 
        background: "#f8f9fa", 
        padding: "20px", 
        borderRadius: "10px", 
        marginBottom: "20px",
        border: "1px solid #e9ecef"
      }}>
        <h3 style={{ color: "#495057", marginBottom: "15px" }}>
          💡 Hướng dẫn sử dụng
        </h3>
        <ul style={{ color: "#6c757d", lineHeight: "1.6" }}>
          <li><strong>Báo link hỏng:</strong> Khi bạn gặp link tải không hoạt động</li>
          <li><strong>Đề xuất cập nhật:</strong> Khi bạn biết có phiên bản mới hơn</li>
          <li><strong>Đánh giá:</strong> Chia sẻ trải nghiệm tải về của bạn</li>
        </ul>
      </div>

      {submitMessage === "success" && (
        <div style={{
          background: "#d4edda",
          color: "#155724",
          padding: "15px",
          borderRadius: "5px",
          marginBottom: "20px",
          border: "1px solid #c3e6cb"
        }}>
          ✅ Báo cáo đã được gửi thành công! Cảm ơn bạn đã đóng góp.
        </div>
      )}

      {submitMessage === "error" && (
        <div style={{
          background: "#f8d7da",
          color: "#721c24",
          padding: "15px",
          borderRadius: "5px",
          marginBottom: "20px",
          border: "1px solid #f5c6cb"
        }}>
          ❌ Có lỗi xảy ra khi gửi báo cáo. Vui lòng thử lại sau.
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ background: "white", padding: "30px", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
        {/* Loại báo cáo */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#495057" }}>
            Loại báo cáo *
          </label>
          <select
            name="reportType"
            value={formData.reportType}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ced4da",
              borderRadius: "5px",
              fontSize: "14px"
            }}
            required
          >
            <option value="broken_link">🔗 Báo link hỏng</option>
            <option value="version_update">🔄 Đề xuất cập nhật phiên bản</option>
            <option value="general_feedback">💬 Phản hồi chung</option>
          </select>
        </div>

        {/* Danh mục */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#495057" }}>
            Danh mục *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ced4da",
              borderRadius: "5px",
              fontSize: "14px"
            }}
            required
          >
            <option value="windows">🪟 Windows</option>
            <option value="office">📄 Office</option>
            <option value="tools">🔧 Tools</option>
            <option value="antivirus">🛡️ Antivirus</option>
          </select>
        </div>

        {/* Tên sản phẩm */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#495057" }}>
            Tên sản phẩm *
          </label>
          <input
            type="text"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            placeholder="Ví dụ: Windows 11, Office 2021, WinRAR..."
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ced4da",
              borderRadius: "5px",
              fontSize: "14px"
            }}
            required
          />
        </div>

        {/* Version và Edition */}
        <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#495057" }}>
              Version
            </label>
            <input
              type="text"
              name="version"
              value={formData.version}
              onChange={handleChange}
              placeholder="Ví dụ: 11, 2021, 6.0..."
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ced4da",
                borderRadius: "5px",
                fontSize: "14px"
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#495057" }}>
              Edition
            </label>
            <input
              type="text"
              name="edition"
              value={formData.edition}
              onChange={handleChange}
              placeholder="Ví dụ: Pro, Home, Enterprise..."
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ced4da",
                borderRadius: "5px",
                fontSize: "14px"
              }}
            />
          </div>
        </div>

        {/* Link bị lỗi */}
        {formData.reportType === "broken_link" && (
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#495057" }}>
              Link bị lỗi
            </label>
            <input
              type="url"
              name="brokenLink"
              value={formData.brokenLink}
              onChange={handleChange}
              placeholder="Dán link bị lỗi vào đây..."
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ced4da",
                borderRadius: "5px",
                fontSize: "14px"
              }}
            />
          </div>
        )}

        {/* Đánh giá độ tin cậy */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#495057" }}>
            Đánh giá độ tin cậy
          </label>
          <select
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ced4da",
              borderRadius: "5px",
              fontSize: "14px"
            }}
          >
            <option value="unknown">❓ Chưa rõ</option>
            <option value="working">✅ Đã tải OK</option>
            <option value="broken">❌ Link lỗi</option>
            <option value="slow">🐌 Tải chậm</option>
          </select>
        </div>

        {/* Mô tả chi tiết */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#495057" }}>
            Mô tả chi tiết *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Mô tả chi tiết về vấn đề hoặc đề xuất của bạn..."
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

        {/* Thông tin liên hệ (tùy chọn) */}
        <div style={{ marginBottom: "20px" }}>
          <h4 style={{ color: "#495057", marginBottom: "15px" }}>Thông tin liên hệ (tùy chọn)</h4>
          <div style={{ display: "flex", gap: "15px" }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#495057" }}>
                Tên của bạn
              </label>
              <input
                type="text"
                name="reporterName"
                value={formData.reporterName}
                onChange={handleChange}
                placeholder="Tên hoặc nickname..."
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ced4da",
                  borderRadius: "5px",
                  fontSize: "14px"
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#495057" }}>
                Email
              </label>
              <input
                type="email"
                name="reporterEmail"
                value={formData.reporterEmail}
                onChange={handleChange}
                placeholder="email@example.com"
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ced4da",
                  borderRadius: "5px",
                  fontSize: "14px"
                }}
              />
            </div>
          </div>
        </div>

        {/* Nút gửi */}
        <div style={{ textAlign: "center" }}>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              background: isSubmitting ? "#6c757d" : "linear-gradient(135deg, #007bff 0%, #0056b3 100%)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "15px 40px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 15px rgba(0, 123, 255, 0.3)"
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 20px rgba(0, 123, 255, 0.4)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isSubmitting) {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 15px rgba(0, 123, 255, 0.3)";
              }
            }}
          >
            {isSubmitting ? "⏳ Đang gửi..." : "📤 Gửi báo cáo"}
          </button>
        </div>
      </form>
    </div>
  );
}
