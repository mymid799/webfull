import express from "express";
import Tools from "../models/Tools.js";
import {
  getTools,
  addTools,
  updateTools,
  deleteTools,
} from "../controllers/toolsController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Lấy danh sách Tools
router.get("/", getTools);

// CRUD cơ bản
router.post("/", verifyToken, addTools);
router.put("/:id", verifyToken, updateTools);
router.delete("/:id", verifyToken, deleteTools);

// ✅ Lưu toàn bộ danh sách (ghi đè)
router.post("/save", verifyToken, async (req, res) => {
  try {
    const newData = req.body;
    if (!Array.isArray(newData))
      return res.status(400).json({ message: "Dữ liệu không hợp lệ!" });

    // Xóa dữ liệu cũ
    await Tools.deleteMany({});
    // Lưu dữ liệu mới
    await Tools.insertMany(newData);

    res.json({ message: "✅ Dữ liệu Tools đã lưu thành công!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "❌ Lỗi khi lưu dữ liệu!" });
  }
});

export default router;
