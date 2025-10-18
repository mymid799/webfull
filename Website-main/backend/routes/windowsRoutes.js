import express from "express";
import Windows from "../models/Windows.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  getWindows,
  addWindows,
  updateWindows,
  deleteWindows,
} from "../controllers/windowsController.js";

const router = express.Router();

// Lấy danh sách
router.get("/", getWindows);

// CRUD cơ bản
router.post("/", verifyToken, addWindows);
router.put("/:id", verifyToken, updateWindows);
router.delete("/:id", verifyToken, deleteWindows);

// ✅ Lưu toàn bộ danh sách (ghi đè)
router.post("/save", verifyToken, async (req, res) => {
  try {
    const newData = req.body;
    if (!Array.isArray(newData))
      return res.status(400).json({ message: "Dữ liệu không hợp lệ!" });

    // Xóa dữ liệu cũ
    await Windows.deleteMany({});

    // Lưu dữ liệu mới
    await Windows.insertMany(newData);

    res.json({ message: "✅ Dữ liệu Windows đã lưu thành công!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "❌ Lỗi khi lưu dữ liệu!" });
  }
});

export default router;
