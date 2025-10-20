import mongoose from 'mongoose';

const DynamicDataSchema = new mongoose.Schema({
    // Reference to the dynamic column
    columnId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DynamicColumn',
        required: true
    },

    // The actual data value
    value: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },

    // Metadata about the data
    dataType: {
        type: String,
        required: true,
        enum: ['text', 'number', 'email', 'url', 'date', 'boolean']
    },

    // Category for organization
    category: {
        type: String,
        required: true,
        enum: ['windows', 'office', 'tools', 'antivirus', 'general']
    },

    // Reference to parent record (if applicable)
    parentRecord: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'parentModel'
    },
    parentModel: {
        type: String,
        enum: ['Windows', 'Office', 'Tools', 'Antivirus']
    },

    // Status and validation
    isValid: {
        type: Boolean,
        default: true
    },
    validationMessage: {
        type: String,
        default: ''
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
DynamicDataSchema.index({ columnId: 1, category: 1 });
DynamicDataSchema.index({ parentRecord: 1, parentModel: 1 });
DynamicDataSchema.index({ createdAt: -1 });

// Update timestamp on save
DynamicDataSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Virtual for formatted value based on data type
DynamicDataSchema.virtual('formattedValue').get(function () {
    switch (this.dataType) {
        case 'date':
            return new Date(this.value).toLocaleDateString('vi-VN');
        case 'boolean':
            return this.value ? 'Có' : 'Không';
        case 'number':
            return Number(this.value).toLocaleString('vi-VN');
        default:
            return this.value;
    }
});

// Ensure virtual fields are serialized
DynamicDataSchema.set('toJSON', { virtuals: true });

export default mongoose.model('DynamicData', DynamicDataSchema);
