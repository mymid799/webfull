import React, { useState } from 'react';

export default function BitOptionsDropdown({ 
  value, 
  onChange, 
  placeholder = "Chọn tùy chọn hiển thị",
  disabled = false 
}) {
  const [isOpen, setIsOpen] = useState(false);

  const options = [
    { value: '32', label: 'Hiển 32-bit', color: '#007bff' },
    { value: '64', label: 'Hiển 64-bit', color: '#007bff' },
    { value: 'both', label: 'Hiển cả hai', color: '#007bff' },
    { value: 'none', label: 'Ẩn', color: '#dc3545' }
  ];

  const selectedOption = options.find(opt => opt.value === value);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        style={{
          width: '100%',
          padding: '8px 12px',
          border: '1px solid #ced4da',
          borderRadius: '6px',
          background: disabled ? '#f8f9fa' : '#fff',
          cursor: disabled ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '13px',
          color: disabled ? '#6c757d' : '#495057',
          transition: 'all 0.2s ease'
        }}
        onMouseOver={(e) => {
          if (!disabled) {
            e.target.style.borderColor = '#007bff';
            e.target.style.boxShadow = '0 0 0 2px rgba(0, 123, 255, 0.25)';
          }
        }}
        onMouseOut={(e) => {
          if (!disabled) {
            e.target.style.borderColor = '#ced4da';
            e.target.style.boxShadow = 'none';
          }
        }}
      >
        <span style={{ 
          color: selectedOption ? selectedOption.color : '#6c757d',
          fontWeight: selectedOption ? '600' : '400'
        }}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span style={{ 
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s ease',
          fontSize: '12px'
        }}>
          ▼
        </span>
      </button>

      {isOpen && !disabled && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: '#fff',
          border: '1px solid #ced4da',
          borderRadius: '6px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          zIndex: 1000,
          marginTop: '2px'
        }}>
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: 'none',
                background: value === option.value ? '#f8f9fa' : 'transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                fontSize: '13px',
                color: option.color,
                fontWeight: value === option.value ? '600' : '400',
                transition: 'all 0.2s ease',
                borderBottom: '1px solid #f1f3f4'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#f8f9fa';
              }}
              onMouseOut={(e) => {
                e.target.style.background = value === option.value ? '#f8f9fa' : 'transparent';
              }}
            >
              <span style={{ marginRight: '8px' }}>
                {value === option.value ? '●' : '○'}
              </span>
              {option.label}
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
