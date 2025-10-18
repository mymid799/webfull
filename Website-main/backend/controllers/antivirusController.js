import Antivirus from "../models/Antivirus.js";

// Lấy danh sách antivirus
export const getAntivirus = async (req, res) => {
  try {
    const list = await Antivirus.find();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Thêm antivirus mới
export const addAntivirus = async (req, res) => {
  try {
    const newItem = new Antivirus(req.body);
    await newItem.save();
    res.json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cập nhật antivirus
export const updateAntivirus = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Antivirus.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Xóa antivirus
export const deleteAntivirus = async (req, res) => {
  try {
    const { id } = req.params;
    await Antivirus.findByIdAndDelete(id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
