import Office from "../models/Office.js";

// Lấy toàn bộ danh sách Office
export const getOffice = async (req, res) => {
  try {
    const list = await Office.find();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Thêm mới
export const addOffice = async (req, res) => {
  try {
    const newItem = new Office(req.body);
    await newItem.save();
    res.json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cập nhật theo ID
export const updateOffice = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Office.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Xóa theo ID
export const deleteOffice = async (req, res) => {
  try {
    const { id } = req.params;
    await Office.findByIdAndDelete(id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
