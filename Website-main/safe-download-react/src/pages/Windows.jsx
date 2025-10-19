import React, { useEffect, useState } from "react";
import ColumnManager, { ColumnHeader, deleteColumn } from "../components/ColumnManager";
import UrlCell from "../components/UrlCell";
import "../styles/table.css";

export default function Windows() {
  const [data, setData] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // ✅ thêm state tìm kiếm
  const [isLoading, setIsLoading] = useState(false);
  
  // Wrapper function for optimized column deletion
  const handleDeleteColumn = async (columnKey) => {
    setIsLoading(true);
    try {
      await deleteColumn(columnKey, {
        columns,
        setColumns,
        data,
        setData,
        category: 'windows'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const [columns, setColumns] = useState([
    { key: "version", label: "Version", type: "text" },
    { key: "edition", label: "Edition", type: "text" },
    { key: "fshare", label: "Fshare", type: "url" },
    { key: "drive", label: "Google Drive", type: "url" },
    { key: "oneDrive", label: "OneDrive", type: "url" },
    { key: "sha1", label: "SHA-1", type: "text" }
  ]);

  useEffect(() => {
    // Load dữ liệu
    fetch("http://localhost:5000/api/windows")
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch(() => setData([]));

    // Load cấu hình cột từ localStorage
    try {
      const configKey = `column_config_windows`;
      const savedConfig = localStorage.getItem(configKey);
      
      if (savedConfig) {
        const configData = JSON.parse(savedConfig);
        console.log("✅ Loaded column config from localStorage:", configData);
        setColumns(configData.columns);
      } else {
        console.log("📋 No saved config found, using defaults");
        setColumns([
          { key: "version", label: "Version", type: "text" },
          { key: "edition", label: "Edition", type: "text" },
          { key: "fshare", label: "Fshare", type: "url" },
          { key: "drive", label: "Google Drive", type: "url" },
          { key: "oneDrive", label: "OneDrive", type: "url" },
          { key: "sha1", label: "SHA-1", type: "text" }
        ]);
      }
    } catch (err) {
      console.warn("⚠️ Error loading column config, using defaults:", err);
      setColumns([
        { key: "version", label: "Version", type: "text" },
        { key: "edition", label: "Edition", type: "text" },
        { key: "fshare", label: "Fshare", type: "url" },
        { key: "drive", label: "Google Drive", type: "url" },
        { key: "oneDrive", label: "OneDrive", type: "url" },
        { key: "sha1", label: "SHA-1", type: "text" }
      ]);
    }

    if (localStorage.getItem("token")) setIsAdmin(true);
  }, []);

  const addRow = () => {
    setData([
      ...data,
      {
        version: "",
        edition: "",
        fshare32: "",
        fshare64: "",
        fshareShow: "both",
        drive32: "",
        drive64: "",
        driveShow: "both",
        oneDrive32: "",
        oneDrive64: "",
        oneDriveShow: "both",
        sha1: "",
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
      const res = await fetch("http://localhost:5000/api/windows/save", {
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
    } catch {
      alert("⚠️ Lỗi khi gửi dữ liệu!");
    }
  };

  // ✅ Lọc dữ liệu theo từ khóa
  const filteredData = data.filter((row) =>
    Object.values(row).join(" ").toLowerCase().includes(searchTerm)
  );

  return (
    <div style={{ padding: "20px 40px" }}>
      <h2 style={{ color: "#b84e00", textAlign: "center" }}>
        MICROSOFT WINDOWS
      </h2>

      {/* 🔍 Thanh tìm kiếm */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <input
          type="text"
          placeholder="🔍 Tìm kiếm Windows theo Version, Edition hoặc SHA-1..."
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
            category="windows"
            isLoading={isLoading}
          />
          <button
            onClick={addRow}
            className="btn-add"
          >
            ➕ Thêm hàng
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
                  onDelete={handleDeleteColumn}
                  isAdmin={isAdmin}
                  isLoading={isLoading}
                />
              ))}
              {isAdmin && <th style={thStyle}>Thao tác</th>}
            </tr>
          </thead>

          <tbody>
            {filteredData.map((row, idx) => (
              <tr key={idx}>
                {columns.map((col) => (
                  <td key={col.key} style={tdStyle}>
                    {col.key === "fshare" || col.key === "drive" || col.key === "oneDrive" ? (
                      <LinkCell
                        isAdmin={isAdmin}
                        row={row}
                        idx={idx}
                        type={col.key}
                        handleChange={handleChange}
                      />
                    ) : col.type === 'url' && col.bitOptions ? (
                      <UrlCell
                        isAdmin={isAdmin}
                        row={row}
                        idx={idx}
                        type="windows"
                        handleChange={handleChange}
                        columnKey={col.key}
                      />
                    ) : (
                      <EditableCell
                        isAdmin={isAdmin}
                        value={row[col.key]}
                        onChange={(v) => handleChange(idx, col.key, v)}
                      />
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const EditableCell = ({ isAdmin, value, onChange }) =>
  isAdmin ? (
    <input
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: "100%",
        border: "none",
        outline: "none",
        background: "transparent",
      }}
    />
  ) : (
    value || "-"
  );

const LinkCell = ({ isAdmin, row, idx, type, handleChange }) => {
  const prefix = type;
  const showKey = `${prefix}Show`;
  const link32 = row[`${prefix}32`];
  const link64 = row[`${prefix}64`];
  const show = row[showKey];

  if (isAdmin) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ display: "flex", gap: 6 }}>
          <input
            placeholder="32-bit"
            value={link32 || ""}
            onChange={(e) => handleChange(idx, `${prefix}32`, e.target.value)}
            style={{ ...inputStyle, flex: 1 }}
          />
          <input
            placeholder="64-bit"
            value={link64 || ""}
            onChange={(e) => handleChange(idx, `${prefix}64`, e.target.value)}
            style={{ ...inputStyle, flex: 1 }}
          />
        </div>

        {/* radio chọn hiển thị */}
        <div style={{ fontSize: 13 }}>
          <label>
            <input
              type="radio"
              name={`${prefix}Show-${idx}`}
              value="32"
              checked={show === "32"}
              onChange={() => handleChange(idx, showKey, "32")}
            />{" "}
            Hiển 32-bit
          </label>
          <label style={{ marginLeft: 10 }}>
            <input
              type="radio"
              name={`${prefix}Show-${idx}`}
              value="64"
              checked={show === "64"}
              onChange={() => handleChange(idx, showKey, "64")}
            />{" "}
            Hiển 64-bit
          </label>
          <label style={{ marginLeft: 10 }}>
            <input
              type="radio"
              name={`${prefix}Show-${idx}`}
              value="both"
              checked={show === "both"}
              onChange={() => handleChange(idx, showKey, "both")}
            />{" "}
            Hiển cả hai
          </label>
          <label style={{ marginLeft: 10 }}>
            <input
              type="radio"
              name={`${prefix}Show-${idx}`}
              value="none"
              checked={show === "none"}
              onChange={() => handleChange(idx, showKey, "none")}
            />{" "}
            Ẩn
          </label>
        </div>
      </div>
    );
  }

  // Người dùng thường
  if (show === "32" && link32)
    return (
      <a href={link32} target="_blank" rel="noreferrer">
        {prefix === "fshare"
          ? "Fshare (32-bit)"
          : prefix === "drive"
          ? "Google Drive (32-bit)"
          : "OneDrive (32-bit)"}
      </a>
    );
  if (show === "64" && link64)
    return (
      <a href={link64} target="_blank" rel="noreferrer">
        {prefix === "fshare"
          ? "Fshare (64-bit)"
          : prefix === "drive"
          ? "Google Drive (64-bit)"
          : "OneDrive (64-bit)"}
      </a>
    );
  if (show === "both")
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        {link32 && (
          <a href={link32} target="_blank" rel="noreferrer">
            {prefix === "fshare"
              ? "Fshare (32-bit)"
              : prefix === "drive"
              ? "Google Drive (32-bit)"
              : "OneDrive (32-bit)"}
          </a>
        )}
        {link64 && (
          <a href={link64} target="_blank" rel="noreferrer">
            {prefix === "fshare"
              ? "Fshare (64-bit)"
              : prefix === "drive"
              ? "Google Drive (64-bit)"
              : "OneDrive (64-bit)"}
          </a>
        )}
      </div>
    );
  return "-";
};

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
const inputStyle = {
  width: "100%",
  border: "1px solid #ddd",
  borderRadius: 4,
  padding: "4px 6px",
};
