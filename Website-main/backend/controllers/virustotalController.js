import VirusTotalService from '../services/virustotalService.js';

/**
 * Quét URL bằng VirusTotal
 * POST /api/virustotal/scan
 */
export const scanUrl = async (req, res) => {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({
                success: false,
                message: 'URL là bắt buộc'
            });
        }

        // Validate URL format
        try {
            new URL(url);
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: 'URL không hợp lệ'
            });
        }

        const result = await VirusTotalService.scanUrl(url);

        res.json({
            success: true,
            message: 'Quét URL thành công',
            data: result
        });

    } catch (error) {
        console.error('Scan URL error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Lỗi server khi quét URL'
        });
    }
};

/**
 * Lấy báo cáo URL đã quét
 * GET /api/virustotal/report/:url
 */
export const getUrlReport = async (req, res) => {
    try {
        const { url } = req.params;
        const decodedUrl = decodeURIComponent(url);

        const result = await VirusTotalService.getUrlReport(decodedUrl);

        res.json({
            success: true,
            message: 'Lấy báo cáo thành công',
            data: result
        });

    } catch (error) {
        console.error('Get report error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Lỗi server khi lấy báo cáo'
        });
    }
};

/**
 * Quét nhiều URL cùng lúc
 * POST /api/virustotal/batch-scan
 */
export const batchScanUrls = async (req, res) => {
    try {
        const { urls } = req.body;

        if (!urls || !Array.isArray(urls) || urls.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Danh sách URL là bắt buộc'
            });
        }

        if (urls.length > 10) {
            return res.status(400).json({
                success: false,
                message: 'Tối đa 10 URL mỗi lần quét'
            });
        }

        const results = [];
        const errors = [];

        // Quét từng URL
        for (const url of urls) {
            try {
                // Validate URL
                new URL(url);
                const result = await VirusTotalService.scanUrl(url);
                results.push(result);
            } catch (error) {
                errors.push({
                    url: url,
                    error: error.message
                });
            }
        }

        res.json({
            success: true,
            message: `Quét hoàn thành: ${results.length} thành công, ${errors.length} lỗi`,
            data: {
                results: results,
                errors: errors,
                total: urls.length,
                successCount: results.length,
                errorCount: errors.length
            }
        });

    } catch (error) {
        console.error('Batch scan error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Lỗi server khi quét hàng loạt'
        });
    }
};

/**
 * Lấy thống kê quét
 * GET /api/virustotal/stats
 */
export const getScanStats = async (req, res) => {
    try {
        // Đây là endpoint mẫu, có thể mở rộng để lưu thống kê vào database
        res.json({
            success: true,
            message: 'Thống kê quét VirusTotal',
            data: {
                totalScans: 0,
                safeUrls: 0,
                threatUrls: 0,
                lastScan: null,
                topThreats: []
            }
        });

    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Lỗi server khi lấy thống kê'
        });
    }
};

/**
 * Kiểm tra trạng thái quét
 * GET /api/virustotal/status/:scanId
 */
export const getScanStatus = async (req, res) => {
    try {
        const { scanId } = req.params;

        if (!scanId) {
            return res.status(400).json({
                success: false,
                message: 'Scan ID là bắt buộc'
            });
        }

        const VirusTotalService = (await import('../services/virustotalService.js')).default;
        const result = await VirusTotalService.getUrlReport(scanId);

        res.json({
            success: true,
            message: 'Lấy trạng thái quét thành công',
            data: result
        });

    } catch (error) {
        console.error('Get scan status error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Lỗi server khi lấy trạng thái quét'
        });
    }
};
