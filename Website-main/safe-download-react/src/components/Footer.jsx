import React from "react";

export default function Footer() {
  return (
    <footer
      style={{
        padding: "20px 0",
        borderTop: "1px solid #f1f5f9",
        background: "#fffceb",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 16px",
          fontSize: 12,
          color: "#6b7280",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <span>© 2025 Safe Download Portal | Đảm bảo an toàn thông tin</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: 999,
              background: "#22c55e",
            }}
          />{" "}
          Online
        </span>
      </div>
    </footer>
  );
}
