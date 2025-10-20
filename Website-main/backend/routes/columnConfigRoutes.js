import express from 'express';
import {
    saveColumnConfig,
    getColumnConfig,
    saveDataWithConfig,
    getDataWithConfig
} from '../controllers/columnConfigController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Lưu cấu hình cột
router.post('/', verifyToken, saveColumnConfig);

// Lấy cấu hình cột
router.get('/:category', getColumnConfig);

// Lưu dữ liệu với cấu hình cột
router.post('/data/save', verifyToken, saveDataWithConfig);

// Lấy dữ liệu với cấu hình cột
router.get('/data/:category', getDataWithConfig);

export default router;
