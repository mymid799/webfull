import React from "react";
export default function Tag({ children }) {
  return (
    <span
      style={{
        padding: "2px 8px",
        borderRadius: 999,
        border: "1px solid #e5e7eb",
        background: "#fafafa",
        fontSize: 12,
      }}
    >
      {children}
    </span>
  );
}
