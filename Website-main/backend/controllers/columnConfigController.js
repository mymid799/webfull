import ColumnConfig from '../models/ColumnConfig.js';
import Windows from '../models/Windows.js';
import Office from '../models/Office.js';
import Tools from '../models/Tools.js';
import Antivirus from '../models/Antivirus.js';

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

        if (!category || !Array.isArray(data)) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu thông tin bắt buộc: category, data'
            });
        }

        // Lưu cấu hình cột nếu có
        if (columnConfig && Array.isArray(columnConfig.columns)) {
            await saveColumnConfig({ body: { category, columns: columnConfig.columns } }, res);
        }

        // Lưu dữ liệu
        let Model;
        switch (category) {
            case 'windows':
                Model = Windows;
                break;
            case 'office':
                Model = Office;
                break;
            case 'tools':
                Model = Tools;
                break;
            case 'antivirus':
                Model = Antivirus;
                break;
            default:
                return res.status(400).json({
                    success: false,
                    message: 'Category không hợp lệ'
                });
        }

        // Xóa dữ liệu cũ
        await Model.deleteMany({});

        // Lưu dữ liệu mới
        await Model.insertMany(data);

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

        // Lấy cấu hình cột
        const config = await ColumnConfig.findOne({ category });

        // Lấy dữ liệu
        let Model;
        switch (category) {
            case 'windows':
                Model = Windows;
                break;
            case 'office':
                Model = Office;
                break;
            case 'tools':
                Model = Tools;
                break;
            case 'antivirus':
                Model = Antivirus;
                break;
            default:
                return res.status(400).json({
                    success: false,
                    message: 'Category không hợp lệ'
                });
        }

        const data = await Model.find({});

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
