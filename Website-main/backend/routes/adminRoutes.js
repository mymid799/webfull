import express from "express";
import Software from "../models/Software.js";
import {
  getAllSoftware,
  addSoftware,
  updateSoftware,
  deleteSoftware,
  saveColumnConfig,
  deleteColumnFromData,
  addColumnToData,
  getColumnConfig,
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/:category", getAllSoftware);
router.post("/", addSoftware);
router.put("/:id", updateSoftware);
router.delete("/:id", deleteSoftware);
router.post("/columns/save", saveColumnConfig);
router.post("/columns/delete", deleteColumnFromData);
router.post("/columns/add", addColumnToData);
router.get("/columns/:category", getColumnConfig);

router.post("/bulkUpdate", async (req, res) => {
  try {
    const { category, data } = req.body;
    await Software.deleteMany({ category });
    await Software.insertMany(data.map((d) => ({ ...d, category })));
    res.json({ message: "Updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
export default router;
