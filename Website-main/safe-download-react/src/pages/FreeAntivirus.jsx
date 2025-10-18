import React, { useEffect, useState } from "react";
import ColumnManager, { ColumnHeader } from "../components/ColumnManager";
import "../styles/table.css";

export default function FreeAntivirus() {
  const [data, setData] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // ✅ thêm state tìm kiếm

  const [columns, setColumns] = useState([
    { key: "toolName", label: "Tên Tool", type: "text" },
    { key: "mainLink", label: "Trang chủ / Link gốc", type: "url" },
    { key: "googleDrive", label: "Google", type: "url" },
    { key: "oneDrive", label: "OneDrive", type: "url" },
    { key: "note", label: "Note", type: "text" },
  ]);

  useEffect(() => {
    // Load dữ liệu
    fetch("http://localhost:5000/api/antivirus")
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch(() => setData([]));

    // Load cấu hình cột từ localStorage
    try {
      const configKey = `column_config_antivirus`;
      const savedConfig = localStorage.getItem(configKey);
      
      if (savedConfig) {
        const configData = JSON.parse(savedConfig);
        console.log("✅ Loaded column config from localStorage:", configData);
        setColumns(configData.columns);
      } else {
        console.log("📋 No saved config found, using defaults");
        setColumns([
          { key: "toolName", label: "Tên Tool", type: "text" },
          { key: "mainLink", label: "Trang chủ / Link gốc", type: "url" },
          { key: "googleDrive", label: "Google", type: "url" },
          { key: "oneDrive", label: "OneDrive", type: "url" },
          { key: "note", label: "Note", type: "text" }
        ]);
      }
    } catch (err) {
      console.warn("⚠️ Error loading column config, using defaults:", err);
      setColumns([
        { key: "toolName", label: "Tên Tool", type: "text" },
        { key: "mainLink", label: "Trang chủ / Link gốc", type: "url" },
        { key: "googleDrive", label: "Google", type: "url" },
        { key: "oneDrive", label: "OneDrive", type: "url" },
        { key: "note", label: "Note", type: "text" }
      ]);
    }

    const token = localStorage.getItem("token");
    if (token) setIsAdmin(true);
  }, []);

  const addRow = () => {
    setData([
      ...data,
      {
        type: "normal", // phân loại hàng thường
        toolName: "",
        mainLink: "",
        googleDrive: "",
        oneDrive: "",
        note: "",
      },
    ]);
  };

  const addNoteRow = () => {
    setData([
      ...data,
      {
        type: "note", // hàng chú thích đặc biệt
        note: "Nhập ghi chú ở đây...",
      },
    ]);
  };

  const deleteRow = (index) => {
    const newData = [...data];
    newData.splice(index, 1);
    setData(newData);
  };

  const handleChange = (index, key, value) => {
    const updated = [...data];
    updated[index][key] = value;
    setData(updated);
  };

  const saveChanges = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("🔒 Bạn cần đăng nhập admin!");

    try {
      const res = await fetch("http://localhost:5000/api/antivirus/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (res.ok) alert(result.message || "✅ Dữ liệu đã lưu!");
      else alert(result.message || "❌ Lưu thất bại!");
    } catch (err) {
      console.error(err);
      alert("⚠️ Lỗi khi gửi dữ liệu!");
    }
  };

  // ✅ Bộ lọc realtime cho dữ liệu
  const filteredData = data.filter((row) =>
    Object.values(row).join(" ").toLowerCase().includes(searchTerm)
  );

  return (
    <div style={{ padding: "20px 40px" }}>
      <h2 style={{ color: "#b84e00", textAlign: "center" }}>
        FREE ANTIVIRUS / AN TOÀN THÔNG TIN
      </h2>

      {/* 🔍 Thanh tìm kiếm */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <input
          type="text"
          placeholder="🔍 Tìm kiếm Antivirus theo tên, ghi chú hoặc link tải..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
          className="search-input"
        />
      </div>

      {isAdmin && (
        <div className="control-buttons">
          <ColumnManager 
            columns={columns}
            setColumns={setColumns}
            data={data}
            setData={setData}
            isAdmin={isAdmin}
            category="antivirus"
          />
          <button
            onClick={addRow}
            className="btn-add"
          >
            ➕ Thêm hàng
          </button>
          <button
            onClick={addNoteRow}
            style={{
              background: "linear-gradient(135deg, #17a2b8 0%, #138496 100%)",
              color: "white",
              border: "none",
              borderRadius: 8,
              padding: "10px 20px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 14,
              transition: "all 0.2s ease",
              textTransform: "uppercase",
              letterSpacing: 0.5,
              boxShadow: "0 2px 4px rgba(23, 162, 184, 0.3)",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "linear-gradient(135deg, #138496 0%, #0f6674 100%)";
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 4px 8px rgba(23, 162, 184, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "linear-gradient(135deg, #17a2b8 0%, #138496 100%)";
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 2px 4px rgba(23, 162, 184, 0.3)";
            }}
          >
            📝 Thêm hàng Note
          </button>
          <button
            onClick={saveChanges}
            className="btn-save"
          >
            💾 Lưu
          </button>
        </div>
      )}

      <div style={{ overflowX: "auto" }}>
        <table className="enhanced-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <ColumnHeader
                  key={col.key}
                  column={col}
                  onDelete={(key) => {
                    setColumns(columns.filter(c => c.key !== key));
                    setData(data.map(item => {
                      const newItem = { ...item };
                      delete newItem[key];
                      return newItem;
                    }));
                  }}
                  isAdmin={isAdmin}
                />
              ))}
              {isAdmin && (
                <th
                  style={{
                    border: "1px solid #e2e8f0",
                    background: "#ffe08a",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  Thao tác
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {filteredData.map((row, idx) =>
              row.type === "note" ? (
                <tr key={idx} className="note-row">
                  <td
                    colSpan={isAdmin ? 6 : 5}
                    style={{
                      textAlign: "center",
                      padding: "16px",
                    }}
                  >
                    {isAdmin ? (
                      <input
                        value={row.note || ""}
                        onChange={(e) =>
                          handleChange(idx, "note", e.target.value)
                        }
                        style={{
                          width: "100%",
                          border: "none",
                          outline: "none",
                          background: "transparent",
                          textAlign: "center",
                          fontWeight: "bold",
                          color: "#234e52",
                          fontSize: "16px",
                        }}
                      />
                    ) : (
                      row.note
                    )}
                  </td>
                  {isAdmin && (
                    <td className="action-cell">
                      <button
                        onClick={() => deleteRow(idx)}
                        className="btn-delete"
                      >
                        ❌ Xóa
                      </button>
                    </td>
                  )}
                </tr>
              ) : (
                <tr key={idx}>
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      style={{
                        border: "1px solid #eee",
                        padding: "8px 10px",
                      }}
                    >
                      {isAdmin ? (
                        <input
                          type={col.type}
                          value={row[col.key] || ""}
                          onChange={(e) =>
                            handleChange(idx, col.key, e.target.value)
                          }
                          style={{
                            width: "100%",
                            border: "none",
                            outline: "none",
                            background: "transparent",
                          }}
                        />
                      ) : row[col.key] && row[col.key].startsWith("http") ? (
                        <a
                          href={row[col.key]}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: "#1a73e8",
                            textDecoration: "underline",
                          }}
                        >
                          {col.key === "mainLink"
                            ? "Link gốc"
                            : col.key === "googleDrive"
                            ? "Google Drive"
                            : col.key === "oneDrive"
                            ? "OneDrive"
                            : "Link"}
                        </a>
                      ) : (
                        row[col.key] || "-"
                      )}
                    </td>
                  ))}
                  {isAdmin && (
                    <td className="action-cell">
                      <button
                        onClick={() => deleteRow(idx)}
                        className="btn-delete"
                      >
                        ❌ Xóa
                      </button>
                    </td>
                  )}
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
