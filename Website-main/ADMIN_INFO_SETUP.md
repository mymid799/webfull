# Hướng dẫn cài đặt chức năng Thông tin Admin

## 🎯 Chức năng đã được thêm

### Backend (Database)
- ✅ **Model AdminInfo**: Lưu trữ thông tin admin trong database
- ✅ **API Endpoints**:
  - `GET /api/admin-info/public` - Lấy thông tin admin (public)
  - `GET /api/admin-info` - Lấy thông tin admin (admin only)
  - `PUT /api/admin-info` - Cập nhật thông tin admin (admin only)

### Frontend
- ✅ **Nút thông tin admin**: Kế bên nút đổi mật khẩu (icon 👤)
- ✅ **Modal hiển thị**: Hiển thị thông tin admin cho người dùng
- ✅ **Modal chỉnh sửa**: Admin có thể chỉnh sửa thông tin
- ✅ **Tích hợp API**: Kết nối với backend để lưu/load dữ liệu

## 🚀 Cách sử dụng

### 1. Khởi động Backend
```bash
cd Website-main/backend
npm install
# Tạo file .env với nội dung:
# MONGO_URI=mongodb://localhost:27017/safedownload
# PORT=5000
npm start
```

### 2. Khởi động Frontend
```bash
cd Website-main/safe-download-react
npm install
npm run dev
```

### 3. Sử dụng chức năng

#### Cho người dùng thường:
- Click vào icon 👤 ở góc phải màn hình
- Xem thông tin liên hệ admin

#### Cho admin:
- Click vào icon 👤 để xem thông tin
- Click "Chỉnh sửa" để cập nhật thông tin
- Thông tin sẽ được lưu vào database

## 📋 Thông tin có thể lưu trữ

- **Tên admin** (bắt buộc)
- **Email** (bắt buộc)
- **Số điện thoại**
- **Telegram**
- **Facebook**
- **Zalo**
- **Chức vụ**
- **Giờ làm việc**
- **Mô tả**

## 🔧 Cấu trúc Database

```javascript
{
  adminName: String (required),
  adminEmail: String (required),
  adminPhone: String,
  adminTelegram: String,
  adminFacebook: String,
  adminZalo: String,
  adminTitle: String,
  adminDescription: String,
  workingHours: String,
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

## 🎨 Giao diện

- **Nút thông tin**: Icon 👤 kế bên nút đổi mật khẩu
- **Modal hiển thị**: Responsive, hiển thị đầy đủ thông tin
- **Modal chỉnh sửa**: Form 2 cột, dễ sử dụng
- **Chỉ admin mới thấy nút "Chỉnh sửa"**

## ✅ Hoàn thành

Tất cả chức năng đã được tích hợp và sẵn sàng sử dụng!
