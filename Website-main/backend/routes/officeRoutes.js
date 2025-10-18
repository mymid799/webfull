import express from "express";
import Office from "../models/Office.js";
import {
  getOffice,
  addOffice,
  updateOffice,
  deleteOffice,
} from "../controllers/officeController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Lấy danh sách Office
router.get("/", getOffice);

// CRUD cơ bản
router.post("/", verifyToken, addOffice);
router.put("/:id", verifyToken, updateOffice);
router.delete("/:id", verifyToken, deleteOffice);

// ✅ Lưu toàn bộ danh sách (ghi đè)
router.post("/save", verifyToken, async (req, res) => {
  try {
    const newData = req.body;
    if (!Array.isArray(newData))
      return res.status(400).json({ message: "Dữ liệu không hợp lệ!" });

    // Xóa dữ liệu cũ
    await Office.deleteMany({});
    // Lưu dữ liệu mới
    await Office.insertMany(newData);

    res.json({ message: "✅ Dữ liệu Office đã lưu thành công!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "❌ Lỗi khi lưu dữ liệu!" });
  }
});

export default router;
