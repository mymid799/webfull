import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
    // Thông tin báo cáo
    reportType: {
        type: String,
        enum: ["broken_link", "version_update", "general_feedback"],
        required: true
    },

    // Thông tin sản phẩm được báo cáo
    category: {
        type: String,
        enum: ["windows", "office", "tools", "antivirus"],
        required: true
    },

    productName: {
        type: String,
        required: true
    },

    version: {
        type: String,
        default: ""
    },

    edition: {
        type: String,
        default: ""
    },

    // Link bị lỗi hoặc cần cập nhật
    brokenLink: {
        type: String,
        default: ""
    },

    // Đánh giá độ tin cậy
    rating: {
        type: String,
        enum: ["working", "broken", "slow", "unknown"],
        default: "unknown"
    },

    // Nội dung báo cáo
    description: {
        type: String,
        required: true
    },

    // Thông tin người báo cáo (không bắt buộc)
    reporterName: {
        type: String,
        default: "Anonymous"
    },

    reporterEmail: {
        type: String,
        default: ""
    },

    // Trạng thái xử lý
    status: {
        type: String,
        enum: ["pending", "in_progress", "resolved", "rejected"],
        default: "pending"
    },

    // Ghi chú của admin
    adminNotes: {
        type: String,
        default: ""
    },

    // Phản hồi công khai cho người dùng
    publicResponse: {
        type: String,
        default: ""
    },

    // Trạng thái phản hồi
    responseStatus: {
        type: String,
        enum: ["no_response", "responded", "fixed", "wont_fix"],
        default: "no_response"
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
reportSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

export default mongoose.model("Report", reportSchema);