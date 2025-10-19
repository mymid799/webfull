import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function AdminPanel() {
  const [data, setData] = useState([]);
  const [category, setCategory] = useState("windows");
  const [newItem, setNewItem] = useState({
    version: "",
    edition: "",
    sha1: "",
  });
  const [editingCell, setEditingCell] = useState(null); // {rowId, field}
  const [editingValue, setEditingValue] = useState("");
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");
  const [newColumnType, setNewColumnType] = useState("text");
  const [columns, setColumns] = useState([
    { key: "version", label: "Version", type: "text" },
    { key: "edition", label: "Edition", type: "text" },
    { key: "sha1", label: "SHA-1", type: "text" }
  ]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/admin/${category}`)
      .then((res) => res.json())
      .then(setData);
  }, [category]);

  const addRow = async () => {
    const res = await fetch("http://localhost:5000/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newItem, category }),
    });
    const result = await res.json();
    setData([...data, result]);
  };

  const deleteRow = async (id) => {
    await fetch(`http://localhost:5000/api/admin/${id}`, { method: "DELETE" });
    setData(data.filter((d) => d._id !== id));
  };

  // Chỉnh sửa cell
  const startEdit = (rowId, field, currentValue) => {
    setEditingCell({ rowId, field });
    setEditingValue(currentValue || "");
  };

  const saveEdit = async () => {
    if (!editingCell) return;
    
    try {
      const res = await fetch(`http://localhost:5000/api/admin/${editingCell.rowId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [editingCell.field]: editingValue }),
      });
      
      if (res.ok) {
        setData(data.map(item => 
          item._id === editingCell.rowId 
            ? { ...item, [editingCell.field]: editingValue }
            : item
        ));
      }
    } catch {
      alert("Lỗi khi cập nhật dữ liệu!");
    }
    
    setEditingCell(null);
    setEditingValue("");
  };

  const cancelEdit = () => {
    setEditingCell(null);
    setEditingValue("");
  };

  // Thêm cột mới
  const addColumn = () => {
    if (!newColumnName.trim()) return;
    
    const newKey = newColumnName.toLowerCase().replace(/\s+/g, '_');
    const newColumn = {
      key: newKey,
      label: newColumnName,
      type: newColumnType
    };
    
    setColumns([...columns, newColumn]);
    setNewColumnName("");
    setNewColumnType("text");
    setShowColumnModal(false);
  };

  // Xóa cột
  const deleteColumn = (columnKey) => {
    if (columns.length <= 1) {
      alert("Không thể xóa cột cuối cùng!");
      return;
    }
    
    setColumns(columns.filter(col => col.key !== columnKey));
    setData(data.map(item => {
      const newItem = { ...item };
      delete newItem[columnKey];
      return newItem;
    }));
  };

  return (
    <div style={{ maxWidth: 1200, margin: "40px auto", padding: "0 20px" }}>
      <h2>Admin Control Panel</h2>
      
      {/* Quick Links */}
      <div style={{ 
        marginBottom: 20, 
        padding: "15px", 
        background: "#f8f9fa", 
        borderRadius: "8px",
        border: "1px solid #e9ecef"
      }}>
        <h3 style={{ margin: "0 0 10px 0", color: "#495057" }}>🔗 Liên kết nhanh</h3>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <Link 
            to="/admin-feedback"
            style={{
              display: "inline-block",
              padding: "8px 16px",
              background: "#007bff",
              color: "white",
              textDecoration: "none",
              borderRadius: "5px",
              fontSize: "14px",
              fontWeight: "bold"
            }}
          >
            📊 Quản lý phản hồi
          </Link>
          <Link 
            to="/report"
            style={{
              display: "inline-block",
              padding: "8px 16px",
              background: "#28a745",
              color: "white",
              textDecoration: "none",
              borderRadius: "5px",
              fontSize: "14px",
              fontWeight: "bold"
            }}
          >
            📝 Trang báo cáo
          </Link>
          <Link 
            to="/virustotal-scan"
            style={{
              display: "inline-block",
              padding: "8px 16px",
              background: "#dc3545",
              color: "white",
              textDecoration: "none",
              borderRadius: "5px",
              fontSize: "14px",
              fontWeight: "bold"
            }}
          >
            🔍 Quét Link VirusTotal
          </Link>
        </div>
      </div>
      
      {/* Controls */}
      <div style={{ marginBottom: 20, display: "flex", gap: 10, alignItems: "center" }}>
        <select onChange={(e) => setCategory(e.target.value)} value={category}>
          <option value="windows">Windows</option>
          <option value="office">Office</option>
          <option value="tools">Tools</option>
          <option value="antivirus">Antivirus</option>
        </select>
        
        <button 
          onClick={() => setShowColumnModal(true)}
          style={{
            padding: "8px 16px",
            background: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          ➕ Thêm cột
        </button>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table border="1" width="100%" cellPadding="6" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8f9fa" }}>
              {columns.map((col) => (
                <th key={col.key} style={{ position: "relative", padding: "12px 8px" }}>
                  {col.label}
                  <button
                    onClick={() => deleteColumn(col.key)}
                    style={{
                      position: "absolute",
                      top: "2px",
                      right: "2px",
                      background: "none",
                      border: "none",
                      color: "#dc3545",
                      cursor: "pointer",
                      fontSize: "12px"
                    }}
                    title="Xóa cột"
                  >
                    ✕
                  </button>
                </th>
              ))}
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d._id}>
                {columns.map((col) => (
                  <td key={col.key} style={{ padding: "8px" }}>
                    {editingCell?.rowId === d._id && editingCell?.field === col.key ? (
                      <div style={{ display: "flex", gap: "4px" }}>
                        <input
                          type={col.type}
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                          style={{ flex: 1, padding: "4px" }}
                          autoFocus
                        />
                        <button onClick={saveEdit} style={{ padding: "2px 6px", fontSize: "12px" }}>✓</button>
                        <button onClick={cancelEdit} style={{ padding: "2px 6px", fontSize: "12px" }}>✕</button>
                      </div>
                    ) : (
                      <span
                        onClick={() => startEdit(d._id, col.key, d[col.key])}
                        style={{ cursor: "pointer", display: "block", minHeight: "20px" }}
                        title="Click để chỉnh sửa"
                      >
                        {d[col.key] || "-"}
                      </span>
                    )}
                  </td>
                ))}
                <td>
                  <button 
                    onClick={() => deleteRow(d._id)}
                    style={{
                      padding: "4px 8px",
                      background: "#dc3545",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer"
                    }}
                  >
                    ❌ Xóa
                  </button>
                </td>
              </tr>
            ))}
            
            {/* Add new row */}
            <tr>
              {columns.map((col) => (
                <td key={col.key}>
                  <input
                    type={col.type}
                    placeholder={col.label}
                    onChange={(e) =>
                      setNewItem({ ...newItem, [col.key]: e.target.value })
                    }
                    style={{ width: "100%", padding: "4px" }}
                  />
                </td>
              ))}
              <td>
                <button 
                  onClick={addRow}
                  style={{
                    padding: "4px 8px",
                    background: "#28a745",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                >
                  ➕ Thêm
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Column Modal */}
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
    </div>
  );
}
