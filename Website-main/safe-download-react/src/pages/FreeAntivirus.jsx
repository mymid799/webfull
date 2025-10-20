import React, { useEffect, useState } from "react";
import ColumnManager, { ColumnHeader, deleteColumn } from "../components/ColumnManager";
import UrlCell from "../components/UrlCell";
import SmartTextCell from "../components/SmartTextCell";
import AdminBitOptionsButton from "../components/AdminBitOptionsButton";
import BitOptionsDropdown from "../components/BitOptionsDropdown";
import "../styles/table.css";

export default function FreeAntivirus() {
  const [data, setData] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Dynamic column management states
  const [showAddColumnModal, setShowAddColumnModal] = useState(false);
  const [showAddRowModal, setShowAddRowModal] = useState(false);
  const [showCreateNoteModal, setShowCreateNoteModal] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");
  const [newColumnType, setNewColumnType] = useState("text");
  const [newColumnBitOption, setNewColumnBitOption] = useState("");
  
  // Note creation states
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  
  // Wrapper function for optimized column deletion
  const handleDeleteColumn = async (columnKey) => {
    setIsLoading(true);
    try {
      await deleteColumn(columnKey, {
        columns,
        setColumns,
        data,
        setData,
        category: 'antivirus'
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
    localStorage.setItem(`column_config_antivirus`, JSON.stringify({ columns: updatedColumns }));
    
    console.log(`✅ Column "${columnKey}" renamed to "${newLabel}"`);
  };

  const [columns, setColumns] = useState([
    { key: "toolName", label: "Tên Tool", type: "text" },
    { key: "mainLink", label: "Trang chủ / Link gốc", type: "url" },
    { key: "googleDrive", label: "Google", type: "url" },
    { key: "oneDrive", label: "OneDrive", type: "url" },
    { key: "note", label: "Note", type: "text" },
  ]);

  useEffect(() => {
    // Load dữ liệu và cấu hình cột từ database
    const loadData = async () => {
      try {
        console.log("📥 Loading Antivirus data from database...");
        const res = await fetch("http://localhost:5000/api/column-config/data/antivirus");
        const result = await res.json();
        console.log("📥 Load response (antivirus):", result);
        
        if (res.ok && result.success) {
          console.log("📥 Loaded data (antivirus):", result.data.data);
          setData(result.data.data || []);
          
          if (result.data.columnConfig && result.data.columnConfig.columns) {
            console.log("✅ Loaded column config from database:", result.data.columnConfig);
            setColumns(result.data.columnConfig.columns);
            // Lưu vào localStorage để backup
            localStorage.setItem(`column_config_antivirus`, JSON.stringify({ columns: result.data.columnConfig.columns }));
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
          const configKey = `column_config_antivirus`;
          const dataKey = `antivirus_data`;

          // Load data backup
          const savedData = localStorage.getItem(dataKey);
          if (savedData) {
            const parsed = JSON.parse(savedData);
            console.log("📥 Loaded antivirus data from localStorage:", parsed);
            setData(parsed);
          }
          
          // Load columns
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
              { key: "note", label: "Note", type: "text" },
          ]);
        }
      } catch (err) {
        console.warn("⚠️ Error loading column config, using defaults:", err);
        setColumns([
            { key: "toolName", label: "Tên Tool", type: "text" },
            { key: "mainLink", label: "Trang chủ / Link gốc", type: "url" },
            { key: "googleDrive", label: "Google", type: "url" },
            { key: "oneDrive", label: "OneDrive", type: "url" },
            { key: "note", label: "Note", type: "text" },
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

  // Add new row function (align with Windows)
  const addRow = () => {
    const newRow = {};
    
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
    
    // Nếu là cột URL, thêm các trường 32-bit, 64-bit và Show vào tất cả hàng hiện có (align Windows)
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

  // Create note function -> insert as special merged note row (content only)
  const createNote = () => {
    if (!noteContent.trim()) return;

    const noteRow = {
      type: 'antivirus_note_row',
      noteContent: noteContent,
      createdAt: new Date().toISOString()
    };

    setData([...data, noteRow]);
    setNoteContent("");
    setShowCreateNoteModal(false);
  };

  // Save changes function
  const saveChanges = async () => {
      const token = localStorage.getItem("token");
    if (!token) return alert("🔒 Bạn cần đăng nhập admin!");

    try {
      console.log("💾 Saving Antivirus data:", { category: "antivirus", data, columns });
      // Lưu cấu hình cột và dữ liệu
      const res = await fetch("http://localhost:5000/api/column-config/data/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          category: "antivirus",
          data: data,
          columnConfig: {
            columns: columns
          }
        }),
      });
      
      const result = await res.json();
      console.log("💾 Save response (antivirus):", result);
      if (res.ok) {
        alert(result.message || "✅ Dữ liệu và cấu hình cột đã lưu!");
        // Lưu cấu hình cột vào localStorage
        localStorage.setItem(`column_config_antivirus`, JSON.stringify({ columns }));
        // Backup data
        localStorage.setItem(`antivirus_data`, JSON.stringify(data));
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

  // Delete row function (align with Windows)
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
        FREE ANTIVIRUS
      </h2>

      {/* Note bar removed: notes are now normal table rows */}

      {/* 🔍 Thanh tìm kiếm */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <input
          type="text"
          placeholder="🔍 Tìm kiếm Antivirus theo tên, link hoặc note..."
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
            onClick={() => setShowCreateNoteModal(true)}
            className="btn-create-note"
            style={{
              background: "linear-gradient(135deg, #6f42c1 0%, #5a32a3 100%)",
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
            📝 TẠO NOTE
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
              row?.type === 'antivirus_note_row' ? (
                <tr key={`antivirus-row-${idx}`}>
                  <td colSpan={columns.length + (isAdmin ? 1 : 0)} style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    padding: '16px 20px',
                    fontWeight: 500,
                    color: '#fff',
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                    borderRadius: '8px',
                    margin: '8px 0',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{ 
                      position: 'absolute', 
                      top: 0, 
                      left: 0, 
                      right: 0, 
                      height: '3px', 
                      background: 'linear-gradient(90deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4)',
                      borderRadius: '8px 8px 0 0'
                    }}></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', width: '100%', position: 'relative', zIndex: 1 }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 8, 
                        flex: 1,
                        minWidth: 0
                      }}>
                        <div style={{
                          background: 'rgba(255, 255, 255, 0.2)',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          flexShrink: 0
                        }}>
                          📝
                        </div>
                        {isAdmin ? (
                          <>
                            <textarea
                              value={row.noteContent || ''}
                              onChange={(e) => handleChange(idx, 'noteContent', e.target.value)}
                              placeholder="Nhập nội dung note..."
                              style={{
                                flex: 1,
                                border: '2px solid rgba(255, 255, 255, 0.3)',
                                borderRadius: '8px',
                                padding: '12px 16px',
                                background: 'rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(10px)',
                                minHeight: '80px',
                                resize: 'vertical',
                                color: '#fff',
                                fontSize: '14px',
                                fontWeight: '500',
                                outline: 'none',
                                transition: 'all 0.3s ease',
                                '::placeholder': {
                                  color: 'rgba(255, 255, 255, 0.7)'
                                }
                              }}
                              onFocus={(e) => {
                                e.target.style.border = '2px solid rgba(255, 255, 255, 0.6)';
                                e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                              }}
                              onBlur={(e) => {
                                e.target.style.border = '2px solid rgba(255, 255, 255, 0.3)';
                                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                              }}
                            />
                          </>
                        ) : (
                          <>
                            <div style={{
                              flex: 1,
                              padding: '12px 16px',
                              background: 'rgba(255, 255, 255, 0.1)',
                              borderRadius: '8px',
                              backdropFilter: 'blur(10px)',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              fontSize: '14px',
                              lineHeight: '1.5',
                              wordBreak: 'break-word'
                            }}>
                              {row.noteContent}
                            </div>
                          </>
                        )}
                      </div>
                      {isAdmin && (
                        <button
                          onClick={() => deleteRow(idx)}
                          style={{
                            background: 'rgba(255, 107, 107, 0.8)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '32px',
                            height: '32px',
                            cursor: 'pointer',
                            color: '#fff',
                            fontWeight: 'bold',
                            fontSize: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 2px 8px rgba(255, 107, 107, 0.3)',
                            flexShrink: 0
                          }}
                          onMouseOver={(e) => {
                            e.target.style.background = 'rgba(255, 107, 107, 1)';
                            e.target.style.transform = 'scale(1.1)';
                            e.target.style.boxShadow = '0 4px 12px rgba(255, 107, 107, 0.5)';
                          }}
                          onMouseOut={(e) => {
                            e.target.style.background = 'rgba(255, 107, 107, 0.8)';
                            e.target.style.transform = 'scale(1)';
                            e.target.style.boxShadow = '0 2px 8px rgba(255, 107, 107, 0.3)';
                          }}
                          title="Xóa note"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                <tr key={`antivirus-row-${idx}`}>
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
              )
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

      {/* Create Note Modal */}
      {showCreateNoteModal && (
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
            minWidth: "500px",
            maxWidth: "600px"
          }}>
            <h3 style={{ marginBottom: "20px", color: "#333" }}>Tạo Note mới</h3>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                Nội dung:
              </label>
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                          style={{
                            width: "100%",
                  padding: "8px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "14px",
                  minHeight: "120px",
                  resize: "vertical"
                }}
                placeholder="Nhập nội dung note..."
              />
            </div>
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button
                onClick={() => {
                  setShowCreateNoteModal(false);
                  setNoteTitle("");
                  setNoteContent("");
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
                onClick={createNote}
                style={{
                  padding: "8px 16px",
                  background: "#6f42c1",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                Tạo Note
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