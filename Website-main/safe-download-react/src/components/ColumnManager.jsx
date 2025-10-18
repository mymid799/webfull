import React, { useState } from "react";

export default function ColumnManager({ 
  columns, 
  setColumns, 
  data, 
  setData, 
  isAdmin,
  category 
}) {
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");
  const [newColumnType, setNewColumnType] = useState("text");

  // Thêm cột mới
  const addColumn = async () => {
    if (!newColumnName.trim()) return;
    
    const newKey = newColumnName.toLowerCase().replace(/\s+/g, '_');
    const newColumn = {
      key: newKey,
      label: newColumnName,
      type: newColumnType
    };
    
    const updatedColumns = [...columns, newColumn];
    setColumns(updatedColumns);
    
    // Lưu cấu hình cột vào backend
    try {
      await fetch("http://localhost:5000/api/admin/columns/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          category, 
          columns: updatedColumns 
        }),
      });
    } catch (err) {
      console.error("Lỗi khi lưu cấu hình cột:", err);
    }
    
    setNewColumnName("");
    setNewColumnType("text");
    setShowColumnModal(false);
  };

  // Xóa cột
  const deleteColumn = async (columnKey) => {
    if (columns.length <= 1) {
      alert("Không thể xóa cột cuối cùng!");
      return;
    }
    
    const updatedColumns = columns.filter(col => col.key !== columnKey);
    setColumns(updatedColumns);
    
    const updatedData = data.map(item => {
      const newItem = { ...item };
      delete newItem[columnKey];
      return newItem;
    });
    setData(updatedData);
    
    // Lưu cấu hình cột vào backend
    try {
      await fetch("http://localhost:5000/api/admin/columns/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          category, 
          columns: updatedColumns 
        }),
      });
    } catch (err) {
      console.error("Lỗi khi lưu cấu hình cột:", err);
    }
  };

  return (
    <>
      {/* Nút thêm cột */}
      {isAdmin && (
        <button 
          onClick={() => setShowColumnModal(true)}
          style={{
            padding: "8px 16px",
            background: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginRight: "10px"
          }}
        >
          ➕ Thêm cột
        </button>
      )}

      {/* Modal thêm cột */}
      {showColumnModal && (
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
              padding: 24,
              borderRadius: 12,
              minWidth: 300,
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}
          >
            <h3 style={{ textAlign: "center", marginBottom: 15 }}>
              ➕ Thêm cột mới
            </h3>
            
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "block", marginBottom: 4 }}>Tên cột:</label>
              <input
                type="text"
                placeholder="Nhập tên cột"
                value={newColumnName}
                onChange={(e) => setNewColumnName(e.target.value)}
                style={{
                  width: "100%",
                  padding: 8,
                  border: "1px solid #ccc",
                  borderRadius: 4,
                }}
              />
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", marginBottom: 4 }}>Loại dữ liệu:</label>
              <select
                value={newColumnType}
                onChange={(e) => setNewColumnType(e.target.value)}
                style={{
                  width: "100%",
                  padding: 8,
                  border: "1px solid #ccc",
                  borderRadius: 4,
                }}
              >
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="email">Email</option>
                <option value="url">URL</option>
              </select>
            </div>
            
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={addColumn}
                style={{
                  flex: 1,
                  padding: 8,
                  background: "#28a745",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                }}
              >
                Thêm cột
              </button>
              <button
                onClick={() => {
                  setShowColumnModal(false);
                  setNewColumnName("");
                  setNewColumnType("text");
                }}
                style={{
                  flex: 1,
                  padding: 8,
                  border: "1px solid #ccc",
                  borderRadius: 4,
                  background: "#fafafa",
                  cursor: "pointer",
                }}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Component để render header với nút xóa cột
export function ColumnHeader({ column, onDelete, isAdmin }) {
  return (
    <th className="column-header">
      {column.label}
      {isAdmin && (
        <button
          onClick={() => onDelete(column.key)}
          className="column-delete-btn"
          title="Xóa cột"
        >
          ✕
        </button>
      )}
    </th>
  );
}
