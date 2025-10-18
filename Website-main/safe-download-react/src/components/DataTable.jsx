import React from "react";

export default function DataTable({ columns, data }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: 14,
          background: "#fff",
        }}
      >
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{
                  textAlign: "left",
                  padding: "10px 12px",
                  border: "1px solid #bdbdbd", // 🔹 Viền rõ ràng
                  background: "#f8f4e3", // 🔸 Nền nhẹ như hình mẫu
                  fontWeight: 700,
                }}
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              {columns.map((col) => (
                <td
                  key={col.key}
                  style={{
                    padding: "8px 12px",
                    border: "1px solid #cfcfcf", // 🔹 Viền ngang & dọc
                    background: i % 2 === 0 ? "#fcfcfc" : "#ffffff",
                    verticalAlign: "top",
                  }}
                >
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
