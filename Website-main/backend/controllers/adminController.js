import Software from "../models/Software.js";

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

// 🔹 Cập nhật phần mềm
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

// 🔹 Lưu cấu hình cột
export const saveColumnConfig = async (req, res) => {
  try {
    const { category, columns } = req.body;

    // Lưu cấu hình cột vào một collection riêng hoặc vào metadata
    // Ở đây tôi sẽ tạo một cách đơn giản bằng cách lưu vào một field đặc biệt
    const config = await Software.findOneAndUpdate(
      { category, type: 'column_config' },
      { category, columns, type: 'column_config' },
      { upsert: true, new: true }
    );

    res.json({ message: "Column configuration saved", config });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Lấy cấu hình cột
export const getColumnConfig = async (req, res) => {
  try {
    const { category } = req.params;
    const config = await Software.findOne({ category, type: 'column_config' });

    if (config) {
      res.json(config.columns || []);
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

      res.json(defaultColumns[category] || []);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
