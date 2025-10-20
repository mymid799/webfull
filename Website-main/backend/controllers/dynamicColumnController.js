import DynamicColumn from '../models/DynamicColumn.js';
import DynamicData from '../models/DynamicData.js';

/**
 * Tạo cột động mới
 * POST /api/dynamic-columns
 */
export const createDynamicColumn = async (req, res) => {
    try {
        const {
            columnName,
            columnType,
            columnLabel,
            columnDescription,
            category,
            isRequired,
            validationRules
        } = req.body;

        // Validate required fields
        if (!columnName || !columnType || !columnLabel || !category) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu thông tin bắt buộc: columnName, columnType, columnLabel, category'
            });
        }

        // Generate column key from column name
        const columnKey = columnName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');

        // Check if column key already exists
        const existingColumn = await DynamicColumn.findOne({ columnKey, category });
        if (existingColumn) {
            return res.status(400).json({
                success: false,
                message: `Cột "${columnKey}" đã tồn tại trong danh mục "${category}"`
            });
        }

        // Create new dynamic column
        const newColumn = new DynamicColumn({
            columnName,
            columnKey,
            columnType,
            columnLabel,
            columnDescription: columnDescription || '',
            category,
            isRequired: isRequired || false,
            validationRules: validationRules || {},
            createdBy: req.user?.username || 'system'
        });

        await newColumn.save();

        res.status(201).json({
            success: true,
            message: 'Tạo cột động thành công',
            data: newColumn
        });

    } catch (error) {
        console.error('Create dynamic column error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Lỗi server khi tạo cột động'
        });
    }
};

/**
 * Lấy danh sách cột động theo category
 * GET /api/dynamic-columns/:category
 */
export const getDynamicColumns = async (req, res) => {
    try {
        const { category } = req.params;
        const { includeHidden = false } = req.query;

        const filter = { category };
        if (!includeHidden) {
            filter.isVisible = true;
        }

        const columns = await DynamicColumn.find(filter)
            .sort({ sortOrder: 1, createdAt: 1 })
            .select('-__v');

        res.json({
            success: true,
            message: 'Lấy danh sách cột động thành công',
            data: columns
        });

    } catch (error) {
        console.error('Get dynamic columns error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Lỗi server khi lấy danh sách cột động'
        });
    }
};

/**
 * Cập nhật cột động
 * PUT /api/dynamic-columns/:id
 */
export const updateDynamicColumn = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Remove fields that shouldn't be updated
        delete updateData._id;
        delete updateData.createdAt;
        delete updateData.createdBy;

        const updatedColumn = await DynamicColumn.findByIdAndUpdate(
            id,
            { ...updateData, updatedAt: new Date() },
            { new: true, runValidators: true }
        );

        if (!updatedColumn) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy cột động'
            });
        }

        res.json({
            success: true,
            message: 'Cập nhật cột động thành công',
            data: updatedColumn
        });

    } catch (error) {
        console.error('Update dynamic column error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Lỗi server khi cập nhật cột động'
        });
    }
};

/**
 * Xóa cột động
 * DELETE /api/dynamic-columns/:id
 */
export const deleteDynamicColumn = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if column exists
        const column = await DynamicColumn.findById(id);
        if (!column) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy cột động'
            });
        }

        // Delete all related data first
        await DynamicData.deleteMany({ columnId: id });

        // Delete the column
        await DynamicColumn.findByIdAndDelete(id);

        res.json({
            success: true,
            message: 'Xóa cột động và dữ liệu liên quan thành công'
        });

    } catch (error) {
        console.error('Delete dynamic column error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Lỗi server khi xóa cột động'
        });
    }
};

/**
 * Lưu dữ liệu động
 * POST /api/dynamic-data
 */
