import React, { useState, useEffect } from 'react';

export default function DynamicDataEditor({ 
  category, 
  parentRecord, 
  parentModel, 
  columns, 
  onDataChange 
}) {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load existing data when component mounts or dependencies change
  useEffect(() => {
    if (columns && columns.length > 0) {
      loadExistingData();
    }
  }, [columns, parentRecord, category]);

  const loadExistingData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/dynamic-columns/data/${category}/${parentRecord || 'null'}?parentModel=${parentModel || ''}`
      );
      const result = await response.json();
      
      if (result.success) {
        const dataMap = {};
        result.data.forEach(item => {
          if (item.columnId && item.columnId._id) {
            dataMap[item.columnId._id] = item.value;
          }
        });
        setData(dataMap);
        onDataChange?.(dataMap);
      }
    } catch (error) {
      console.error('Error loading dynamic data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDataChange = async (columnId, value) => {
    const newData = { ...data, [columnId]: value };
    setData(newData);
    onDataChange?.(newData);

    // Auto-save after a short delay
    setIsSaving(true);
    try {
      const response = await fetch('http://localhost:5000/api/dynamic-columns/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          columnId,
          value,
          category,
          parentRecord,
          parentModel
        }),
      });

      const result = await response.json();
      if (!result.success) {
        console.error('Error saving data:', result.message);
      }
    } catch (error) {
      console.error('Error saving data:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const renderInput = (column) => {
    const value = data[column._id] || '';
    const isRequired = column.isRequired;

    switch (column.columnType) {
      case 'text':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleDataChange(column._id, e.target.value)}
            placeholder={`Nhập ${column.columnLabel.toLowerCase()}...`}
            required={isRequired}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleDataChange(column._id, e.target.value)}
            placeholder={`Nhập ${column.columnLabel.toLowerCase()}...`}
            required={isRequired}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
        );

      case 'email':
        return (
          <input
            type="email"
            value={value}
            onChange={(e) => handleDataChange(column._id, e.target.value)}
            placeholder={`Nhập ${column.columnLabel.toLowerCase()}...`}
            required={isRequired}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
        );

      case 'url':
        return (
          <input
            type="url"
            value={value}
            onChange={(e) => handleDataChange(column._id, e.target.value)}
            placeholder={`Nhập ${column.columnLabel.toLowerCase()}...`}
            required={isRequired}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
        );

      case 'date':
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => handleDataChange(column._id, e.target.value)}
            required={isRequired}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
        );

      case 'boolean':
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              checked={Boolean(value)}
              onChange={(e) => handleDataChange(column._id, e.target.checked)}
              style={{ transform: 'scale(1.2)' }}
            />
            <span style={{ fontSize: '14px', color: '#666' }}>
              {Boolean(value) ? 'Có' : 'Không'}
            </span>
          </div>
        );

      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleDataChange(column._id, e.target.value)}
            placeholder={`Nhập ${column.columnLabel.toLowerCase()}...`}
            required={isRequired}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
        );
    }
  };

  const getColumnTypeIcon = (type) => {
    const icons = {
      text: '📝',
      number: '🔢',
      email: '📧',
      url: '🔗',
      date: '📅',
      boolean: '✅'
    };
    return icons[type] || '📄';
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        ⏳ Đang tải dữ liệu...
      </div>
    );
  }

  if (!columns || columns.length === 0) {
    return (
      <div style={{
        padding: '20px',
        textAlign: 'center',
        color: '#666',
        background: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #dee2e6'
      }}>
        📭 Chưa có cột động nào cho danh mục này
      </div>
    );
  }

  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px'
      }}>
        <h3 style={{ margin: 0, color: '#333' }}>
          📊 Dữ liệu động - {category}
        </h3>
        {isSaving && (
          <span style={{
            padding: '4px 8px',
            background: '#ffc107',
            color: '#000',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 'bold'
          }}>
            💾 Đang lưu...
          </span>
        )}
      </div>

      <div style={{
        background: '#fff',
        border: '1px solid #dee2e6',
        borderRadius: '8px',
        overflow: 'hidden'
      }}>
        {columns.map((column) => (
          <div
            key={column._id}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '16px',
              borderBottom: '1px solid #f1f3f4'
            }}
          >
            <div style={{ width: '200px', flexShrink: 0 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '4px'
              }}>
                <span style={{ fontSize: '16px' }}>
                  {getColumnTypeIcon(column.columnType)}
                </span>
                <strong style={{ color: '#333' }}>
                  {column.columnLabel}
                </strong>
                {column.isRequired && (
                  <span style={{
                    color: '#dc3545',
                    fontSize: '12px'
                  }}>
                    *
                  </span>
                )}
              </div>
              {column.columnDescription && (
                <div style={{
                  fontSize: '12px',
                  color: '#666',
                  fontStyle: 'italic'
                }}>
                  {column.columnDescription}
                </div>
              )}
            </div>
            
            <div style={{ flex: 1, marginLeft: '20px' }}>
              {renderInput(column)}
            </div>
          </div>
        ))}
      </div>

      {Object.keys(data).length > 0 && (
        <div style={{
          marginTop: '15px',
          padding: '12px',
          background: '#e8f5e8',
          border: '1px solid #28a745',
          borderRadius: '6px',
          fontSize: '14px',
          color: '#155724'
        }}>
          💾 Dữ liệu được tự động lưu khi bạn thay đổi
        </div>
      )}
    </div>
  );
}
