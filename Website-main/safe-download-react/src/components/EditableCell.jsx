import React from 'react';

const EditableCell = ({ isAdmin, value, onChange }) => {
  if (!isAdmin) {
    return <span>{value || ''}</span>;
  }

  return (
    <input
      type="text"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: '100%',
        border: '1px solid #ddd',
        borderRadius: 4,
        padding: '4px 6px',
        fontSize: '14px'
      }}
    />
  );
};

export default EditableCell;