export const saveDynamicData = async (req, res) => {
    try {
        const { columnId, value, category, parentRecord, parentModel } = req.body;

        if (!columnId || value === undefined || !category) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu thông tin bắt buộc: columnId, value, category'
            });
        }

        // Get column info for validation
        const column = await DynamicColumn.findById(columnId);
        if (!column) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy cột động'
            });
        }

        // Validate data type
        const dataType = column.columnType;
        let validatedValue = value;

        // Type conversion and validation
        switch (dataType) {
            case 'number':
                validatedValue = Number(value);
                if (isNaN(validatedValue)) {
                    return res.status(400).json({
                        success: false,
                        message: 'Giá trị phải là số'
                    });
                }
                break;
            case 'boolean':
                validatedValue = Boolean(value);
                break;
            case 'date':
                validatedValue = new Date(value);
                if (isNaN(validatedValue.getTime())) {
                    return res.status(400).json({
                        success: false,
                        message: 'Giá trị phải là ngày hợp lệ'
                    });
                }
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    return res.status(400).json({
                        success: false,
                        message: 'Email không hợp lệ'
                    });
                }
                break;
            case 'url':
                try {
                    new URL(value);
                } catch {
                    return res.status(400).json({
                        success: false,
                        message: 'URL không hợp lệ'
                    });
                }
                break;
        }

        // Create or update dynamic data
        const existingData = await DynamicData.findOne({
            columnId,
            parentRecord,
            parentModel
        });

        let dynamicData;
        if (existingData) {
            existingData.value = validatedValue;
            existingData.dataType = dataType;
            existingData.updatedAt = new Date();
            await existingData.save();
            dynamicData = existingData;
        } else {
            dynamicData = new DynamicData({
                columnId,
                value: validatedValue,
                dataType,
                category,
                parentRecord,
                parentModel,
                createdBy: req.user?.username || 'system'
            });
            await dynamicData.save();
        }

        res.json({
            success: true,
            message: 'Lưu dữ liệu động thành công',
            data: dynamicData
        });

    } catch (error) {
        console.error('Save dynamic data error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Lỗi server khi lưu dữ liệu động'
        });
    }
};

/**
 * Lấy dữ liệu động theo category và parent record
 * GET /api/dynamic-data/:category/:parentRecord
 */
export const getDynamicData = async (req, res) => {
    try {
        const { category, parentRecord } = req.params;
        const { parentModel } = req.query;

        const filter = { category };
        if (parentRecord && parentRecord !== 'null') {
            filter.parentRecord = parentRecord;
            if (parentModel) {
                filter.parentModel = parentModel;
            }
        }

        const data = await DynamicData.find(filter)
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            message: 'Lấy dữ liệu động thành công',
            data
        });

    } catch (error) {
        console.error('Get dynamic data error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Lỗi server khi lấy dữ liệu động'
        });
    }
};

/**
 * Lấy tất cả cột động và dữ liệu cho một category
 * GET /api/dynamic-columns/:category/with-data
 */
export const getColumnsWithData = async (req, res) => {
    try {
        const { category } = req.params;
        const { parentRecord, parentModel } = req.query;

        // Get all visible columns for the category
        const columns = await DynamicColumn.find({
            category,
            isVisible: true
        }).sort({ sortOrder: 1, createdAt: 1 });

        // Get data for each column
        const columnsWithData = await Promise.all(
            columns.map(async (column) => {
                const filter = {
                    columnId: column._id,
                    category
                };

                if (parentRecord && parentRecord !== 'null') {
                    filter.parentRecord = parentRecord;
                    if (parentModel) {
                        filter.parentModel = parentModel;
                    }
                }

                const data = await DynamicData.find(filter)
                    .sort({ createdAt: -1 })
                    .limit(1);

                return {
                    ...column.toObject(),
                    data: data.length > 0 ? data[0] : null
                };
            })
        );

        res.json({
            success: true,
            message: 'Lấy cột động và dữ liệu thành công',
            data: columnsWithData
        });

    } catch (error) {
        console.error('Get columns with data error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Lỗi server khi lấy cột động và dữ liệu'
        });
    }
};

/**
 * Xóa dữ liệu động
 * DELETE /api/dynamic-columns/data/:id
 */
export const deleteDynamicData = async (req, res) => {
    try {
        const { id } = req.params;

        const dynamicData = await DynamicData.findByIdAndDelete(id);
        if (!dynamicData) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy dữ liệu động'
            });
        }

        res.json({
            success: true,
            message: 'Xóa dữ liệu động thành công'
        });

    } catch (error) {
        console.error('Delete dynamic data error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Lỗi server khi xóa dữ liệu động'
        });
    }
};
