import Tools from "../models/Tools.js";

// Lấy danh sách tools
export const getTools = async (req, res) => {
  try {
    const list = await Tools.find();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Thêm tool mới
export const addTools = async (req, res) => {
  try {
    const newItem = new Tools(req.body);
    await newItem.save();
    res.json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cập nhật tool
export const updateTools = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Tools.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Xóa tool
export const deleteTools = async (req, res) => {
  try {
    const { id } = req.params;
    await Tools.findByIdAndDelete(id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
