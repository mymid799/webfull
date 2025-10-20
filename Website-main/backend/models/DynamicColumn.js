import mongoose from 'mongoose';

const DynamicColumnSchema = new mongoose.Schema({
    // Thông tin cột
    columnName: {
        type: String,
        required: true,
        trim: true
    },
    columnKey: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    columnType: {
        type: String,
        required: true,
        enum: ['text', 'number', 'email', 'url', 'date', 'boolean']
    },
    columnLabel: {
        type: String,
        required: true,
        trim: true
    },
    columnDescription: {
        type: String,
        default: ''
    },

    // Phân loại
    category: {
        type: String,
        required: true,
        enum: ['windows', 'office', 'tools', 'antivirus', 'general']
    },

    // Cấu hình hiển thị
    isVisible: {
        type: Boolean,
        default: true
    },
    isRequired: {
        type: Boolean,
        default: false
    },
    sortOrder: {
        type: Number,
        default: 0
    },

    // Validation rules
    validationRules: {
        minLength: Number,
        maxLength: Number,
        minValue: Number,
        maxValue: Number,
        pattern: String, // Regex pattern
        options: [String] // For dropdown/select type
    },

    // Metadata
    createdBy: {
        type: String,
        default: 'system'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Index for better performance
DynamicColumnSchema.index({ category: 1, columnKey: 1 });
DynamicColumnSchema.index({ isVisible: 1, sortOrder: 1 });

// Update timestamp on save
DynamicColumnSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

export default mongoose.model('DynamicColumn', DynamicColumnSchema);
