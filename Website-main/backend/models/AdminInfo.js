import mongoose from "mongoose";

const adminInfoSchema = new mongoose.Schema({
    // Thông tin liên hệ admin
    adminName: {
        type: String,
        required: true,
        default: "Admin"
    },

    adminEmail: {
        type: String,
        required: true,
        default: "admin@safedownload.com"
    },

    adminPhone: {
        type: String,
        default: ""
    },

    adminTelegram: {
        type: String,
        default: ""
    },

    adminFacebook: {
        type: String,
        default: ""
    },

    adminZalo: {
        type: String,
        default: ""
    },

    // Thông tin bổ sung
    adminTitle: {
        type: String,
        default: "Quản trị viên hệ thống"
    },

    adminDescription: {
        type: String,
        default: "Liên hệ với admin để được hỗ trợ và giải đáp thắc mắc"
    },

    // Thời gian làm việc
    workingHours: {
        type: String,
        default: "Thứ 2 - Thứ 6: 8:00 - 17:00"
    },

    // Trạng thái hiển thị
    isActive: {
        type: Boolean,
        default: true
    },

    // Thời gian
    createdAt: {
        type: Date,
        default: Date.now
    },

    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Cập nhật updatedAt trước khi save
adminInfoSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

export default mongoose.model("AdminInfo", adminInfoSchema);
