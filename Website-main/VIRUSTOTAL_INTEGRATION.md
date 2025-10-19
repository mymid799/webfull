# 🛡️ VirusTotal Integration Documentation

## Tổng quan
Tính năng quét link bằng VirusTotal API đã được tích hợp vào hệ thống admin, cho phép kiểm tra độ an toàn của các URL trước khi tải xuống.

## 🔧 Cấu hình Backend

### API Key
- **VirusTotal API Key**: `937f68620325cd04af5e362a207ec94d0d8a3ee43e225d4baad254e1c97e0dc6`
- **Base URL**: `https://www.virustotal.com/vtapi/v2`

### Dependencies
```json
{
  "axios": "^1.6.0"
}
```

### Cấu trúc Backend

#### 1. Service Layer (`services/virustotalService.js`)
- **VirusTotalService**: Class chính xử lý tất cả tương tác với VirusTotal API
- **Methods**:
  - `scanUrl(url)`: Quét URL đơn lẻ
  - `getUrlReport(url)`: Lấy báo cáo URL đã quét
  - `formatScanResult(data)`: Format kết quả từ VirusTotal
  - `calculateThreatLevel(detectedCount, totalEngines)`: Tính mức độ đe dọa
  - `getThreatColor(threatLevel)`: Lấy màu sắc theo mức độ đe dọa

#### 2. Controller Layer (`controllers/virustotalController.js`)
- **scanUrl**: POST `/api/virustotal/scan`
- **getUrlReport**: GET `/api/virustotal/report/:url`
- **batchScanUrls**: POST `/api/virustotal/batch-scan`
- **getScanStats**: GET `/api/virustotal/stats`

#### 3. Routes (`routes/virustotalRoutes.js`)
- Định nghĩa tất cả endpoints cho VirusTotal API

## 🎨 Frontend Components

### VirusTotalScan Page (`pages/VirusTotalScan.jsx`)
- **Chức năng chính**:
  - Quét URL đơn lẻ
  - Quét nhiều URL cùng lúc (tối đa 10)
  - Hiển thị kết quả chi tiết
  - Lưu lịch sử quét
  - Giao diện thân thiện với admin

### Navigation Integration
- Thêm link "🔍 Quét Link" vào navigation menu
- Thêm link "🔍 Quét Link VirusTotal" vào Admin Panel

## 📊 Tính năng

### 1. Quét URL đơn lẻ
- Nhập URL cần quét
- Hiển thị kết quả chi tiết từ VirusTotal
- Phân loại mức độ đe dọa: An toàn, Rủi ro thấp, Rủi ro trung bình, Rủi ro cao, Rất nguy hiểm

### 2. Quét hàng loạt
- Nhập tối đa 10 URL cùng lúc
- Quét song song tất cả URL
- Hiển thị kết quả tổng hợp

### 3. Hiển thị kết quả
- **Thống kê tổng quan**: Số engine phát hiện/tổng số engine
- **Mức độ đe dọa**: Màu sắc và nhãn rõ ràng
- **Chi tiết từng engine**: Danh sách tất cả engine và kết quả
- **Link báo cáo**: Liên kết đến báo cáo chi tiết trên VirusTotal

### 4. Lịch sử quét
- Lưu 10 kết quả quét gần nhất
- Xóa lịch sử khi cần
- Truy cập nhanh các URL đã quét

## 🚀 Cách sử dụng

### 1. Khởi động Backend
```bash
cd Website-main/backend
npm install
npm start
```

### 2. Khởi động Frontend
```bash
cd Website-main/safe-download-react
npm install
npm run dev
```

### 3. Truy cập tính năng
- Vào trang chủ → Click "🔍 Quét Link"
- Hoặc từ Admin Panel → Click "🔍 Quét Link VirusTotal"

## 🔍 API Endpoints

### POST `/api/virustotal/scan`
Quét URL đơn lẻ với retry logic tối ưu
```json
{
  "url": "https://example.com/file.exe"
}
```

### POST `/api/virustotal/batch-scan`
Quét nhiều URL (tối đa 10)
```json
{
  "urls": [
    "https://example1.com/file1.exe",
    "https://example2.com/file2.exe"
  ]
}
```

### GET `/api/virustotal/report/:url`
Lấy báo cáo URL đã quét

### GET `/api/virustotal/status/:scanId`
Kiểm tra trạng thái quét theo scan ID

### GET `/api/virustotal/stats`
Lấy thống kê quét

## 📋 Response Format

```json
{
  "success": true,
  "message": "Quét URL thành công",
  "data": {
    "url": "https://example.com",
    "scanDate": "2024-01-01T00:00:00Z",
    "totalEngines": 70,
    "detectedCount": 0,
    "threatLevel": "An toàn",
    "threatColor": "#28a745",
    "isSafe": true,
    "scanId": "scan_id_here",
    "permalink": "https://virustotal.com/report/...",
    "scans": [
      {
        "engine": "Avast",
        "detected": false,
        "result": "clean",
        "version": "1.0.0",
        "update": "20240101"
      }
    ]
  }
}
```

## 🧪 Testing

### Chạy test VirusTotal cơ bản
```bash
cd Website-main/backend
node test-virustotal.js
```

### Chạy test VirusTotal tối ưu hóa
```bash
cd Website-main/backend
node test-virustotal-optimized.js
```

### Test cases
1. Quét URL an toàn (Google, GitHub)
2. Quét URL có thể nguy hiểm
3. Quét hàng loạt nhiều URL
4. Lấy thống kê quét
5. Kiểm tra retry logic với URL mới

## 🔒 Bảo mật

- API key được lưu trữ an toàn trong backend
- Không expose API key ra frontend
- Validate URL format trước khi quét
- Giới hạn số lượng URL mỗi lần quét (tối đa 10)

## 🎯 Mức độ đe dọa

| Mức độ | Màu sắc | Mô tả |
|--------|---------|-------|
| An toàn | 🟢 Xanh lá | 0 engine phát hiện |
| Rủi ro thấp | 🟡 Vàng | < 10% engine phát hiện |
| Rủi ro trung bình | 🟠 Cam | 10-30% engine phát hiện |
| Rủi ro cao | 🔴 Đỏ | 30-60% engine phát hiện |
| Rất nguy hiểm | 🟣 Tím | > 60% engine phát hiện |

## 📝 Ghi chú

- VirusTotal API có giới hạn rate limit
- Mỗi lần quét mất khoảng 10-30 giây (tùy thuộc vào độ phức tạp)
- Kết quả được cache trên VirusTotal
- Có thể lấy báo cáo URL đã quét trước đó mà không cần quét lại
- **Tối ưu hóa mới**: Retry logic với exponential backoff
- **Xử lý lỗi**: Tự động retry khi gặp "Resource does not exist"
- **Frontend**: Hiển thị tiến trình và thông báo lỗi rõ ràng
