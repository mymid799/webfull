import React, { useEffect, useState } from "react";
import ColumnManager, { ColumnHeader, deleteColumn } from "../components/ColumnManager";
import UrlCell from "../components/UrlCell";
import "../styles/table.css";

export default function Tools() {
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

  // ✅ Load dữ liệu khi vào trang
  useEffect(() => {
    // Load dữ liệu
    fetch("http://localhost:5000/api/tools")
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch(() => setData([]));

    // Load cấu hình cột từ database
    const loadColumnConfig = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/admin/columns/tools", {
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
          const configKey = `column_config_tools`;
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
        }
      } catch (err) {
        console.warn("⚠️ Error loading column config from database, trying localStorage:", err);
        // Fallback to localStorage
        try {
          const configKey = `column_config_tools`;
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
        } catch (localErr) {
          console.warn("⚠️ Error loading column config, using defaults:", localErr);
          setColumns([
            { key: "toolName", label: "Tên Tool", type: "text" },
            { key: "mainLink", label: "Trang chủ / Link gốc", type: "url" },
            { key: "googleDrive", label: "Google Drive", type: "url" },
            { key: "ownCloud", label: "OwnCloud", type: "url" },
            { key: "note", label: "Note", type: "text" }
          ]);
        }
      }
    };
    
    loadColumnConfig();

    const token = localStorage.getItem("token");
    if (token) setIsAdmin(true);
  }, []);

  // ✅ Thêm hàng
  const addRow = () => {
    setData([
      ...data,
      {
        toolName: "",
        mainLink: "",
        googleDrive: "",
        ownCloud: "",
        note: "",
      },
    ]);
  };

  // ✅ Xóa hàng
  const deleteRow = (index) => {
    const newData = [...data];
    newData.splice(index, 1);
    setData(newData);
  };

  // ✅ Chỉnh sửa ô
  const handleChange = (index, key, value) => {
    const updated = [...data];
    updated[index][key] = value;
    setData(updated);
  };

  // ✅ Lưu dữ liệu về MongoDB
  const saveChanges = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("🔒 Bạn cần đăng nhập admin!");

    try {
      const res = await fetch("http://localhost:5000/api/tools/save", {
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

  // ✅ Lọc dữ liệu theo từ khóa (realtime)
  const filteredData = data.filter((row) =>
    Object.values(row).join(" ").toLowerCase().includes(searchTerm)
  );

  return (
    <div style={{ padding: "20px 40px" }}>
      <h2 style={{ color: "#b84e00", textAlign: "center" }}>
        TOOLS (CÔNG CỤ / PHẦN MỀM CẦN THIẾT)
      </h2>

      {/* 🔍 Thanh tìm kiếm */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <input
          type="text"
          placeholder="🔍 Tìm kiếm Tool theo tên, ghi chú hoặc link tải..."
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
            category="tools"
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
            {filteredData.map((row, idx) => (
              <tr key={idx}>
                {columns.map((col) => (
                  <td
                    key={col.key}
                    style={{
                      border: "1px solid #eee",
                      padding: "8px 10px",
                    }}
                  >
                    {col.type === 'url' && col.bitOptions ? (
                      <UrlCell
                        isAdmin={isAdmin}
                        row={row}
                        idx={idx}
                        type="tools"
                        handleChange={handleChange}
                        columnKey={col.key}
                      />
                    ) : isAdmin ? (
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
                          ? "Drive"
                          : col.key === "ownCloud"
                          ? "OwnCloud"
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
