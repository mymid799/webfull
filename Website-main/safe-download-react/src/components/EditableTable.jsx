import React, { useEffect, useState } from "react";

export default function EditableTable({ category, columns }) {
  const [data, setData] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [edited, setEdited] = useState([]);

  // ✅ Kiểm tra token để biết có phải admin không
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAdmin(!!token);

    fetch(`http://localhost:5000/api/${category}`)
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, [category]);

  // ➕ Thêm hàng mới
  const addRow = () => {
    setData([...data, {}]);
  };

  // ❌ Xóa hàng
  const deleteRow = (index) => {
    const newData = [...data];
    newData.splice(index, 1);
    setData(newData);
  };

  // ✏️ Chỉnh sửa nội dung ô
  const handleChange = (index, key, value) => {
    const newData = [...data];
    newData[index][key] = value;
    setData(newData);
    setEdited([...edited, newData[index]]);
  };

  // 💾 Lưu dữ liệu
  const saveChanges = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Bạn cần đăng nhập admin!");

    try {
      const res = await fetch(`http://localhost:5000/api/${category}/save`, {
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
      alert("⚠️ Lỗi khi gửi dữ liệu lên server!");
    }
  };

  return (
    <div
      style={{
        maxWidth: 1100,
        margin: "40px auto",
        background: "#fff",
        padding: 20,
        borderRadius: 12,
        boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
      }}
    >
      {/* ⚙️ Thanh công cụ CRUD (chỉ hiện khi admin) */}
      {isAdmin && (
        <div style={{ marginBottom: 15, textAlign: "right" }}>
          <button
            onClick={addRow}
            style={{
              background: "#4caf50",
              color: "#fff",
              border: "none",
              padding: "6px 12px",
              borderRadius: 6,
              marginRight: 6,
            }}
          >
            ➕ Thêm hàng
          </button>
          <button
            onClick={saveChanges}
            style={{
              background: "#2196f3",
              color: "#fff",
              border: "none",
              padding: "6px 12px",
              borderRadius: 6,
            }}
          >
            💾 Lưu
          </button>
        </div>
      )}

      {/* 🧾 Bảng dữ liệu */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#fffbea",
        }}
      >
        <thead>
          <tr style={{ background: "#ffe08a" }}>
            {columns.map((col, i) => (
              <th
                key={i}
                style={{
                  border: "1px solid #d4b35a",
                  padding: "8px",
                  textAlign: "center",
                }}
              >
                {col.header}
              </th>
            ))}
            {isAdmin && (
              <th
                style={{
                  border: "1px solid #d4b35a",
                  padding: "8px",
                }}
              >
                Thao tác
              </th>
            )}
          </tr>
        </thead>

        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} style={{ background: "#fffaf0" }}>
              {columns.map((col, cidx) => (
                <td
                  key={cidx}
                  style={{
                    border: "1px solid #ddd",
                    padding: "6px 8px",
                  }}
                >
                  {isAdmin ? (
                    // --- Nếu admin: cho nhập text như cũ ---
                    <input
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
                    // --- Nếu có link: hiển thị thẻ a để click ---
                    <a
                      href={row[col.key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "#1a73e8",
                        textDecoration: "underline",
                        fontWeight: 500,
                      }}
                    >
                      {col.key === "fshare"
                        ? "Fshare"
                        : col.key === "googleDrive"
                        ? "Drive"
                        : col.key === "oneDrive"
                        ? "OneDrive"
                        : "Link"}
                    </a>
                  ) : (
                    // --- Nếu chỉ là text thường ---
                    row[col.key] || "-"
                  )}
                </td>
              ))}
              {isAdmin && (
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "6px",
                    textAlign: "center",
                  }}
                >
                  <button
                    onClick={() => deleteRow(idx)}
                    style={{
                      background: "#f44336",
                      color: "#fff",
                      border: "none",
                      borderRadius: 4,
                      padding: "4px 8px",
                      cursor: "pointer",
                    }}
                  >
                    ❌
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
