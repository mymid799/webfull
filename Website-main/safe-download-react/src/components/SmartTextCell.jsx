import React from 'react';

const SmartTextCell = ({ isAdmin, value, onChange }) => {
  // Function to detect if text is a URL
  const isUrl = (text) => {
    if (!text) return false;
    const trimmedText = text.trim();
    
    // More comprehensive URL patterns
    const patterns = [
      // Standard URLs with protocol
      /^https?:\/\/.+/i,
      // URLs without protocol but with common TLDs
      /^[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}(\/.*)?$/i,
      // URLs with www
      /^www\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}(\/.*)?$/i,
      // IP addresses
      /^(\d{1,3}\.){3}\d{1,3}(:\d+)?(\/.*)?$/,
      // Localhost
      /^localhost(:\d+)?(\/.*)?$/i
    ];
    
    return patterns.some(pattern => pattern.test(trimmedText));
  };

  // Function to format URL for display
  const formatUrl = (url) => {
    const trimmedUrl = url.trim();
    if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
      return `https://${trimmedUrl}`;
    }
    return trimmedUrl;
  };

  // Function to get domain from URL for display
  const getDomain = (url) => {
    try {
      const formattedUrl = formatUrl(url);
      const urlObj = new URL(formattedUrl);
      let domain = urlObj.hostname;
      
      // Remove www. prefix
      if (domain.startsWith('www.')) {
        domain = domain.substring(4);
      }
      
      // For IP addresses, show the IP
      if (/^(\d{1,3}\.){3}\d{1,3}$/.test(domain)) {
        return domain;
      }
      
      // For localhost, show localhost
      if (domain === 'localhost') {
        return 'localhost';
      }
      
      return domain;
    } catch (error) {
      // Fallback: return original text if URL parsing fails
      return url;
    }
  };

  if (isAdmin) {
    // Admin view: editable input
    return (
      <input
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          border: "none",
          outline: "none",
          background: "transparent",
          fontSize: "14px",
          padding: "4px 8px",
          borderRadius: "4px",
          transition: "all 0.2s ease"
        }}
        onFocus={(e) => {
          e.target.style.background = "#f8f9fa";
          e.target.style.border = "1px solid #007bff";
        }}
        onBlur={(e) => {
          e.target.style.background = "transparent";
          e.target.style.border = "none";
        }}
      />
    );
  } else {
    // User view: display as link if it's a URL, otherwise as text
    if (isUrl(value)) {
      const formattedUrl = formatUrl(value);
      const displayText = getDomain(value);
      
      return (
        <a
          href={formattedUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "#007bff",
            textDecoration: "none",
            fontWeight: "500",
            fontSize: "14px",
            display: "inline-block",
            padding: "4px 8px",
            borderRadius: "4px",
            background: "#f8f9fa",
            border: "1px solid #e9ecef",
            transition: "all 0.2s ease",
            maxWidth: "100%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            cursor: "pointer"
          }}
          onMouseOver={(e) => {
            e.target.style.background = "#e9ecef";
            e.target.style.color = "#0056b3";
            e.target.style.textDecoration = "underline";
            e.target.style.transform = "scale(1.02)";
          }}
          onMouseOut={(e) => {
            e.target.style.background = "#f8f9fa";
            e.target.style.color = "#007bff";
            e.target.style.textDecoration = "none";
            e.target.style.transform = "scale(1)";
          }}
          title={`Click to open: ${formattedUrl}`}
        >
          🔗 {displayText}
        </a>
      );
    } else {
      // Regular text - check if it contains any URLs within the text
      const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}(\/[^\s]*)?)/gi;
      const urls = value?.match(urlRegex) || [];
      
      if (urls.length > 0) {
        // Text contains URLs, render with clickable links
        const parts = value.split(urlRegex);
        return (
          <span style={{
            fontSize: "14px",
            color: "#333",
            padding: "4px 8px",
            display: "inline-block",
            lineHeight: "1.4"
          }}>
            {parts.map((part, index) => {
              if (urls.includes(part)) {
                const formattedUrl = formatUrl(part);
                const displayText = getDomain(part);
                return (
                  <a
                    key={index}
                    href={formattedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "#007bff",
                      textDecoration: "none",
                      fontWeight: "500",
                      background: "#f8f9fa",
                      padding: "2px 4px",
                      borderRadius: "3px",
                      border: "1px solid #e9ecef",
                      margin: "0 2px",
                      display: "inline-block"
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = "#e9ecef";
                      e.target.style.color = "#0056b3";
                      e.target.style.textDecoration = "underline";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = "#f8f9fa";
                      e.target.style.color = "#007bff";
                      e.target.style.textDecoration = "none";
                    }}
                    title={`Click to open: ${formattedUrl}`}
                  >
                    🔗 {displayText}
                  </a>
                );
              }
              return part;
            })}
          </span>
        );
      } else {
        // Regular text
        return (
          <span style={{
            fontSize: "14px",
            color: "#333",
            padding: "4px 8px",
            display: "inline-block"
          }}>
            {value || "-"}
          </span>
        );
      }
    }
  }
};

export default SmartTextCell;
