import React, { useState, useEffect } from 'react';

export default function DynamicColumnManager({ category, onColumnsChange }) {
  const [columns, setColumns] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingColumn, setEditingColumn] = useState(null);
  const [newColumn, setNewColumn] = useState({
    columnName: '',
    columnType: 'text',
    columnLabel: '',
    columnDescription: '',
    isRequired: false,
    validationRules: {}
  });

  // Load columns on mount and when category changes
  useEffect(() => {
    loadColumns();
  }, [category]);

  const loadColumns = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/dynamic-columns/${category}`);
      const result = await response.json();
      
      if (result.success) {
        setColumns(result.data);
        onColumnsChange?.(result.data);
      } else {
        console.error('Error loading columns:', result.message);
      }
    } catch (error) {
      console.error('Error loading columns:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddColumn = async () => {
    if (!newColumn.columnName.trim() || !newColumn.columnLabel.trim()) {
      alert('Vui lòng nhập tên cột và nhãn cột!');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/dynamic-columns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newColumn,
          category
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setColumns([...columns, result.data]);
        setShowAddModal(false);
        setNewColumn({
          columnName: '',
          columnType: 'text',
          columnLabel: '',
          columnDescription: '',
          isRequired: false,
          validationRules: {}
        });
        onColumnsChange?.([...columns, result.data]);
      } else {
        alert(`Lỗi: ${result.message}`);
      }
    } catch (error) {
      alert(`Lỗi kết nối: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteColumn = async (columnId) => {
    if (!confirm('Bạn có chắc muốn xóa cột này? Tất cả dữ liệu liên quan sẽ bị xóa!')) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/dynamic-columns/${columnId}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      
      if (result.success) {
        setColumns(columns.filter(col => col._id !== columnId));
        onColumnsChange?.(columns.filter(col => col._id !== columnId));
      } else {
        alert(`Lỗi: ${result.message}`);
      }
    } catch (error) {
      alert(`Lỗi kết nối: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleVisibility = async (columnId, isVisible) => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/dynamic-columns/${columnId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isVisible: !isVisible }),
      });

      const result = await response.json();
      
      if (result.success) {
        setColumns(columns.map(col => 
          col._id === columnId ? { ...col, isVisible: !isVisible } : col
        ));
        onColumnsChange?.(columns.map(col => 
          col._id === columnId ? { ...col, isVisible: !isVisible } : col
        ));
      } else {
        alert(`Lỗi: ${result.message}`);
      }
    } catch (error) {
      alert(`Lỗi kết nối: ${error.message}`);
    } finally {
      setIsLoading(false);
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

  const getColumnTypeLabel = (type) => {
    const labels = {
      text: 'Văn bản',
      number: 'Số',
      email: 'Email',
      url: 'URL',
      date: 'Ngày',
      boolean: 'Có/Không'
    };
    return labels[type] || type;
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px'
      }}>
        <h3 style={{ margin: 0, color: '#333' }}>
          🗂️ Quản lý cột động - {category}
        </h3>
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            padding: '8px 16px',
            background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
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
            boxShadow: '0 3px 6px rgba(40, 167, 69, 0.3)',
            minWidth: '140px',
            justifyContent: 'center'
          }}
          onMouseOver={(e) => {
            e.target.style.background = 'linear-gradient(135deg, #218838 0%, #1ea085 100%)';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 5px 10px rgba(40, 167, 69, 0.4)';
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 3px 6px rgba(40, 167, 69, 0.3)';
          }}
        >
          ➕ Thêm cột mới
        </button>
      </div>

      {/* Columns List */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          ⏳ Đang tải...
        </div>
      ) : (
        <div style={{
          background: '#fff',
          border: '1px solid #dee2e6',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          {columns.length === 0 ? (
            <div style={{
              padding: '20px',
              textAlign: 'center',
              color: '#666'
            }}>
              📭 Chưa có cột động nào
            </div>
          ) : (
            columns.map((column) => (
              <div
                key={column._id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 16px',
                  borderBottom: '1px solid #f1f3f4',
                  background: column.isVisible ? '#fff' : '#f8f9fa'
                }}
              >
                <div style={{ flex: 1 }}>
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
                    <span style={{
                      padding: '2px 6px',
                      background: '#e9ecef',
                      borderRadius: '4px',
                      fontSize: '12px',
                      color: '#666'
                    }}>
                      {getColumnTypeLabel(column.columnType)}
                    </span>
                    {column.isRequired && (
                      <span style={{
                        padding: '2px 6px',
                        background: '#dc3545',
                        color: 'white',
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}>
                        Bắt buộc
                      </span>
                    )}
                    {!column.isVisible && (
                      <span style={{
                        padding: '2px 6px',
                        background: '#6c757d',
                        color: 'white',
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}>
                        Ẩn
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    Key: {column.columnKey}
                    {column.columnDescription && ` • ${column.columnDescription}`}
                  </div>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  gap: '6px', 
                  alignItems: 'center',
                  flexShrink: 0
                }}>
                  <button
                    onClick={() => handleToggleVisibility(column._id, column.isVisible)}
                    style={{
                      padding: '5px 10px',
                      background: column.isVisible 
                        ? 'linear-gradient(135deg, #ffc107 0%, #e0a800 100%)' 
                        : 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '11px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px',
                      transition: 'all 0.2s ease',
                      boxShadow: column.isVisible 
                        ? '0 2px 4px rgba(255, 193, 7, 0.3)' 
                        : '0 2px 4px rgba(40, 167, 69, 0.3)',
                      minWidth: '70px',
                      justifyContent: 'center'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = column.isVisible 
                        ? 'linear-gradient(135deg, #e0a800 0%, #d39e00 100%)' 
                        : 'linear-gradient(135deg, #218838 0%, #1ea085 100%)';
                      e.target.style.transform = 'translateY(-1px)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = column.isVisible 
                        ? 'linear-gradient(135deg, #ffc107 0%, #e0a800 100%)' 
                        : 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
                      e.target.style.transform = 'translateY(0)';
                    }}
                    title={column.isVisible ? 'Ẩn cột' : 'Hiện cột'}
                  >
                    {column.isVisible ? '👁️ Ẩn' : '👁️‍🗨️ Hiện'}
                  </button>
                  
                  <button
                    onClick={() => handleDeleteColumn(column._id)}
                    style={{
                      padding: '5px 10px',
                      background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '11px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 4px rgba(220, 53, 69, 0.3)',
                      minWidth: '70px',
                      justifyContent: 'center'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = 'linear-gradient(135deg, #c82333 0%, #a71e2a 100%)';
                      e.target.style.transform = 'translateY(-1px)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)';
                      e.target.style.transform = 'translateY(0)';
                    }}
                    title="Xóa cột"
                  >
                    🗑️ Xóa
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add Column Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2000,
        }}>
          <div style={{
            background: '#fff',
            padding: '24px',
            borderRadius: '12px',
            minWidth: '400px',
            maxWidth: '90vw',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          }}>
            <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>
              ➕ Thêm cột động mới
            </h3>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
                Tên cột (key):
              </label>
              <input
                type="text"
                value={newColumn.columnName}
                onChange={(e) => setNewColumn({ ...newColumn, columnName: e.target.value })}
                placeholder="Ví dụ: version, edition, sha1"
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
                Nhãn hiển thị:
              </label>
              <input
                type="text"
                value={newColumn.columnLabel}
                onChange={(e) => setNewColumn({ ...newColumn, columnLabel: e.target.value })}
                placeholder="Ví dụ: Version, Edition, SHA-1"
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
                Loại dữ liệu:
              </label>
              <select
                value={newColumn.columnType}
                onChange={(e) => setNewColumn({ ...newColumn, columnType: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                }}
              >
                <option value="text">📝 Văn bản</option>
                <option value="number">🔢 Số</option>
                <option value="email">📧 Email</option>
                <option value="url">🔗 URL</option>
                <option value="date">📅 Ngày</option>
                <option value="boolean">✅ Có/Không</option>
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
                Mô tả (tùy chọn):
              </label>
              <textarea
                value={newColumn.columnDescription}
                onChange={(e) => setNewColumn({ ...newColumn, columnDescription: e.target.value })}
                placeholder="Mô tả về cột này..."
                rows="3"
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  checked={newColumn.isRequired}
                  onChange={(e) => setNewColumn({ ...newColumn, isRequired: e.target.checked })}
                />
                <span>Bắt buộc nhập</span>
              </label>
            </div>
            
            <div style={{ 
              display: 'flex', 
              gap: '12px', 
              marginTop: '16px',
              justifyContent: 'center'
            }}>
              <button
                onClick={handleAddColumn}
                disabled={isLoading}
                style={{
                  flex: '0 1 140px',
                  padding: '10px 16px',
                  background: isLoading 
                    ? 'linear-gradient(135deg, #6c757d 0%, #5a6268 100%)' 
                    : 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  fontSize: '13px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'all 0.3s ease',
                  boxShadow: isLoading 
                    ? '0 2px 4px rgba(108, 117, 125, 0.2)' 
                    : '0 3px 6px rgba(40, 167, 69, 0.3)'
                }}
                onMouseOver={(e) => {
                  if (!isLoading) {
                    e.target.style.background = 'linear-gradient(135deg, #218838 0%, #1ea085 100%)';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 5px 10px rgba(40, 167, 69, 0.4)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isLoading) {
                    e.target.style.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 3px 6px rgba(40, 167, 69, 0.3)';
                  }
                }}
              >
                {isLoading ? '⏳ Đang tạo...' : '✅ Tạo cột'}
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewColumn({
                    columnName: '',
                    columnType: 'text',
                    columnLabel: '',
                    columnDescription: '',
                    isRequired: false,
                    validationRules: {}
                  });
                }}
                style={{
                  flex: '0 1 140px',
                  padding: '10px 16px',
                  border: '2px solid #dee2e6',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 3px 6px rgba(0, 0, 0, 0.1)'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%)';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 5px 10px rgba(0, 0, 0, 0.15)';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 3px 6px rgba(0, 0, 0, 0.1)';
                }}
              >
                ❌ Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
