import mongoose from "mongoose";
import Software from "../models/Software.js";
import Windows from "../models/Windows.js";
import Office from "../models/Office.js";
import Tools from "../models/Tools.js";
import Antivirus from "../models/Antivirus.js";

// 🔹 Lấy toàn bộ dữ liệu theo danh mục
export const getAllSoftware = async (req, res) => {
  try {
    const { category } = req.params;
    const data = await Software.find({ category });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Thêm mới phần mềm
export const addSoftware = async (req, res) => {
  try {
    const newData = new Software(req.body);
    const saved = await newData.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Sửa thông tin phần mềm
export const updateSoftware = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Software.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Xóa phần mềm
export const deleteSoftware = async (req, res) => {
  try {
    await Software.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🔹 Lưu cấu hình cột
export const saveColumnConfig = async (req, res) => {
  try {
    const { category, columns } = req.body;

    // Validation
    if (!category || !columns || !Array.isArray(columns)) {
      return res.status(400).json({
        success: false,
        message: "Category and columns array are required"
      });
    }

    // Validate columns structure
    for (const column of columns) {
      if (!column.key || !column.label || !column.type) {
        return res.status(400).json({
          success: false,
          message: "Each column must have key, label, and type"
        });
      }
    }

    console.log(`Saving column config for ${category}:`, columns);

    // Use transaction for data consistency
    const session = await mongoose.startSession();

    try {
      let config;
      await session.withTransaction(async () => {
        // Find and update or create new column configuration
        config = await Software.findOneAndUpdate(
          { category, type: 'column_config' },
          {
            category,
            columns,
            type: 'column_config',
            updatedAt: new Date()
          },
          {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
            session
          }
        );
      });

      await session.endSession();

      console.log(`✅ Successfully saved column config for ${category}:`, config);
      res.json({
        success: true,
        message: "Column configuration saved successfully",
        config: {
          category: config.category,
          columns: config.columns,
          updatedAt: config.updatedAt
        }
      });
    } catch (transactionError) {
      await session.endSession();
      throw transactionError;
    }
  } catch (error) {
    console.error("❌ Error saving column config:", error);
    res.status(500).json({
      success: false,
      message: error.message,
      error: error.toString()
    });
  }
};

// 🔹 Xóa cột khỏi dữ liệu thực tế
export const deleteColumnFromData = async (req, res) => {
  try {
    const { category, columnKey, isUrlColumn, urlFields } = req.body;

    // Validation
    if (!category || !columnKey) {
      return res.status(400).json({
        success: false,
        message: "Category and columnKey are required"
      });
    }

    console.log(`Deleting column ${columnKey} from ${category} data`);

    // Get the appropriate model
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
          message: "Invalid category"
        });
    }

    // Use transaction for data consistency
    const session = await mongoose.startSession();

    try {
      await session.withTransaction(async () => {
        // Check if column exists in any documents first
        const existingDocs = await Model.find({ [columnKey]: { $exists: true } }).limit(1);

        if (existingDocs.length === 0) {
          console.log(`Column ${columnKey} does not exist in ${category} data`);
          return;
        }

        // Remove field from all documents
        let unsetFields = { [columnKey]: 1 };

        // For URL columns, also remove the 32bit, 64bit, Common, and Show fields
        if (isUrlColumn && urlFields) {
          urlFields.forEach(field => {
            unsetFields[field] = 1;
          });
        }

        const result = await Model.updateMany(
          {},
          { $unset: unsetFields },
          { session }
        );

        console.log(`✅ Successfully deleted column ${columnKey} from ${result.modifiedCount} documents`);
      });

      await session.endSession();

      res.json({
        success: true,
        message: `Column ${columnKey} deleted successfully`,
        category,
        columnKey
      });
    } catch (transactionError) {
      await session.endSession();
      throw transactionError;
    }
  } catch (error) {
    console.error("❌ Error deleting column from data:", error);
    res.status(500).json({
      success: false,
      message: error.message,
      error: error.toString()
    });
  }
};

// 🔹 Thêm cột mới vào dữ liệu thực tế
export const addColumnToData = async (req, res) => {
  try {
    const { category, columnKey, columnType = 'text', bitOptions } = req.body;

    // Validation
    if (!category || !columnKey) {
      return res.status(400).json({
        success: false,
        message: "Category and columnKey are required"
      });
    }

    console.log(`Adding column ${columnKey} to ${category} data`);

    // Get the appropriate model
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
          message: "Invalid category"
        });
    }

    // Use transaction for data consistency
    const session = await mongoose.startSession();

    try {
      await session.withTransaction(async () => {
        // Check if column already exists
        const existingDocs = await Model.find({ [columnKey]: { $exists: true } }).limit(1);

        if (existingDocs.length > 0) {
          console.log(`Column ${columnKey} already exists in ${category} data`);
          return;
        }

        // Add field to all documents with default value
        if (columnType === 'url') {
          // For URL columns, create database fields like existing URL columns (32bit, 64bit, Common, Show)
          const urlFields = {
            [`${columnKey}32`]: '',
            [`${columnKey}64`]: '',
            [`${columnKey}Common`]: '',
            [`${columnKey}Show`]: 'both'
          };

          const result = await Model.updateMany(
            {},
            { $set: urlFields },
            { session }
          );

          console.log(`✅ Successfully added URL column ${columnKey} with fields: ${Object.keys(urlFields).join(', ')} to ${result.modifiedCount} documents`);
        } else {
          // For non-URL columns, use simple default value
          let defaultValue = columnType === 'number' ? 0 : '';

          const result = await Model.updateMany(
            {},
            { $set: { [columnKey]: defaultValue } },
            { session }
          );

          console.log(`✅ Successfully added column ${columnKey} to ${result.modifiedCount} documents`);
        }
      });

      await session.endSession();

      res.json({
        success: true,
        message: `Column ${columnKey} added successfully`,
        category,
        columnKey
      });
    } catch (transactionError) {
      await session.endSession();
      throw transactionError;
    }
  } catch (error) {
    console.error("❌ Error adding column to data:", error);
    res.status(500).json({
      success: false,
      message: error.message,
      error: error.toString()
    });
  }
};

