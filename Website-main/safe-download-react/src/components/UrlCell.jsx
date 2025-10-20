import React from "react";

const UrlCell = ({ isAdmin, row, idx, type, handleChange, columnKey }) => {
  const prefix = columnKey || type;
  const showKey = `${prefix}Show`;
  const link32 = row[`${prefix}32`];
  const link64 = row[`${prefix}64`];
  const linkCommon = row[`${prefix}Common`];
  const show = row[showKey];

  if (isAdmin) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {/* 32-bit and 64-bit inputs side by side */}
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ flex: 1 }}>
            <label style={{ 
              display: "block", 
              fontSize: "11px", 
              fontWeight: "600", 
              color: "#007bff", 
              marginBottom: "4px",
              textAlign: "center"
            }}>
              32-bit
            </label>
            <input
              placeholder="Nhập link 32-bit..."
              value={link32 || ""}
              onChange={(e) => handleChange(idx, `${prefix}32`, e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #007bff",
                borderRadius: "6px",
                fontSize: "12px",
                outline: "none",
                transition: "border-color 0.3s ease",
                boxSizing: "border-box"
              }}
              onFocus={(e) => e.target.style.borderColor = "#0056b3"}
              onBlur={(e) => e.target.style.borderColor = "#007bff"}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ 
              display: "block", 
              fontSize: "11px", 
              fontWeight: "600", 
              color: "#28a745", 
              marginBottom: "4px",
              textAlign: "center"
            }}>
              64-bit
            </label>
            <input
              placeholder="Nhập link 64-bit..."
              value={link64 || ""}
              onChange={(e) => handleChange(idx, `${prefix}64`, e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #28a745",
                borderRadius: "6px",
                fontSize: "12px",
                outline: "none",
                transition: "border-color 0.3s ease",
                boxSizing: "border-box"
              }}
              onFocus={(e) => e.target.style.borderColor = "#1e7e34"}
              onBlur={(e) => e.target.style.borderColor = "#28a745"}
            />
          </div>
        </div>

        {/* Common link input */}
        <div>
          <label style={{ 
            display: "block", 
            fontSize: "11px", 
            fontWeight: "600", 
            color: "#6f42c1", 
            marginBottom: "4px",
            textAlign: "center"
          }}>
            Common Link
          </label>
          <input
            placeholder="Nhập link chung..."
            value={linkCommon || ""}
            onChange={(e) => handleChange(idx, `${prefix}Common`, e.target.value)}
            style={{
              width: "100%",
              padding: "8px 12px",
              border: "1px solid #6f42c1",
              borderRadius: "6px",
              fontSize: "12px",
              outline: "none",
              transition: "border-color 0.3s ease",
              boxSizing: "border-box"
            }}
            onFocus={(e) => e.target.style.borderColor = "#5a2d91"}
            onBlur={(e) => e.target.style.borderColor = "#6f42c1"}
          />
        </div>

        {/* Radio buttons for display option */}
        <div style={{ 
          fontSize: 10,
          display: "flex",
          flexDirection: "column",
          gap: 0,
          marginTop: 4,
          padding: "4px 4px 4px 0",
          margin: 0,
          width: "100%",
          background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
          borderRadius: "4px",
          border: "1px solid #dee2e6",
          boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
        }}>
          <label style={{ 
            display: "flex", 
            alignItems: "center", 
            cursor: "pointer",
            margin: 0,
            padding: "2px 0",
            width: "100%",
            whiteSpace: "nowrap"
          }}>
            <input
              type="radio"
              name={`${prefix}Show_${idx}_${type || columnKey}`}
              value="32"
              checked={show === "32"}
              onChange={(e) => handleChange(idx, showKey, e.target.value)}
              style={{
                margin: 0,
                marginRight: 4,
                marginLeft: 0,
                transform: "scale(0.6)",
                accentColor: "#007bff",
                width: "12px",
                height: "12px"
              }}
            />
            <span style={{ 
              fontSize: "10px",
              fontWeight: show === "32" ? "700" : "500",
              color: show === "32" ? "#007bff" : "#6c757d",
              textShadow: show === "32" ? "0 1px 2px rgba(0,123,255,0.3)" : "none",
              transition: "all 0.2s ease",
              whiteSpace: "nowrap",
              flex: 1,
              lineHeight: "1.2"
            }}>
              Hiển 32-bit
            </span>
          </label>
          <label style={{ 
            display: "flex", 
            alignItems: "center", 
            cursor: "pointer",
            margin: 0,
            padding: "2px 0",
            width: "100%",
            whiteSpace: "nowrap"
          }}>
            <input
              type="radio"
              name={`${prefix}Show_${idx}_${type || columnKey}`}
              value="64"
              checked={show === "64"}
              onChange={(e) => handleChange(idx, showKey, e.target.value)}
              style={{
                margin: 0,
                marginRight: 4,
                marginLeft: 0,
                transform: "scale(0.6)",
                accentColor: "#007bff",
                width: "12px",
                height: "12px"
              }}
            />
            <span style={{ 
              fontSize: "10px",
              fontWeight: show === "64" ? "700" : "500",
              color: show === "64" ? "#007bff" : "#6c757d",
              textShadow: show === "64" ? "0 1px 2px rgba(0,123,255,0.3)" : "none",
              transition: "all 0.2s ease",
              whiteSpace: "nowrap",
              flex: 1,
              lineHeight: "1.2"
            }}>
              Hiển 64-bit
            </span>
          </label>
          <label style={{ 
            display: "flex", 
            alignItems: "center", 
            cursor: "pointer",
            margin: 0,
            padding: "2px 0",
            width: "100%",
            whiteSpace: "nowrap"
          }}>
            <input
              type="radio"
              name={`${prefix}Show_${idx}_${type || columnKey}`}
              value="common"
              checked={show === "common"}
              onChange={(e) => handleChange(idx, showKey, e.target.value)}
              style={{
                margin: 0,
                marginRight: 4,
                marginLeft: 0,
                transform: "scale(0.6)",
                accentColor: "#28a745",
                width: "12px",
                height: "12px"
              }}
            />
            <span style={{ 
              fontSize: "10px",
              fontWeight: show === "common" ? "700" : "500",
              color: show === "common" ? "#28a745" : "#6c757d",
              textShadow: show === "common" ? "0 1px 2px rgba(40,167,69,0.3)" : "none",
              transition: "all 0.2s ease",
              whiteSpace: "nowrap",
              flex: 1,
              lineHeight: "1.2"
            }}>
              Hiển Common
            </span>
          </label>
          <label style={{ 
            display: "flex", 
            alignItems: "center", 
            cursor: "pointer",
            margin: 0,
            padding: "2px 0",
            width: "100%",
            whiteSpace: "nowrap"
          }}>
            <input
              type="radio"
              name={`${prefix}Show_${idx}_${type || columnKey}`}
              value="both"
              checked={show === "both"}
              onChange={(e) => handleChange(idx, showKey, e.target.value)}
              style={{
                margin: 0,
                marginRight: 4,
                marginLeft: 0,
                transform: "scale(0.6)",
                accentColor: "#007bff",
                width: "12px",
                height: "12px"
              }}
            />
            <span style={{ 
              fontSize: "10px",
              fontWeight: show === "both" ? "700" : "500",
              color: show === "both" ? "#007bff" : "#6c757d",
              textShadow: show === "both" ? "0 1px 2px rgba(0,123,255,0.3)" : "none",
              transition: "all 0.2s ease",
              whiteSpace: "nowrap",
              flex: 1,
              lineHeight: "1.2"
            }}>
              Hiển cả hai
            </span>
          </label>
          <label style={{ 
            display: "flex", 
            alignItems: "center", 
            cursor: "pointer",
            margin: 0,
            padding: "2px 0",
            width: "100%",
            whiteSpace: "nowrap"
          }}>
            <input
              type="radio"
              name={`${prefix}Show_${idx}_${type || columnKey}`}
              value="none"
              checked={show === "none"}
              onChange={(e) => handleChange(idx, showKey, e.target.value)}
              style={{
                margin: 0,
                marginRight: 4,
                marginLeft: 0,
                transform: "scale(0.6)",
                accentColor: "#dc3545",
                width: "12px",
                height: "12px"
              }}
            />
            <span style={{ 
              fontSize: "10px",
              fontWeight: show === "none" ? "700" : "500",
              color: show === "none" ? "#dc3545" : "#6c757d",
              textShadow: show === "none" ? "0 1px 2px rgba(220,53,69,0.3)" : "none",
              transition: "all 0.2s ease",
              whiteSpace: "nowrap",
              flex: 1,
              lineHeight: "1.2"
            }}>
              Ẩn
            </span>
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
  if (show === "common" && linkCommon)
    return (
      <a href={linkCommon} target="_blank" rel="noreferrer">
        Download chung
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
