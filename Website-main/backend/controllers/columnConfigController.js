import ColumnConfig from '../models/ColumnConfig.js';
import Windows from '../models/Windows.js';
import Office from '../models/Office.js';
import Tools from '../models/Tools.js';
import Antivirus from '../models/Antivirus.js';

// Helper to get the correct model based on category
const getModelByCategory = (category) => {
    switch (category) {
        case 'windows':
            return Windows;
        case 'office':
            return Office;
        case 'tools':
            return Tools;
        case 'antivirus':
            return Antivirus;
        default:
            throw new Error('Invalid category');
    }
};

/**
 * Lưu cấu hình cột
 * POST /api/column-config
 */
export const saveColumnConfig = async (req, res) => {
    try {
        const { category, columns } = req.body;

        if (!category || !Array.isArray(columns)) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu thông tin bắt buộc: category, columns'
            });
        }

        // Validate category
        const validCategories = ['windows', 'office', 'tools', 'antivirus'];
        if (!validCategories.includes(category)) {
            return res.status(400).json({
                success: false,
                message: 'Category không hợp lệ'
            });
        }

        // Validate columns
        for (const col of columns) {
            if (!col.key || !col.label || !col.type) {
                return res.status(400).json({
                    success: false,
                    message: 'Mỗi cột phải có key, label và type'
                });
            }
        }

        // Tìm hoặc tạo cấu hình cột
        let config = await ColumnConfig.findOne({ category });

        if (config) {
            config.columns = columns;
            config.updatedAt = new Date();
            await config.save();
        } else {
            config = new ColumnConfig({
                category,
                columns
            });
            await config.save();
        }

        res.json({
            success: true,
            message: 'Lưu cấu hình cột thành công',
            data: config
        });

    } catch (error) {
        console.error('Save column config error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Lỗi server khi lưu cấu hình cột'
        });
    }
};

/**
 * Lấy cấu hình cột
 * GET /api/column-config/:category
 */
export const getColumnConfig = async (req, res) => {
    try {
        const { category } = req.params;

        const config = await ColumnConfig.findOne({ category });

        if (!config) {
            return res.json({
                success: true,
                message: 'Chưa có cấu hình cột',
                data: { columns: [] }
            });
        }

        res.json({
            success: true,
            message: 'Lấy cấu hình cột thành công',
            data: config
        });

    } catch (error) {
        console.error('Get column config error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Lỗi server khi lấy cấu hình cột'
        });
    }
};

/**
 * Lưu dữ liệu với cấu hình cột động
 * POST /api/data/save
 */
export const saveDataWithConfig = async (req, res) => {
    try {
        const { category, data, columnConfig } = req.body;

        console.log(`💾 Saving data for category: ${category}`);
        console.log(`💾 Data to save:`, JSON.stringify(data, null, 2));
        console.log(`💾 Column config:`, JSON.stringify(columnConfig, null, 2));

        if (!category || !Array.isArray(data)) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu thông tin bắt buộc: category, data'
            });
        }

        // Lưu cấu hình cột nếu có
        if (columnConfig && Array.isArray(columnConfig.columns)) {
            console.log(`💾 Saving column config for ${category}...`);
            await ColumnConfig.findOneAndUpdate(
                { category },
                { category, columns: columnConfig.columns },
                { upsert: true, new: true }
            );
            console.log(`✅ Column config saved for ${category}`);
        }

        // Lưu dữ liệu
        const Model = getModelByCategory(category);
        console.log(`💾 Using model: ${Model.modelName}`);

        // Xóa dữ liệu cũ
        const deleteResult = await Model.deleteMany({});
        console.log(`🗑️ Deleted ${deleteResult.deletedCount} old records`);

        // Lưu dữ liệu mới
        if (data.length > 0) {
            // Loại bỏ các trường id/_id không hợp lệ trước khi insert
            const cleanData = data.map(row => {
                const cleanRow = { ...row };
                delete cleanRow.id;
                delete cleanRow._id;
                return cleanRow;
            });

            console.log(`💾 Clean data to insert:`, JSON.stringify(cleanData, null, 2));

            const insertResult = await Model.insertMany(cleanData);
            console.log(`✅ Inserted ${insertResult.length} new records`);
        } else {
            console.log(`⚠️ No data to insert`);
        }

        res.json({
            success: true,
            message: `✅ Dữ liệu ${category} đã lưu thành công!`
        });

    } catch (error) {
        console.error('Save data with config error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Lỗi server khi lưu dữ liệu'
        });
    }
};

/**
 * Lấy dữ liệu với cấu hình cột
 * GET /api/data/:category
 */
export const getDataWithConfig = async (req, res) => {
    try {
        const { category } = req.params;
        console.log(`📥 Getting data for category: ${category}`);

        // Lấy cấu hình cột
        const config = await ColumnConfig.findOne({ category });
        console.log(`📥 Column config for ${category}:`, config);

        // Lấy dữ liệu
        const Model = getModelByCategory(category);
        console.log(`📥 Using model for ${category}:`, Model.modelName);

        const data = await Model.find({});
        console.log(`📥 Found ${data.length} records for ${category}:`, data);

        res.json({
            success: true,
            message: 'Lấy dữ liệu thành công',
            data: {
                data,
                columnConfig: config || { columns: [] }
            }
        });

    } catch (error) {
        console.error('Get data with config error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Lỗi server khi lấy dữ liệu'
        });
    }
};
