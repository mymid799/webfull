import express from 'express';
import {
    createDynamicColumn,
    getDynamicColumns,
    updateDynamicColumn,
    deleteDynamicColumn,
    saveDynamicData,
    getDynamicData,
    getColumnsWithData,
    deleteDynamicData
} from '../controllers/dynamicColumnController.js';

const router = express.Router();

// Dynamic Column routes
router.post('/', createDynamicColumn);
router.get('/:category', getDynamicColumns);
router.put('/:id', updateDynamicColumn);
router.delete('/:id', deleteDynamicColumn);
router.get('/:category/with-data', getColumnsWithData);

// Dynamic Data routes
router.post('/data', saveDynamicData);
router.get('/data/:category/:parentRecord', getDynamicData);
router.delete('/data/:id', deleteDynamicData);

export default router;
