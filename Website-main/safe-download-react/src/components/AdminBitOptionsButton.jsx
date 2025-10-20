import React, { useState } from 'react';

export default function AdminBitOptionsButton({ onOptionSelect }) {
  const [isOpen, setIsOpen] = useState(false);

  const options = [
    { 
      value: '32', 
      label: 'Hiển 32-bit', 
      icon: '🔵',
      color: '#007bff',
      description: 'Chỉ hiển thị phiên bản 32-bit'
    },
    { 
      value: '64', 
      label: 'Hiển 64-bit', 
      icon: '🔵',
      color: '#007bff',
      description: 'Chỉ hiển thị phiên bản 64-bit'
    },
    { 
      value: 'both', 
      label: 'Hiển cả hai', 
      icon: '🔵',
      color: '#007bff',
      description: 'Hiển thị cả 32-bit và 64-bit'
    },
    { 
      value: 'none', 
      label: 'Ẩn', 
      icon: '🔴',
      color: '#dc3545',
      description: 'Ẩn tất cả các phiên bản'
    }
  ];

  const handleSelect = (option) => {
    onOptionSelect(option);
    setIsOpen(false);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: '10px 16px',
          background: 'linear-gradient(135deg, #6f42c1 0%, #e83e8c 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          transition: 'all 0.3s ease',
          boxShadow: '0 3px 6px rgba(111, 66, 193, 0.3)',
          minWidth: '140px',
          justifyContent: 'center'
        }}
        onMouseOver={(e) => {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 5px 10px rgba(111, 66, 193, 0.4)';
        }}
        onMouseOut={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 3px 6px rgba(111, 66, 193, 0.3)';
        }}
      >
        ⚙️ Tùy chọn Bit
        <span style={{ 
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s ease',
          fontSize: '12px'
        }}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: '#fff',
          border: '1px solid #dee2e6',
          borderRadius: '8px',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
          zIndex: 1000,
          marginTop: '4px',
          minWidth: '200px',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '8px 12px',
            background: 'linear-gradient(135deg, #6f42c1 0%, #e83e8c 100%)',
            color: 'white',
            fontSize: '12px',
            fontWeight: '600'
          }}>
            🎛️ Tùy chọn hiển thị Bit
          </div>
          
          {options.map((option, index) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '13px',
                color: '#495057',
                fontWeight: '500',
                transition: 'all 0.2s ease',
                borderBottom: index < options.length - 1 ? '1px solid #f1f3f4' : 'none'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#f8f9fa';
                e.target.style.color = option.color;
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = '#495057';
              }}
            >
              <span style={{ fontSize: '16px' }}>{option.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ 
                  fontWeight: '600',
                  color: option.color,
                  marginBottom: '2px'
                }}>
                  {option.label}
                </div>
                <div style={{ 
                  fontSize: '11px',
                  color: '#6c757d',
                  fontStyle: 'italic'
                }}>
                  {option.description}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Overlay để đóng dropdown khi click outside */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999
          }}
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
