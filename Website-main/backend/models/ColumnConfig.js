import mongoose from 'mongoose';

const ColumnConfigSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
        enum: ['windows', 'office', 'tools', 'antivirus'],
        unique: true
    },
    columns: [{
        key: {
            type: String,
            required: true
        },
        label: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true,
            enum: ['text', 'number', 'email', 'url', 'date', 'boolean']
        },
        bitOption: {
            type: String,
            enum: ['32', '64', 'both', 'none'],
            default: 'both'
        },
        order: {
            type: Number,
            default: 0
        },
        isVisible: {
            type: Boolean,
            default: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
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
ColumnConfigSchema.index({ category: 1 });

export default mongoose.model('ColumnConfig', ColumnConfigSchema);