// 🔹 Lấy cấu hình cột
export const getColumnConfig = async (req, res) => {
  try {
    const { category } = req.params;
    const config = await Software.findOne({ category, type: 'column_config' });

    if (config && config.columns) {
      console.log(`Loaded column config for ${category}:`, config.columns);
      res.json(config.columns);
    } else {
      // Trả về cấu hình mặc định
      const defaultColumns = {
        windows: [
          { key: "version", label: "Version", type: "text" },
          { key: "edition", label: "Edition", type: "text" },
          { key: "fshare", label: "Fshare", type: "url" },
          { key: "drive", label: "Google Drive", type: "url" },
          { key: "oneDrive", label: "OneDrive", type: "url" },
          { key: "sha1", label: "SHA-1", type: "text" }
        ],
        office: [
          { key: "version", label: "Version", type: "text" },
          { key: "edition", label: "Edition", type: "text" },
          { key: "fshare", label: "Fshare", type: "url" },
          { key: "drive", label: "Google Drive", type: "url" },
          { key: "oneDrive", label: "OneDrive", type: "url" },
          { key: "sha1", label: "SHA-1", type: "text" }
        ],
        tools: [
          { key: "toolName", label: "Tên Tool", type: "text" },
          { key: "mainLink", label: "Trang chủ / Link gốc", type: "url" },
          { key: "googleDrive", label: "Google Drive", type: "url" },
          { key: "ownCloud", label: "OwnCloud", type: "url" },
          { key: "note", label: "Note", type: "text" }
        ],
        antivirus: [
          { key: "toolName", label: "Tên Tool", type: "text" },
          { key: "mainLink", label: "Trang chủ / Link gốc", type: "url" },
          { key: "googleDrive", label: "Google", type: "url" },
          { key: "oneDrive", label: "OneDrive", type: "url" },
          { key: "note", label: "Note", type: "text" }
        ]
      };

      console.log(`Using default columns for ${category}`);
      res.json(defaultColumns[category] || []);
    }
  } catch (error) {
    console.error("Error loading column config:", error);
    res.status(500).json({ message: error.message });
  }
};
