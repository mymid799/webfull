import React from "react";

const UrlCell = ({ isAdmin, row, idx, type, handleChange, columnKey }) => {
  const prefix = columnKey;
  const showKey = `${prefix}Show`;
  const link32 = row[`${prefix}32`];
  const link64 = row[`${prefix}64`];
  const linkCommon = row[`${prefix}Common`];
  const show = row[showKey];

  if (isAdmin) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ display: "flex", gap: 6 }}>
          <input
            placeholder="32-bit"
            value={link32 || ""}
            onChange={(e) => handleChange(idx, `${prefix}32`, e.target.value)}
            style={{
              width: "100%",
              padding: "4px 8px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "12px"
            }}
          />
          <input
            placeholder="64-bit"
            value={link64 || ""}
            onChange={(e) => handleChange(idx, `${prefix}64`, e.target.value)}
            style={{
              width: "100%",
              padding: "4px 8px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "12px"
            }}
          />
        </div>

        {/* Common link input */}
        <input
          placeholder="Common link"
          value={linkCommon || ""}
          onChange={(e) => handleChange(idx, `${prefix}Common`, e.target.value)}
          style={{
            width: "100%",
            padding: "4px 8px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            fontSize: "12px"
          }}
        />

        {/* Radio buttons for display option */}
        <div style={{ fontSize: 13 }}>
          <label>
            <input
              type="radio"
              name={`${prefix}Show_${idx}`}
              value="32"
              checked={show === "32"}
              onChange={(e) => handleChange(idx, showKey, e.target.value)}
              style={{ marginRight: 4 }}
            />
            32-bit
          </label>
          <label style={{ marginLeft: 8 }}>
            <input
              type="radio"
              name={`${prefix}Show_${idx}`}
              value="64"
              checked={show === "64"}
              onChange={(e) => handleChange(idx, showKey, e.target.value)}
              style={{ marginRight: 4 }}
            />
            64-bit
          </label>
          <label style={{ marginLeft: 8 }}>
            <input
              type="radio"
              name={`${prefix}Show_${idx}`}
              value="both"
              checked={show === "both"}
              onChange={(e) => handleChange(idx, showKey, e.target.value)}
              style={{ marginRight: 4 }}
            />
            Both
          </label>
          <label style={{ marginLeft: 8 }}>
            <input
              type="radio"
              name={`${prefix}Show_${idx}`}
              value="none"
              checked={show === "none"}
              onChange={(e) => handleChange(idx, showKey, e.target.value)}
              style={{ marginRight: 4 }}
            />
            None
          </label>
        </div>
      </div>
    );
  }

  // Display mode for non-admin users
  const getLabel = (prefix, type) => {
    if (type === "Common")
      return "Download chung";
    return `${type}-bit`;
  };

  if (show === "32" && link32)
    return (
      <a href={link32} target="_blank" rel="noreferrer">
        32-bit
      </a>
    );
  if (show === "64" && link64)
    return (
      <a href={link64} target="_blank" rel="noreferrer">
        64-bit
      </a>
    );
  if (show === "both")
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        {link32 && (
          <a href={link32} target="_blank" rel="noreferrer">
            32-bit
          </a>
        )}
        {link64 && (
          <a href={link64} target="_blank" rel="noreferrer">
            64-bit
          </a>
        )}
        {linkCommon && (
          <a href={linkCommon} target="_blank" rel="noreferrer">
            Download chung
          </a>
        )}
      </div>
    );
  if (linkCommon)
    return (
      <a href={linkCommon} target="_blank" rel="noreferrer">
        Download chung
      </a>
    );
  
  return "-";
};

export default UrlCell;
