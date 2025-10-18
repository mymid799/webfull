import React, { useState } from "react";
export default function HashCell({ hash }) {
  const [copied, setCopied] = useState(false);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <code style={{ fontFamily: "monospace" }}>{hash}</code>
      <button
        onClick={() => {
          navigator.clipboard.writeText(hash);
          setCopied(true);
          setTimeout(() => setCopied(false), 1200);
        }}
        style={{
          border: "1px solid #ddd",
          borderRadius: 8,
          padding: "4px 8px",
          cursor: "pointer",
        }}
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
