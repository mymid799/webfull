import React, { useEffect, useState } from "react";
import ColumnManager, { ColumnHeader, deleteColumn } from "../components/ColumnManager";
import UrlCell from "../components/UrlCell";
import SmartTextCell from "../components/SmartTextCell";
import AdminBitOptionsButton from "../components/AdminBitOptionsButton";
import BitOptionsDropdown from "../components/BitOptionsDropdown";
import "../styles/table.css";

export default function Tools() {
  const [data, setData] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Dynamic column management states
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
        category: 'tools'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const [columns, setColumns] = useState([
    { key: "toolName", label: "Tên Tool", type: "text" },
    { key: "mainLink", label: "Trang chủ / Link gốc", type: "url" },
    { key: "googleDrive", label: "Google Drive", type: "url" },
    { key: "ownCloud", label: "OwnCloud", type: "url" },
    { key: "note", label: "Note", type: "text" },
  ]);

  useEffect(() => {
    // Load dữ liệu và cấu hình cột từ database
    const loadData = async () => {
      try {
        console.log("📥 Loading Tools data from database...");
        const res = await fetch("http://localhost:5000/api/column-config/data/tools");
        const result = await res.json();
        
        console.log("📥 Load response:", result);
        
        if (res.ok && result.success) {
          console.log("📥 Loaded data:", result.data.data);
          setData(result.data.data || []);
          
          if (result.data.columnConfig && result.data.columnConfig.columns) {
            console.log("✅ Loaded column config from database:", result.data.columnConfig);
            setColumns(result.data.columnConfig.columns);
            // Lưu vào localStorage để backup
            localStorage.setItem(`column_config_tools`, JSON.stringify({ columns: result.data.columnConfig.columns }));
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
        const configKey = `column_config_tools`;
        const dataKey = `tools_data`;
        
        // Load dữ liệu từ localStorage
        const savedData = localStorage.getItem(dataKey);
        if (savedData) {
          const data = JSON.parse(savedData);
          console.log("📥 Loaded data from localStorage:", data);
          setData(data);
        }
        
        // Load cấu hình cột từ localStorage
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
            { key: "googleDrive", label: "Google Drive", type: "url" },
            { key: "ownCloud", label: "OwnCloud", type: "url" },
            { key: "note", label: "Note", type: "text" }
          ]);
        }
      } catch (err) {
        console.warn("⚠️ Error loading column config, using defaults:", err);
        setColumns([
          { key: "toolName", label: "Tên Tool", type: "text" },
          { key: "mainLink", label: "Trang chủ / Link gốc", type: "url" },
          { key: "googleDrive", label: "Google Drive", type: "url" },
          { key: "ownCloud", label: "OwnCloud", type: "url" },
          { key: "note", label: "Note", type: "text" }
        ]);
      }
    };

    loadData();

    // Check admin status
    const token = localStorage.getItem("token");
    if (token) {
      setIsAdmin(true);
    }
  }, []);

  // Add new row function
  const addRow = () => {
    // Tạo object mới với tất cả các trường cần thiết
    const newRow = {};
    
    // Thêm các trường cơ bản
    columns.forEach(col => {
      if (col.type === 'url') {
        newRow[`${col.key}32`] = "";
        newRow[`${col.key}64`] = "";
        newRow[`${col.key}Show`] = "both";
      } else {
        newRow[col.key] = "";
      }
    });

    setData([...data, newRow]);
    setShowAddRowModal(false);
  };

  // Add new column function
  const addColumn = () => {
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
    } else {
      // Nếu không phải URL, thêm trường thông thường
      const updatedData = data.map(row => ({
        ...row,
        [newKey]: ""
      }));
      setData(updatedData);
    }
    
    setNewColumnName("");
    setNewColumnType("text");
    setNewColumnBitOption("");
    setShowAddColumnModal(false);
    
    if (newColumnType === "url") {
      alert(`✅ Đã thêm cột ${newColumnName} với các ô input 32-bit, 64-bit và Show!`);
    }
  };

  // Save changes function
  const saveChanges = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("🔒 Bạn cần đăng nhập admin!");

    try {
      console.log("💾 Saving Tools data:", { category: "tools", data, columns });
      
      // Lưu cấu hình cột và dữ liệu
      const res = await fetch("http://localhost:5000/api/column-config/data/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          category: "tools",
          data: data,
          columnConfig: {
            columns: columns
          }
        }),
      });

      const result = await res.json();
      console.log("💾 Save response:", result);
      
      if (res.ok) {
        alert(result.message || "✅ Dữ liệu và cấu hình cột đã lưu!");
        // Lưu cấu hình cột vào localStorage
        localStorage.setItem(`column_config_tools`, JSON.stringify({ columns }));
        // Lưu dữ liệu vào localStorage để backup
        localStorage.setItem(`tools_data`, JSON.stringify(data));
      } else {
        alert(result.message || "❌ Lưu thất bại!");
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("⚠️ Lỗi khi gửi dữ liệu!");
    }
  };

  // Handle cell changes
  const handleChange = (idx, field, value) => {
    const newData = [...data];
    if (newData[idx]) {
      newData[idx][field] = value;
      setData(newData);
    }
  };

  // Delete row function
  const deleteRow = (idx) => {
    const newData = [...data];
    newData.splice(idx, 1);
    setData(newData);
  };

  // Filter data based on search term
  const filteredData = data.filter((row) =>
    Object.values(row).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );


  return (
    <div style={{ padding: "20px 40px" }}>
      <h2 style={{ color: "#b84e00", textAlign: "center" }}>
        TOOLS & UTILITIES
      </h2>

      {/* 🔍 Thanh tìm kiếm */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <input
          type="text"
          placeholder="🔍 Tìm kiếm Tools theo tên, link hoặc note..."
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
                  isAdmin={isAdmin}
                  isLoading={isLoading}
                />
              ))}
              {isAdmin && <th style={thStyle}>Thao tác</th>}
            </tr>
          </thead>

          <tbody>
            {filteredData.map((row, idx) => (
              <tr key={`tools-row-${idx}`}>
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

      {/* Add Column Modal */}
      {showAddColumnModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "white",
            padding: "30px",
            borderRadius: "8px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            minWidth: "400px"
          }}>
            <h3 style={{ marginBottom: "20px", color: "#333" }}>Thêm cột mới</h3>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                Tên cột:
              </label>
              <input
                type="text"
                value={newColumnName}
                onChange={(e) => setNewColumnName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "14px"
                }}
                placeholder="Nhập tên cột..."
              />
            </div>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                Loại cột:
              </label>
              <select
                value={newColumnType}
                onChange={(e) => setNewColumnType(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "14px"
                }}
              >
                <option value="text">Text</option>
                <option value="url">URL</option>
                <option value="number">Number</option>
                <option value="date">Date</option>
              </select>
            </div>
            {newColumnType === "url" && (
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                  Tùy chọn bit:
                </label>
                <BitOptionsDropdown
                  value={newColumnBitOption}
                  onChange={setNewColumnBitOption}
                />
              </div>
            )}
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button
                onClick={() => {
                  setShowAddColumnModal(false);
                  setNewColumnName("");
                  setNewColumnType("text");
                  setNewColumnBitOption("");
                }}
                style={{
                  padding: "8px 16px",
                  background: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                Hủy
              </button>
              <button
                onClick={addColumn}
                style={{
                  padding: "8px 16px",
                  background: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                Thêm cột
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Row Modal */}
      {showAddRowModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "white",
            padding: "30px",
            borderRadius: "8px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            minWidth: "400px"
          }}>
            <h3 style={{ marginBottom: "20px", color: "#333" }}>Thêm hàng mới</h3>
            <p style={{ marginBottom: "20px", color: "#666" }}>
              Thêm một hàng mới với các cột URL sẽ có cài đặt mặc định "Hiển cả hai".
            </p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowAddRowModal(false)}
                style={{
                  padding: "8px 16px",
                  background: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                Hủy
              </button>
              <button
                onClick={addRow}
                style={{
                  padding: "8px 16px",
                  background: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                Thêm hàng
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