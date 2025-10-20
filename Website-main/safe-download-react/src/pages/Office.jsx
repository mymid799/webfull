import React, { useEffect, useState } from "react";
import ColumnManager, { ColumnHeader, deleteColumn } from "../components/ColumnManager";
import UrlCell from "../components/UrlCell";
import "../styles/table.css";

export default function Office() {
  const [data, setData] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
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
        category: 'office'
      });
    } finally {
      setIsLoading(false);
    }
  }; // ✅ thêm state tìm kiếm
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
    fetch("http://localhost:5000/api/office")
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch(() => setData([]));

    // Load cấu hình cột từ database
    const loadColumnConfig = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/admin/columns/office", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const configData = await response.json();
          console.log("✅ Loaded column config from database:", configData);
          setColumns(configData);
        } else {
          // Fallback to localStorage
          const configKey = `column_config_office`;
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
        }
      } catch (err) {
        console.warn("⚠️ Error loading column config from database, trying localStorage:", err);
        // Fallback to localStorage
        try {
          const configKey = `column_config_office`;
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
        } catch (localErr) {
          console.warn("⚠️ Error loading column config, using defaults:", localErr);
          setColumns([
            { key: "version", label: "Version", type: "text" },
            { key: "edition", label: "Edition", type: "text" },
            { key: "fshare", label: "Fshare", type: "url" },
            { key: "drive", label: "Google Drive", type: "url" },
            { key: "oneDrive", label: "OneDrive", type: "url" },
            { key: "sha1", label: "SHA-1", type: "text" }
          ]);
        }
      }
    };
    
    loadColumnConfig();

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
        fshareCommon: "",
        fshareShow: "both",
        drive32: "",
        drive64: "",
        driveCommon: "",
        driveShow: "both",
        oneDrive32: "",
        oneDrive64: "",
        oneDriveCommon: "",
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
      const res = await fetch("http://localhost:5000/api/office/save", {
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

  // ✅ Lọc dữ liệu theo từ khóa tìm kiếm
  const filteredData = data.filter((row) =>
    Object.values(row).join(" ").toLowerCase().includes(searchTerm)
  );

  return (
    <div style={{ padding: "20px 40px" }}>
      <h2 style={{ color: "#b84e00", textAlign: "center" }}>
        MICROSOFT OFFICE
      </h2>

      {/* 🔍 Thanh tìm kiếm */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <input
          type="text"
          placeholder="🔍 Tìm kiếm Office theo Version, Edition hoặc SHA-1..."
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
            category="office"
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
                        type="office"
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
  const linkCommon = row[`${prefix}Common`];
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
        <input
          placeholder="Download chung"
          value={linkCommon || ""}
          onChange={(e) => handleChange(idx, `${prefix}Common`, e.target.value)}
          style={{ ...inputStyle, marginTop: 4 }}
        />

        {/* radio chọn hiển thị */}
        <div style={{ 
          fontSize: 10, 
          display: "flex", 
          flexDirection: "column", 
          gap: 0,
          marginTop: 4,
          padding: "4px 4px 4px 0",
          margin: 0,
          width: "100%",
          background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
          borderRadius: "4px",
          border: "1px solid #dee2e6",
          boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
        }}>
          <label style={{ 
            display: "flex", 
            alignItems: "center", 
            cursor: "pointer",
            margin: 0,
            padding: "2px 0",
            width: "100%",
            whiteSpace: "nowrap"
          }}>
            <input
              type="radio"
              name={`${prefix}Show-${idx}`}
              value="32"
              checked={show === "32"}
              onChange={() => handleChange(idx, showKey, "32")}
              style={{
                margin: 0,
                marginRight: 4,
                marginLeft: 0,
                transform: "scale(0.6)",
                accentColor: "#007bff",
                width: "12px",
                height: "12px"
              }}
            />
            <span style={{ 
              fontSize: "10px",
              fontWeight: show === "32" ? "700" : "500",
              color: show === "32" ? "#007bff" : "#6c757d",
              textShadow: show === "32" ? "0 1px 2px rgba(0,123,255,0.3)" : "none",
              transition: "all 0.2s ease",
              whiteSpace: "nowrap",
              flex: 1,
              lineHeight: "1.2"
            }}>
              Hiển 32-bit
            </span>
          </label>
          <label style={{ 
            display: "flex", 
            alignItems: "center", 
            cursor: "pointer",
            margin: 0,
            padding: "2px 0",
            width: "100%",
            whiteSpace: "nowrap"
          }}>
            <input
              type="radio"
              name={`${prefix}Show-${idx}`}
              value="64"
              checked={show === "64"}
              onChange={() => handleChange(idx, showKey, "64")}
              style={{
                margin: 0,
                marginRight: 4,
                marginLeft: 0,
                transform: "scale(0.6)",
                accentColor: "#007bff",
                width: "12px",
                height: "12px"
              }}
            />
            <span style={{ 
              fontSize: "10px",
              fontWeight: show === "64" ? "700" : "500",
              color: show === "64" ? "#007bff" : "#6c757d",
              textShadow: show === "64" ? "0 1px 2px rgba(0,123,255,0.3)" : "none",
              transition: "all 0.2s ease",
              whiteSpace: "nowrap",
              flex: 1,
              lineHeight: "1.2"
            }}>
              Hiển 64-bit
            </span>
          </label>
          <label style={{ 
            display: "flex", 
            alignItems: "center", 
            cursor: "pointer",
            margin: 0,
            padding: "2px 0",
            width: "100%",
            whiteSpace: "nowrap"
          }}>
            <input
              type="radio"
              name={`${prefix}Show-${idx}`}
              value="common"
              checked={show === "common"}
              onChange={() => handleChange(idx, showKey, "common")}
              style={{
                margin: 0,
                marginRight: 4,
                marginLeft: 0,
                transform: "scale(0.6)",
                accentColor: "#28a745",
                width: "12px",
                height: "12px"
              }}
            />
            <span style={{ 
              fontSize: "10px",
              fontWeight: show === "common" ? "700" : "500",
              color: show === "common" ? "#28a745" : "#6c757d",
              textShadow: show === "common" ? "0 1px 2px rgba(40,167,69,0.3)" : "none",
              transition: "all 0.2s ease",
              whiteSpace: "nowrap",
              flex: 1,
              lineHeight: "1.2"
            }}>
              Download chung
            </span>
          </label>
          <label style={{ 
            display: "flex", 
            alignItems: "center", 
            cursor: "pointer",
            margin: 0,
            padding: "2px 0",
            width: "100%",
            whiteSpace: "nowrap"
          }}>
            <input
              type="radio"
              name={`${prefix}Show-${idx}`}
              value="both"
              checked={show === "both"}
              onChange={() => handleChange(idx, showKey, "both")}
              style={{
                margin: 0,
                marginRight: 4,
                marginLeft: 0,
                transform: "scale(0.6)",
                accentColor: "#007bff",
                width: "12px",
                height: "12px"
              }}
            />
            <span style={{ 
              fontSize: "13px",
              fontWeight: show === "both" ? "600" : "400",
              color: show === "both" ? "#007bff" : "#495057"
            }}>
              Hiển cả hai
            </span>
          </label>
          <label style={{ 
            display: "flex", 
            alignItems: "center", 
            cursor: "pointer",
            margin: 0,
            padding: "2px 0",
            width: "100%",
            whiteSpace: "nowrap"
          }}>
            <input
              type="radio"
              name={`${prefix}Show-${idx}`}
              value="none"
              checked={show === "none"}
              onChange={() => handleChange(idx, showKey, "none")}
              style={{
                margin: 0,
                marginRight: 4,
                marginLeft: 0,
                transform: "scale(0.6)",
                accentColor: "#dc3545",
                width: "12px",
                height: "12px"
              }}
            />
            <span style={{ 
              fontSize: "10px",
              fontWeight: show === "none" ? "700" : "500",
              color: show === "none" ? "#dc3545" : "#6c757d",
              textShadow: show === "none" ? "0 1px 2px rgba(220,53,69,0.3)" : "none",
              transition: "all 0.2s ease",
              whiteSpace: "nowrap",
              flex: 1,
              lineHeight: "1.2"
            }}>
              Ẩn
            </span>
          </label>
        </div>
      </div>
    );
  }

  if (show === "none") return "-";

  const links = [];
  if ((show === "32" || show === "both") && link32)
    links.push({ url: link32, label: getLabel(prefix, "32") });
  if ((show === "64" || show === "both") && link64)
    links.push({ url: link64, label: getLabel(prefix, "64") });
  if (show === "common" && linkCommon)
    links.push({ url: linkCommon, label: getLabel(prefix, "Download chung") });

  if (links.length === 0) return "-";

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {links.map((l, i) => (
        <a key={i} href={l.url} target="_blank" rel="noreferrer">
          {l.label}
        </a>
      ))}
    </div>
  );
};

const getLabel = (prefix, type) => {
  if (type === "Download chung")
    return "Download chung";
  return `${type}-bit`;
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
