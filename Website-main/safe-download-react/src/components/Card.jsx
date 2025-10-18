import React from "react";
export default function Card({ title, children, accent = "#f7d76b" }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        marginBottom: 24,
      }}
    >
      <div
        style={{ background: accent, padding: "14px 16px", fontWeight: 700 }}
      >
        {title}
      </div>
      <div style={{ padding: 16 }}>{children}</div>
    </div>
  );
}
