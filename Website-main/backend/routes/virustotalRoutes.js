import express from 'express';
import { scanUrl, getUrlReport, batchScanUrls, getScanStats, getScanStatus } from '../controllers/virustotalController.js';

const router = express.Router();

// Quét URL đơn lẻ
router.post('/scan', scanUrl);

// Lấy báo cáo URL đã quét
router.get('/report/:url', getUrlReport);

// Quét nhiều URL cùng lúc
router.post('/batch-scan', batchScanUrls);

// Lấy thống kê quét
router.get('/stats', getScanStats);

// Kiểm tra trạng thái quét
router.get('/status/:scanId', getScanStatus);

export default router;
