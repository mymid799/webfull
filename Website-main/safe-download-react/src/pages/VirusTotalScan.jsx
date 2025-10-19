import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useAdminAuth from '../hooks/useAdminAuth';

export default function VirusTotalScan() {
  const [url, setUrl] = useState('');
  const [urls, setUrls] = useState('');
  const [scanResults, setScanResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [scanMode, setScanMode] = useState('single'); // 'single' or 'batch'
  const [scanHistory, setScanHistory] = useState([]);
  const [scanProgress, setScanProgress] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Check admin authentication
  const { isAdmin, isLoading: authLoading } = useAdminAuth();

  // Quét URL đơn lẻ
  const handleSingleScan = async () => {
    if (!url.trim()) {
      setErrorMessage('Vui lòng nhập URL cần quét!');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setScanProgress('Đang gửi URL để quét...');
    
    try {
      const response = await fetch('http://localhost:5000/api/virustotal/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url.trim() }),
      });

      const result = await response.json();
      
      if (result.success) {
        setScanResults([result.data]);
        addToHistory(result.data);
        setScanProgress('');
        setErrorMessage('');
      } else {
        setErrorMessage(`Lỗi: ${result.message}`);
        setScanProgress('');
      }
    } catch (error) {
      setErrorMessage(`Lỗi kết nối: ${error.message}`);
      setScanProgress('');
    } finally {
      setIsLoading(false);
    }
  };

  // Quét nhiều URL
  const handleBatchScan = async () => {
    if (!urls.trim()) {
      setErrorMessage('Vui lòng nhập danh sách URL cần quét!');
      return;
    }

    const urlList = urls.split('\n').map(u => u.trim()).filter(u => u);
    if (urlList.length === 0) {
      setErrorMessage('Không có URL hợp lệ nào!');
      return;
    }

    if (urlList.length > 10) {
      setErrorMessage('Tối đa 10 URL mỗi lần quét!');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setScanProgress(`Đang quét ${urlList.length} URL...`);
    
    try {
      const response = await fetch('http://localhost:5000/api/virustotal/batch-scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ urls: urlList }),
      });

      const result = await response.json();
      
      if (result.success) {
        setScanResults(result.data.results);
        result.data.results.forEach(addToHistory);
        setScanProgress('');
        setErrorMessage('');
      } else {
        setErrorMessage(`Lỗi: ${result.message}`);
        setScanProgress('');
      }
    } catch (error) {
      setErrorMessage(`Lỗi kết nối: ${error.message}`);
      setScanProgress('');
    } finally {
      setIsLoading(false);
    }
  };

  // Thêm vào lịch sử quét
  const addToHistory = (result) => {
    setScanHistory(prev => [result, ...prev.slice(0, 9)]); // Giữ tối đa 10 kết quả
  };

  // Xóa lịch sử
  const clearHistory = () => {
    setScanHistory([]);
  };

  // Format ngày tháng
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  // Render kết quả quét
  const renderScanResult = (result, index) => (
    <div key={index} style={{
      marginBottom: '20px',
      padding: '20px',
      border: '1px solid #dee2e6',
      borderRadius: '8px',
      background: '#fff'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px',
        paddingBottom: '10px',
        borderBottom: '1px solid #eee'
      }}>
        <div>
          <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>
            🔗 {result.url}
          </h4>
          <small style={{ color: '#666' }}>
            Quét lúc: {formatDate(result.scanDate)}
          </small>
        </div>
        <div style={{
          padding: '8px 16px',
          borderRadius: '20px',
          background: result.threatColor,
          color: 'white',
          fontWeight: 'bold',
          fontSize: '14px'
        }}>
          {result.threatLevel}
        </div>
      </div>

      {/* Thống kê */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '15px',
        marginBottom: '20px'
      }}>
        <div style={{ textAlign: 'center', padding: '10px', background: '#f8f9fa', borderRadius: '6px' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: result.isSafe ? '#28a745' : '#dc3545' }}>
            {result.detectedCount}/{result.totalEngines}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>Engine phát hiện</div>
        </div>
        <div style={{ textAlign: 'center', padding: '10px', background: '#f8f9fa', borderRadius: '6px' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>
            {result.totalEngines}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>Tổng engine</div>
        </div>
        <div style={{ textAlign: 'center', padding: '10px', background: '#f8f9fa', borderRadius: '6px' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: result.isSafe ? '#28a745' : '#dc3545' }}>
            {result.isSafe ? '✅' : '⚠️'}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>Trạng thái</div>
        </div>
      </div>

      {/* Chi tiết engine */}
      <div>
        <h5 style={{ margin: '0 0 10px 0', color: '#333' }}>📊 Chi tiết kết quả từ các engine:</h5>
        <div style={{
          maxHeight: '300px',
          overflowY: 'auto',
          border: '1px solid #dee2e6',
          borderRadius: '6px'
        }}>
          {result.scans.map((scan, scanIndex) => (
            <div key={scanIndex} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 12px',
              borderBottom: '1px solid #f1f3f4',
              background: scan.detected ? '#fff5f5' : '#f8fff8'
            }}>
              <div style={{ flex: 1 }}>
                <strong style={{ color: scan.detected ? '#dc3545' : '#28a745' }}>
                  {scan.engine}
                </strong>
                {scan.detected && (
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                    {scan.result}
                  </div>
                )}
              </div>
              <div style={{
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 'bold',
                background: scan.detected ? '#dc3545' : '#28a745',
                color: 'white'
              }}>
                {scan.detected ? 'PHÁT HIỆN' : 'SẠCH'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Link báo cáo */}
      {result.permalink && (
        <div style={{ marginTop: '15px', textAlign: 'center' }}>
          <a
            href={result.permalink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              padding: '8px 16px',
              background: '#007bff',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          >
            🔗 Xem báo cáo chi tiết trên VirusTotal
          </a>
        </div>
      )}
    </div>
  );

  return (
    <div style={{ maxWidth: 1200, margin: '40px auto', padding: '0 20px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ color: '#333', marginBottom: '10px' }}>
          🛡️ Quét Link bằng VirusTotal
        </h1>
        <p style={{ color: '#666', fontSize: '16px' }}>
          Sử dụng VirusTotal API để kiểm tra độ an toàn của các liên kết trước khi tải xuống
        </p>
      </div>

      {/* Quick Links - Only show for admins */}
      {!authLoading && isAdmin && (
        <div style={{ 
          marginBottom: 30, 
          padding: '15px', 
          background: '#f8f9fa', 
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>🔗 Liên kết nhanh (Admin)</h3>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Link 
              to="/admin"
              style={{
                display: 'inline-block',
                padding: '8px 16px',
                background: '#007bff',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '5px',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              ⚙️ Admin Panel
            </Link>
            <Link 
              to="/admin-feedback"
              style={{
                display: 'inline-block',
                padding: '8px 16px',
                background: '#28a745',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '5px',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              📊 Quản lý phản hồi
            </Link>
          </div>
        </div>
      )}

      {/* Info for regular users */}
      {!authLoading && !isAdmin && (
        <div style={{ 
          marginBottom: 30, 
          padding: '15px', 
          background: '#e3f2fd', 
          borderRadius: '8px',
          border: '1px solid #2196f3'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>ℹ️ Thông tin</h3>
          <p style={{ margin: '0', color: '#1976d2', fontSize: '14px' }}>
            Tính năng quét link VirusTotal giúp kiểm tra độ an toàn của các liên kết trước khi tải xuống. 
            Bạn có thể quét URL đơn lẻ hoặc nhiều URL cùng lúc để đảm bảo an toàn.
          </p>
        </div>
      )}

      {/* Scan Controls */}
      <div style={{
        background: '#fff',
        padding: '25px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>🔍 Chọn chế độ quét</h3>
        
        {/* Mode Selection */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ marginRight: '20px', cursor: 'pointer' }}>
            <input
              type="radio"
              name="scanMode"
              value="single"
              checked={scanMode === 'single'}
              onChange={(e) => setScanMode(e.target.value)}
              style={{ marginRight: '8px' }}
            />
            Quét URL đơn lẻ
          </label>
          <label style={{ cursor: 'pointer' }}>
            <input
              type="radio"
              name="scanMode"
              value="batch"
              checked={scanMode === 'batch'}
              onChange={(e) => setScanMode(e.target.value)}
              style={{ marginRight: '8px' }}
            />
            Quét nhiều URL (tối đa 10)
          </label>
        </div>

        {/* Single URL Scan */}
        {scanMode === 'single' && (
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              URL cần quét:
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/file.exe"
                style={{
                  flex: 1,
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '16px'
                }}
              />
              <button
                onClick={handleSingleScan}
                disabled={isLoading}
                style={{
                  padding: '12px 24px',
                  background: isLoading ? '#6c757d' : '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
              >
                {isLoading ? '⏳ Đang quét...' : '🔍 Quét ngay'}
              </button>
            </div>
          </div>
        )}

        {/* Batch URL Scan */}
        {scanMode === 'batch' && (
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Danh sách URL (mỗi URL một dòng):
            </label>
            <div>
              <textarea
                value={urls}
                onChange={(e) => setUrls(e.target.value)}
                placeholder="https://example1.com/file1.exe&#10;https://example2.com/file2.exe&#10;https://example3.com/file3.exe"
                rows="6"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '16px',
                  fontFamily: 'monospace',
                  marginBottom: '10px'
                }}
              />
              <button
                onClick={handleBatchScan}
                disabled={isLoading}
                style={{
                  padding: '12px 24px',
                  background: isLoading ? '#6c757d' : '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
              >
                {isLoading ? '⏳ Đang quét...' : '🔍 Quét tất cả'}
              </button>
            </div>
          </div>
        )}

        {/* Progress and Error Messages */}
        {scanProgress && (
          <div style={{
            marginTop: '15px',
            padding: '12px',
            background: '#e3f2fd',
            border: '1px solid #2196f3',
            borderRadius: '6px',
            color: '#1976d2',
            fontSize: '14px'
          }}>
            <strong>📊 Tiến trình:</strong> {scanProgress}
          </div>
        )}

        {errorMessage && (
          <div style={{
            marginTop: '15px',
            padding: '12px',
            background: '#ffebee',
            border: '1px solid #f44336',
            borderRadius: '6px',
            color: '#d32f2f',
            fontSize: '14px'
          }}>
            <strong>❌ Lỗi:</strong> {errorMessage}
          </div>
        )}
      </div>

      {/* Scan Results */}
      {scanResults && (
        <div style={{
          background: '#fff',
          padding: '25px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          marginBottom: '30px'
        }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>
            📊 Kết quả quét ({scanResults.length} URL)
          </h3>
          {scanResults.map((result, index) => renderScanResult(result, index))}
        </div>
      )}

      {/* Scan History */}
      {scanHistory.length > 0 && (
        <div style={{
          background: '#fff',
          padding: '25px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h3 style={{ margin: '0', color: '#333' }}>
              📚 Lịch sử quét gần đây
            </h3>
            <button
              onClick={clearHistory}
              style={{
                padding: '6px 12px',
                background: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              🗑️ Xóa lịch sử
            </button>
          </div>
          {scanHistory.map((result, index) => renderScanResult(result, index))}
        </div>
      )}
    </div>
  );
}
