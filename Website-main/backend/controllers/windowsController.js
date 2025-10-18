import Windows from "../models/Windows.js";

// GET all
export const getWindows = async (req, res) => {
  try {
    const list = await Windows.find();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST add
export const addWindows = async (req, res) => {
  try {
    const newItem = new Windows(req.body);
    await newItem.save();
    res.json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT update by id
export const updateWindows = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Windows.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE by id
export const deleteWindows = async (req, res) => {
  try {
    const { id } = req.params;
    await Windows.findByIdAndDelete(id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
