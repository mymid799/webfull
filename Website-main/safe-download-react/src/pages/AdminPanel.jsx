import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DynamicColumnManager from "../components/DynamicColumnManager";
import DynamicDataEditor from "../components/DynamicDataEditor";
import AdminBitOptionsButton from "../components/AdminBitOptionsButton";
import BitOptionsDropdown from "../components/BitOptionsDropdown";

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
  const [newColumnBitOption, setNewColumnBitOption] = useState("");
  const [columns, setColumns] = useState([
    { key: "version", label: "Version", type: "text" },
    { key: "edition", label: "Edition", type: "text" },
    { key: "sha1", label: "SHA-1", type: "text" }
  ]);
  const [dynamicColumns, setDynamicColumns] = useState([]);
  const [showDynamicManager, setShowDynamicManager] = useState(false);
  const [dynamicData, setDynamicData] = useState({});
  const [allColumns, setAllColumns] = useState([]);
  const [rowDynamicData, setRowDynamicData] = useState({});

  useEffect(() => {
    fetch(`http://localhost:5000/api/admin/${category}`)
      .then((res) => res.json())
      .then(setData);
    
    // Load dynamic columns for the category
    loadDynamicColumns();
  }, [category]);

  // Load dynamic data when dynamicColumns change
  useEffect(() => {
    if (dynamicColumns.length > 0) {
      loadExistingDynamicData();
    }
  }, [dynamicColumns]);

  // Load dynamic columns
  const loadDynamicColumns = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/dynamic-columns/${category}`);
      const result = await response.json();
      
      if (result.success) {
        setDynamicColumns(result.data);
        // Combine static and dynamic columns
        const combinedColumns = [
          ...columns,
          ...result.data.map(col => ({
            key: col.columnKey,
            label: col.columnLabel,
            type: col.columnType,
            isDynamic: true,
            _id: col._id,
            columnId: col._id
          }))
        ];
        setAllColumns(combinedColumns);
        
        // Load existing dynamic data for all records
        await loadExistingDynamicData();
      }
    } catch (error) {
      console.error('Error loading dynamic columns:', error);
    }
  };

  // Load existing dynamic data for all records
  const loadExistingDynamicData = async () => {
    try {
      // Get all dynamic data for this category
      const response = await fetch(`http://localhost:5000/api/dynamic-columns/data/${category}/null`);
      const result = await response.json();
      
      if (result.success) {
        // Group data by parentRecord
        const dataByRecord = {};
        result.data.forEach(item => {
          if (item.parentRecord) {
            const recordId = item.parentRecord;
            if (!dataByRecord[recordId]) {
              dataByRecord[recordId] = {};
            }
            dataByRecord[recordId][item.columnId] = item.value;
          }
        });
        setDynamicData(dataByRecord);
      }
    } catch (error) {
      console.error('Error loading existing dynamic data:', error);
    }
  };

  const addRow = async () => {
    try {
      // Add static data
      const res = await fetch("http://localhost:5000/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newItem, category }),
      });
      const result = await res.json();
      
      if (result.success) {
        const newRecord = result;
        setData([...data, newRecord]);
        
        // Save dynamic data for this record
        await saveDynamicDataForRecord(newRecord._id);
        
        // Reload dynamic data to show in table
        await loadExistingDynamicData();
        
        // Reset form
        setNewItem({
          version: "",
          edition: "",
          sha1: "",
        });
        setRowDynamicData({});
        
        alert('✅ Đã thêm dữ liệu thành công!');
      }
    } catch (error) {
      console.error('Error adding row:', error);
      alert('Lỗi khi thêm dữ liệu!');
    }
  };

  // Save dynamic data for a specific record
  const saveDynamicDataForRecord = async (recordId) => {
    for (const [columnId, value] of Object.entries(rowDynamicData)) {
      if (value !== undefined && value !== '') {
        try {
          const response = await fetch('http://localhost:5000/api/dynamic-columns/data', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              columnId,
              value,
              category,
              parentRecord: recordId,
              parentModel: category.charAt(0).toUpperCase() + category.slice(1)
            }),
          });
          
          const result = await response.json();
          if (!result.success) {
            console.error('Failed to save dynamic data:', result.message);
          }
        } catch (error) {
          console.error('Error saving dynamic data:', error);
        }
      }
    }
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
      type: newColumnType,
      ...(newColumnType === "url" && newColumnBitOption && {
        bitOption: newColumnBitOption
      })
    };
    
    setColumns([...columns, newColumn]);
    setNewColumnName("");
    setNewColumnType("text");
    setNewColumnBitOption("");
    setShowColumnModal(false);
    
    // Hiển thị thông báo nếu có bit option
    if (newColumnType === "url" && newColumnBitOption) {
      alert(`✅ Đã thêm cột ${newColumnName} với tùy chọn bit: ${newColumnBitOption}`);
    }
  };

  // Xóa cột
  const deleteColumn = (columnKey) => {
    // Cho phép xóa cột cuối cùng vì đây là bảng động giống Excel
    
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
      <div style={{ 
        marginBottom: 20, 
        display: "grid",
        gridTemplateColumns: "auto 1fr",
        gap: 20,
        alignItems: "center",
        padding: "16px 20px",
        background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
        borderRadius: "10px",
        border: "1px solid #dee2e6",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}>
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "12px",
          minWidth: "200px"
        }}>
          <label style={{ 
            fontWeight: "600", 
            color: "#495057",
            fontSize: "14px",
            whiteSpace: "nowrap"
          }}>
            📂 Danh mục:
          </label>
          <select 
            onChange={(e) => setCategory(e.target.value)} 
            value={category}
            style={{
              padding: "8px 12px",
              border: "2px solid #ced4da",
              borderRadius: "8px",
              fontSize: "14px",
              minWidth: "140px",
              background: "white",
              transition: "all 0.2s ease"
            }}
            onFocus={(e) => e.target.style.borderColor = "#007bff"}
            onBlur={(e) => e.target.style.borderColor = "#ced4da"}
          >
            <option value="windows">🪟 Windows</option>
            <option value="office">📄 Office</option>
            <option value="tools">🔧 Tools</option>
            <option value="antivirus">🛡️ Antivirus</option>
          </select>
        </div>
        
        <div style={{ 
          display: "flex", 
          gap: "12px", 
          flexWrap: "wrap",
          justifyContent: "flex-end"
        }}>
          <AdminBitOptionsButton 
            onOptionSelect={(option) => {
              console.log('Selected bit option:', option);
              alert(`Đã chọn: ${option.label}\nMô tả: ${option.description}`);
            }}
          />
          
          <button 
            onClick={() => setShowColumnModal(true)}
            style={{
              padding: "8px 16px",
              background: "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
              color: "white",
              border: "none",
              borderRadius: "8px",
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
            ➕ Thêm cột
          </button>
          
          <button 
            onClick={() => setShowDynamicManager(!showDynamicManager)}
            style={{
              padding: "8px 16px",
              background: showDynamicManager 
                ? "linear-gradient(135deg, #dc3545 0%, #fd7e14 100%)" 
                : "linear-gradient(135deg, #007bff 0%, #6610f2 100%)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "all 0.3s ease",
              boxShadow: showDynamicManager 
                ? "0 2px 4px rgba(220, 53, 69, 0.3)" 
                : "0 2px 4px rgba(0, 123, 255, 0.3)",
              minWidth: "160px",
              justifyContent: "center"
            }}
            onMouseOver={(e) => {
              e.target.style.transform = "translateY(-1px)";
              e.target.style.boxShadow = showDynamicManager 
                ? "0 4px 8px rgba(220, 53, 69, 0.4)" 
                : "0 4px 8px rgba(0, 123, 255, 0.4)";
            }}
            onMouseOut={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = showDynamicManager 
                ? "0 2px 4px rgba(220, 53, 69, 0.3)" 
                : "0 2px 4px rgba(0, 123, 255, 0.3)";
            }}
          >
            {showDynamicManager ? "❌ Đóng quản lý" : "🗂️ Quản lý cột động"}
          </button>
        </div>
      </div>

      {/* Dynamic Column Manager */}
      {showDynamicManager && (
        <div style={{ marginBottom: '30px' }}>
          <DynamicColumnManager 
            category={category}
            onColumnsChange={async (newColumns) => {
              setDynamicColumns(newColumns);
              // Update allColumns when dynamic columns change
              const combinedColumns = [
                ...columns,
                ...newColumns.map(col => ({
                  key: col.columnKey,
                  label: col.columnLabel,
                  type: col.columnType,
                  isDynamic: true,
                  columnId: col._id
                }))
              ];
              setAllColumns(combinedColumns);
              
              // Reload dynamic data after columns change
              await loadExistingDynamicData();
            }}
          />
          
          {dynamicColumns.length > 0 && (
            <DynamicDataEditor
              category={category}
              parentRecord={null}
              parentModel={category}
              columns={dynamicColumns}
              onDataChange={setDynamicData}
            />
          )}
        </div>
      )}

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table border="1" width="100%" cellPadding="6" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8f9fa" }}>
              {allColumns.map((col) => (
                <th key={col.key} style={{ position: "relative", padding: "12px 8px" }}>
                  {col.label}
                  {col.isDynamic && (
                    <span style={{
                      marginLeft: "4px",
                      fontSize: "10px",
                      color: "#007bff",
                      fontWeight: "bold"
                    }}>
                      [Động]
                    </span>
                  )}
                  {!col.isDynamic && (
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
                  )}
                </th>
              ))}
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d._id}>
                {allColumns.map((col) => (
                  <td key={col.key} style={{ padding: "8px" }}>
                    {col.isDynamic ? (
                      // Dynamic column - show data from dynamicData state
                      <span style={{ color: "#007bff" }}>
                        {dynamicData[d._id]?.[col._id] || "-"}
                      </span>
                    ) : (
                      // Static column - existing logic
                      editingCell?.rowId === d._id && editingCell?.field === col.key ? (
                        <div style={{ 
                          display: "flex", 
                          gap: "4px", 
                          alignItems: "center",
                          flexWrap: "wrap"
                        }}>
                          <input
                            type={col.type}
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
                            style={{ 
                              flex: "1 1 200px", 
                              padding: "6px 8px",
                              border: "2px solid #007bff",
                              borderRadius: "6px",
                              fontSize: "13px",
                              minWidth: "120px"
                            }}
                            autoFocus
                          />
                          <div style={{ 
                            display: "flex", 
                            gap: "4px",
                            flexShrink: 0
                          }}>
                            <button 
                              onClick={saveEdit} 
                              style={{ 
                                padding: "6px 8px", 
                                fontSize: "11px",
                                background: "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
                                color: "white",
                                border: "none",
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontWeight: "600",
                                display: "flex",
                                alignItems: "center",
                                gap: "2px",
                                transition: "all 0.2s ease",
                                boxShadow: "0 2px 4px rgba(40, 167, 69, 0.2)"
                              }}
                              onMouseOver={(e) => {
                                e.target.style.background = "linear-gradient(135deg, #218838 0%, #1ea085 100%)";
                                e.target.style.transform = "translateY(-1px)";
                              }}
                              onMouseOut={(e) => {
                                e.target.style.background = "linear-gradient(135deg, #28a745 0%, #20c997 100%)";
                                e.target.style.transform = "translateY(0)";
                              }}
                            >
                              ✓ Lưu
                            </button>
                            <button 
                              onClick={cancelEdit} 
                              style={{ 
                                padding: "6px 8px", 
                                fontSize: "11px",
                                background: "linear-gradient(135deg, #6c757d 0%, #5a6268 100%)",
                                color: "white",
                                border: "none",
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontWeight: "600",
                                display: "flex",
                                alignItems: "center",
                                gap: "2px",
                                transition: "all 0.2s ease",
                                boxShadow: "0 2px 4px rgba(108, 117, 125, 0.2)"
                              }}
                              onMouseOver={(e) => {
                                e.target.style.background = "linear-gradient(135deg, #5a6268 0%, #495057 100%)";
                                e.target.style.transform = "translateY(-1px)";
                              }}
                              onMouseOut={(e) => {
                                e.target.style.background = "linear-gradient(135deg, #6c757d 0%, #5a6268 100%)";
                                e.target.style.transform = "translateY(0)";
                              }}
                            >
                              ✕ Hủy
                            </button>
                          </div>
                        </div>
                      ) : (
                        <span
                          onClick={() => startEdit(d._id, col.key, d[col.key])}
                          style={{ cursor: "pointer", display: "block", minHeight: "20px" }}
                          title="Click để chỉnh sửa"
                        >
                          {d[col.key] || "-"}
                        </span>
                      )
                    )}
                  </td>
                ))}
                <td style={{ 
                  textAlign: "center", 
                  verticalAlign: "middle",
                  width: "100px",
                  padding: "8px 4px"
                }}>
                  <button 
                    onClick={() => deleteRow(d._id)}
                    style={{
                      padding: "6px 10px",
                      background: "linear-gradient(135deg, #dc3545 0%, #c82333 100%)",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "11px",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      gap: "3px",
                      transition: "all 0.2s ease",
                      width: "100%",
                      justifyContent: "center",
                      boxShadow: "0 2px 4px rgba(220, 53, 69, 0.2)"
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = "linear-gradient(135deg, #c82333 0%, #a71e2a 100%)";
                      e.target.style.transform = "translateY(-1px)";
                      e.target.style.boxShadow = "0 3px 6px rgba(220, 53, 69, 0.3)";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = "linear-gradient(135deg, #dc3545 0%, #c82333 100%)";
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "0 2px 4px rgba(220, 53, 69, 0.2)";
                    }}
                  >
                    🗑️ Xóa
                  </button>
                </td>
              </tr>
            ))}
            
            {/* Add new row */}
            <tr>
              {allColumns.map((col) => (
                <td key={col.key}>
                  {col.isDynamic ? (
                    <input
                      type={col.type}
                      placeholder={col.label}
                      value={rowDynamicData[col._id] || ''}
                      onChange={(e) => {
                        setRowDynamicData({
                          ...rowDynamicData,
                          [col._id]: e.target.value
                        });
                      }}
                      style={{ 
                        width: "100%", 
                        padding: "4px",
                        border: "1px solid #007bff",
                        background: "#f8f9ff"
                      }}
                    />
                  ) : (
                    <input
                      type={col.type}
                      placeholder={col.label}
                      value={newItem[col.key] || ''}
                      onChange={(e) =>
                        setNewItem({ ...newItem, [col.key]: e.target.value })
                      }
                      style={{ width: "100%", padding: "4px" }}
                    />
                  )}
                </td>
              ))}
              <td style={{ 
                textAlign: "center", 
                verticalAlign: "middle",
                width: "100px",
                padding: "8px 4px"
              }}>
                <button 
                  onClick={addRow}
                  style={{
                    padding: "6px 10px",
                    background: "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "11px",
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    gap: "3px",
                    transition: "all 0.2s ease",
                    width: "100%",
                    justifyContent: "center",
                    boxShadow: "0 2px 4px rgba(40, 167, 69, 0.2)"
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = "linear-gradient(135deg, #218838 0%, #1ea085 100%)";
                    e.target.style.transform = "translateY(-1px)";
                    e.target.style.boxShadow = "0 3px 6px rgba(40, 167, 69, 0.3)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = "linear-gradient(135deg, #28a745 0%, #20c997 100%)";
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 2px 4px rgba(40, 167, 69, 0.2)";
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
                onChange={(e) => {
                  setNewColumnType(e.target.value);
                  if (e.target.value !== "url") {
                    setNewColumnBitOption("");
                  }
                }}
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

            {newColumnType === "url" && (
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", marginBottom: 4 }}>
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
            
            <div style={{ 
              display: "flex", 
              gap: 12, 
              marginTop: 16,
              justifyContent: "center"
            }}>
              <button
                onClick={addColumn}
                style={{
                  flex: "0 1 140px",
                  padding: "10px 16px",
                  background: "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  transition: "all 0.3s ease",
                  boxShadow: "0 3px 6px rgba(40, 167, 69, 0.3)"
                }}
                onMouseOver={(e) => {
                  e.target.style.background = "linear-gradient(135deg, #218838 0%, #1ea085 100%)";
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 5px 10px rgba(40, 167, 69, 0.4)";
                }}
                onMouseOut={(e) => {
                  e.target.style.background = "linear-gradient(135deg, #28a745 0%, #20c997 100%)";
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 3px 6px rgba(40, 167, 69, 0.3)";
                }}
              >
                ✅ Thêm cột
              </button>
              <button
                onClick={() => {
                  setShowColumnModal(false);
                  setNewColumnName("");
                  setNewColumnType("text");
                  setNewColumnBitOption("");
                }}
                style={{
                  flex: "0 1 140px",
                  padding: "10px 16px",
                  border: "2px solid #dee2e6",
                  borderRadius: 8,
                  background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  transition: "all 0.3s ease",
                  boxShadow: "0 3px 6px rgba(0, 0, 0, 0.1)"
                }}
                onMouseOver={(e) => {
                  e.target.style.background = "linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%)";
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 5px 10px rgba(0, 0, 0, 0.15)";
                }}
                onMouseOut={(e) => {
                  e.target.style.background = "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)";
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 3px 6px rgba(0, 0, 0, 0.1)";
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
