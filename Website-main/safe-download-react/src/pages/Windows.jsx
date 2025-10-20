import React, { useEffect, useState } from "react";
import ColumnManager, { ColumnHeader, deleteColumn } from "../components/ColumnManager";
import UrlCell from "../components/UrlCell";
import SmartTextCell from "../components/SmartTextCell";
import AdminBitOptionsButton from "../components/AdminBitOptionsButton";
import BitOptionsDropdown from "../components/BitOptionsDropdown";
import "../styles/table.css";

export default function Windows() {
  const [data, setData] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // ✅ thêm state tìm kiếm
  const [isLoading, setIsLoading] = useState(false);
  const [showAddColumnModal, setShowAddColumnModal] = useState(false);
  const [showAddRowModal, setShowAddRowModal] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");
  const [newColumnType, setNewColumnType] = useState("text");
  const [newColumnBitOption, setNewColumnBitOption] = useState("");
  
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

  // Handle column label editing
  const handleEditColumn = (columnKey, newLabel) => {
    const updatedColumns = columns.map(col => 
      col.key === columnKey ? { ...col, label: newLabel } : col
    );
    setColumns(updatedColumns);
    
    // Save to localStorage as backup
    localStorage.setItem(`column_config_windows`, JSON.stringify({ columns: updatedColumns }));
    
    console.log(`✅ Column "${columnKey}" renamed to "${newLabel}"`);
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
    // Load dữ liệu và cấu hình cột từ database
    const loadData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/column-config/data/windows");
        const result = await res.json();
        
        if (res.ok && result.success) {
          setData(result.data.data || []);
          
          if (result.data.columnConfig && result.data.columnConfig.columns) {
            console.log("✅ Loaded column config from database:", result.data.columnConfig);
            setColumns(result.data.columnConfig.columns);
            // Lưu vào localStorage để backup
            localStorage.setItem(`column_config_windows`, JSON.stringify({ columns: result.data.columnConfig.columns }));
          } else {
            // Fallback: load từ localStorage
            loadFromLocalStorage();
          }
        } else {
          // Fallback: load từ localStorage
          loadFromLocalStorage();
        }
      } catch (error) {
        console.warn("⚠️ Error loading from database, using localStorage:", error);
        loadFromLocalStorage();
      }
    };

    const loadFromLocalStorage = () => {
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
    };

    loadData();

    if (localStorage.getItem("token")) setIsAdmin(true);
  }, []);

  const addRow = () => {
    // Tạo object mới với tất cả các trường cần thiết
    const newRow = {
      version: "",
      edition: "",
      sha1: "",
    };

    // Thêm các trường 32-bit, 64-bit và Show cho tất cả cột URL
    columns.forEach(col => {
      if (col.type === 'url') {
        newRow[`${col.key}32`] = "";
        newRow[`${col.key}64`] = "";
        newRow[`${col.key}Show`] = "both";
      }
    });

    setData([...data, newRow]);
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
      // Lưu cấu hình cột và dữ liệu
      const res = await fetch("http://localhost:5000/api/column-config/data/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          category: "windows",
          data: data,
          columnConfig: {
            columns: columns
          }
        }),
      });

      const result = await res.json();
      if (res.ok) {
        alert(result.message || "✅ Dữ liệu và cấu hình cột đã lưu!");
        // Lưu cấu hình cột vào localStorage
        localStorage.setItem(`column_config_windows`, JSON.stringify({ columns }));
      } else {
        alert(result.message || "❌ Lưu thất bại!");
      }
    } catch (error) {
      console.error("Save error:", error);
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
          <AdminBitOptionsButton 
            onOptionSelect={(option) => {
              console.log('Selected bit option:', option);
              alert(`Đã chọn: ${option.label}\nMô tả: ${option.description}`);
            }}
          />
          
          <button
            onClick={() => setShowAddColumnModal(true)}
            className="btn-add-column"
            style={{
              background: "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "10px 16px",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "all 0.3s ease",
              boxShadow: "0 2px 4px rgba(40, 167, 69, 0.3)",
              minWidth: "120px",
              justifyContent: "center"
            }}
            onMouseOver={(e) => {
              e.target.style.transform = "translateY(-1px)";
              e.target.style.boxShadow = "0 4px 8px rgba(40, 167, 69, 0.4)";
            }}
            onMouseOut={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 2px 4px rgba(40, 167, 69, 0.3)";
            }}
          >
            ➕ THÊM CỘT
          </button>
          
          <button
            onClick={() => setShowAddRowModal(true)}
            className="btn-add-row"
            style={{
              background: "linear-gradient(135deg, #007bff 0%, #6610f2 100%)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "10px 16px",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "all 0.3s ease",
              boxShadow: "0 2px 4px rgba(0, 123, 255, 0.3)",
              minWidth: "120px",
              justifyContent: "center"
            }}
            onMouseOver={(e) => {
              e.target.style.transform = "translateY(-1px)";
              e.target.style.boxShadow = "0 4px 8px rgba(0, 123, 255, 0.4)";
            }}
            onMouseOut={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 2px 4px rgba(0, 123, 255, 0.3)";
            }}
          >
            ➕ THÊM HÀNG
          </button>
          
          <button
            onClick={saveChanges}
            className="btn-save"
            style={{
              background: "linear-gradient(135deg, #6f42c1 0%, #e83e8c 100%)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "10px 16px",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "all 0.3s ease",
              boxShadow: "0 2px 4px rgba(111, 66, 193, 0.3)",
              minWidth: "120px",
              justifyContent: "center"
            }}
            onMouseOver={(e) => {
              e.target.style.transform = "translateY(-1px)";
              e.target.style.boxShadow = "0 4px 8px rgba(111, 66, 193, 0.4)";
            }}
            onMouseOut={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 2px 4px rgba(111, 66, 193, 0.3)";
            }}
          >
            💾 LƯU
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
                  onEdit={handleEditColumn}
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
                    {col.type === 'url' ? (
                      <UrlCell
                        isAdmin={isAdmin}
                        row={row}
                        idx={idx}
                        type={col.key}
                        columnKey={col.key}
                        handleChange={handleChange}
                      />
                    ) : (
                      <SmartTextCell
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

      {/* Modal thêm cột */}
      {showAddColumnModal && (
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
            background: "#fff",
            padding: "24px",
            borderRadius: "12px",
            minWidth: "400px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          }}>
            <h3 style={{ textAlign: "center", marginBottom: "20px" }}>
              ➕ Thêm cột mới
            </h3>
            
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "4px", fontWeight: "bold" }}>
                Tên cột:
              </label>
              <input
                type="text"
                placeholder="Nhập tên cột"
                value={newColumnName}
                onChange={(e) => setNewColumnName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
            </div>
            
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "4px", fontWeight: "bold" }}>
                Loại dữ liệu:
              </label>
              <select
                value={newColumnType}
                onChange={(e) => {
                  setNewColumnType(e.target.value);
                  if (e.target.value !== "url") {
                    setNewColumnBitOption("");
                  }
                }}
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              >
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="email">Email</option>
                <option value="url">URL</option>
              </select>
            </div>

            {newColumnType === "url" && (
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "4px", fontWeight: "bold" }}>
                  🎛️ Tùy chọn hiển thị Bit:
                </label>
                <BitOptionsDropdown
                  value={newColumnBitOption}
                  onChange={setNewColumnBitOption}
                  placeholder="Chọn tùy chọn hiển thị cho cột URL"
                />
                <div style={{
                  fontSize: "11px",
                  color: "#6c757d",
                  marginTop: "4px",
                  fontStyle: "italic"
                }}>
                  💡 Tùy chọn này sẽ áp dụng cho cách hiển thị các link 32-bit/64-bit
                </div>
              </div>
            )}
            
            <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
              <button
                onClick={() => {
                  if (!newColumnName.trim()) return;
                  
                  const newKey = newColumnName.toLowerCase().replace(/\s+/g, '_');
                  const newColumn = {
                    key: newKey,
                    label: newColumnName,
                    type: newColumnType,
                    ...(newColumnType === "url" && newColumnBitOption && {
                      bitOption: newColumnBitOption
                    })
                  };
                  
                  setColumns([...columns, newColumn]);
                  
                  // Nếu là cột URL, thêm các trường 32-bit, 64-bit và Show vào tất cả hàng hiện có
                  if (newColumnType === "url") {
                    const updatedData = data.map(row => ({
                      ...row,
                      [`${newKey}32`]: "",
                      [`${newKey}64`]: "",
                      [`${newKey}Show`]: "both"
                    }));
                    setData(updatedData);
                  }
                  
                  setNewColumnName("");
                  setNewColumnType("text");
                  setNewColumnBitOption("");
                  setShowAddColumnModal(false);
                  
                  if (newColumnType === "url") {
                    alert(`✅ Đã thêm cột ${newColumnName} với các ô input 32-bit và 64-bit!`);
                  }
                }}
                style={{
                  flex: 1,
                  padding: "10px 16px",
                  background: "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "bold"
                }}
              >
                ✅ Thêm cột
              </button>
              <button
                onClick={() => {
                  setShowAddColumnModal(false);
                  setNewColumnName("");
                  setNewColumnType("text");
                  setNewColumnBitOption("");
                }}
                style={{
                  flex: 1,
                  padding: "10px 16px",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  background: "#fafafa",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "bold"
                }}
              >
                ❌ Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal thêm hàng */}
      {showAddRowModal && (
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
            background: "#fff",
            padding: "24px",
            borderRadius: "12px",
            minWidth: "400px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          }}>
            <h3 style={{ textAlign: "center", marginBottom: "20px" }}>
              ➕ Thêm hàng mới
            </h3>
            
            <div style={{ marginBottom: "20px", textAlign: "center" }}>
              <p style={{ color: "#666", marginBottom: "16px" }}>
                Bạn có muốn thêm một hàng mới vào bảng không?
              </p>
              <div style={{
                background: "#f8f9fa",
                padding: "12px",
                borderRadius: "6px",
                border: "1px solid #dee2e6"
              }}>
                <strong>Thông tin hàng mới:</strong>
                <ul style={{ margin: "8px 0", paddingLeft: "20px" }}>
                  <li>Version: (trống)</li>
                  <li>Edition: (trống)</li>
                  {columns.filter(col => col.type === 'url').map(col => (
                    <li key={col.key}>{col.label}: Hiển cả hai (32-bit + 64-bit)</li>
                  ))}
                  <li>SHA-1: (trống)</li>
                </ul>
              </div>
            </div>
            
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => {
                  addRow();
                  setShowAddRowModal(false);
                  alert("✅ Đã thêm hàng mới!");
                }}
                style={{
                  flex: 1,
                  padding: "10px 16px",
                  background: "linear-gradient(135deg, #007bff 0%, #6610f2 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "bold"
                }}
              >
                ✅ Thêm hàng
              </button>
              <button
                onClick={() => setShowAddRowModal(false)}
                style={{
                  flex: 1,
                  padding: "10px 16px",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  background: "#fafafa",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "bold"
                }}
              >
                ❌ Hủy
              </button>
            </div>
          </div>
        </div>
      )}
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
      <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "8px" }}>
        {/* Input fields for 32-bit and 64-bit */}
        <div style={{ display: "flex", gap: 8, marginBottom: 4 }}>
          <div style={{ flex: 1 }}>
            <label style={{ 
              display: "block", 
              fontSize: "11px", 
              fontWeight: "600", 
              color: "#007bff", 
              marginBottom: "2px" 
            }}>
              32-bit
            </label>
            <input
              placeholder="Nhập link 32-bit..."
              value={link32 || ""}
              onChange={(e) => handleChange(idx, `${prefix}32`, e.target.value)}
              style={{
                width: "100%",
                padding: "6px 8px",
                border: "2px solid #e9ecef",
                borderRadius: "6px",
                fontSize: "12px",
                background: "#fff",
                transition: "all 0.2s ease",
                outline: "none"
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#007bff";
                e.target.style.boxShadow = "0 0 0 2px rgba(0, 123, 255, 0.25)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e9ecef";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ 
              display: "block", 
              fontSize: "11px", 
              fontWeight: "600", 
              color: "#007bff", 
              marginBottom: "2px" 
            }}>
              64-bit
            </label>
            <input
              placeholder="Nhập link 64-bit..."
              value={link64 || ""}
              onChange={(e) => handleChange(idx, `${prefix}64`, e.target.value)}
              style={{
                width: "100%",
                padding: "6px 8px",
                border: "2px solid #e9ecef",
                borderRadius: "6px",
                fontSize: "12px",
                background: "#fff",
                transition: "all 0.2s ease",
                outline: "none"
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#007bff";
                e.target.style.boxShadow = "0 0 0 2px rgba(0, 123, 255, 0.25)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e9ecef";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>
        </div>

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
              fontSize: "10px",
              fontWeight: show === "both" ? "700" : "500",
              color: show === "both" ? "#007bff" : "#6c757d",
              textShadow: show === "both" ? "0 1px 2px rgba(0,123,255,0.3)" : "none",
              transition: "all 0.2s ease",
              whiteSpace: "nowrap",
              flex: 1,
              lineHeight: "1.2"
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
  } else {
    // Hiển thị cho user thường
    if (show === "32" && link32) {
      return <a href={link32} target="_blank" rel="noopener noreferrer">32-bit</a>;
    } else if (show === "64" && link64) {
      return <a href={link64} target="_blank" rel="noopener noreferrer">64-bit</a>;
    } else if (show === "both") {
      return (
        <div>
          {link32 && <a href={link32} target="_blank" rel="noopener noreferrer">32-bit</a>}
          {link32 && link64 && <br />}
          {link64 && <a href={link64} target="_blank" rel="noopener noreferrer">64-bit</a>}
        </div>
      );
    } else {
      return "-";
    }
  }
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
