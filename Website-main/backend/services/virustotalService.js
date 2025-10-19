import axios from 'axios';

const VIRUSTOTAL_API_KEY = '937f68620325cd04af5e362a207ec94d0d8a3ee43e225d4baad254e1c97e0dc6';
const VIRUSTOTAL_BASE_URL = 'https://www.virustotal.com/vtapi/v2';

class VirusTotalService {
    constructor() {
        this.apiKey = VIRUSTOTAL_API_KEY;
        this.baseUrl = VIRUSTOTAL_BASE_URL;
    }

    /**
     * Quét URL bằng VirusTotal API
     * @param {string} url - URL cần quét
     * @returns {Promise<Object>} Kết quả quét
     */
    async scanUrl(url) {
        try {
            // Bước 1: Gửi URL để quét
            const scanResponse = await axios.post(`${this.baseUrl}/url/scan`, {
                apikey: this.apiKey,
                url: url
            }, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            if (scanResponse.data.response_code !== 1) {
                throw new Error(`Lỗi gửi URL để quét: ${scanResponse.data.verbose_msg}`);
            }

            const scanId = scanResponse.data.scan_id;

            // Bước 2: Chờ và lấy kết quả với retry logic
            return await this.waitForScanResult(scanId);

        } catch (error) {
            console.error('VirusTotal scan error:', error);
            throw new Error(`Lỗi quét VirusTotal: ${error.message}`);
        }
    }

    /**
     * Chờ kết quả quét với retry logic thông minh
     * @param {string} scanId - ID của scan
     * @returns {Promise<Object>} Kết quả quét
     */
    async waitForScanResult(scanId) {
        const maxAttempts = 10; // Tối đa 10 lần thử
        const baseDelay = 2000; // 2 giây cơ bản
        let attempts = 0;

        while (attempts < maxAttempts) {
            try {
                // Tăng delay theo số lần thử (exponential backoff)
                const delay = baseDelay * Math.pow(1.5, attempts);
                await new Promise(resolve => setTimeout(resolve, delay));

                console.log(`Thử lấy kết quả lần ${attempts + 1}/${maxAttempts}...`);

                const reportResponse = await axios.get(`${this.baseUrl}/url/report`, {
                    params: {
                        apikey: this.apiKey,
                        resource: scanId
                    }
                });

                // Kiểm tra response code
                if (reportResponse.data.response_code === 1) {
                    // Thành công - có kết quả
                    console.log('✅ Lấy kết quả thành công!');
                    return this.formatScanResult(reportResponse.data);
                } else if (reportResponse.data.response_code === -2) {
                    // Đang trong hàng đợi hoặc đang quét
                    console.log(`⏳ URL đang được quét hoặc trong hàng đợi... (${reportResponse.data.verbose_msg})`);
                    attempts++;
                } else if (reportResponse.data.response_code === 0) {
                    // Chưa có trong dataset - có thể cần thêm thời gian
                    console.log(`⏳ URL chưa có trong dataset, chờ thêm... (${reportResponse.data.verbose_msg})`);
                    attempts++;
                } else {
                    // Lỗi khác
                    throw new Error(`Lỗi lấy báo cáo: ${reportResponse.data.verbose_msg}`);
                }

            } catch (error) {
                if (error.message.includes('Lỗi lấy báo cáo')) {
                    throw error;
                }

                // Lỗi network hoặc timeout - thử lại
                console.log(`⚠️ Lỗi network, thử lại sau ${baseDelay * Math.pow(1.5, attempts)}ms...`);
                attempts++;
            }
        }

        // Hết số lần thử
        throw new Error(`Không thể lấy kết quả sau ${maxAttempts} lần thử. URL có thể cần thời gian xử lý lâu hơn.`);
    }

    /**
     * Lấy báo cáo URL đã quét trước đó
     * @param {string} url - URL cần lấy báo cáo
     * @returns {Promise<Object>} Báo cáo kết quả
     */
    async getUrlReport(url) {
        try {
            const response = await axios.get(`${this.baseUrl}/url/report`, {
                params: {
                    apikey: this.apiKey,
                    resource: url
                }
            });

            if (response.data.response_code !== 1) {
                throw new Error(`URL chưa được quét hoặc không tồn tại: ${response.data.verbose_msg}`);
            }

            return this.formatScanResult(response.data);

        } catch (error) {
            console.error('VirusTotal report error:', error);
            throw new Error(`Lỗi lấy báo cáo VirusTotal: ${error.message}`);
        }
    }

    /**
     * Format kết quả quét từ VirusTotal
     * @param {Object} data - Dữ liệu thô từ VirusTotal
     * @returns {Object} Dữ liệu đã format
     */
    formatScanResult(data) {
        const scans = data.scans || {};
        const totalEngines = Object.keys(scans).length;
        const detectedEngines = Object.keys(scans).filter(engine =>
            scans[engine].detected && scans[engine].result !== 'clean'
        );

        const threatLevel = this.calculateThreatLevel(detectedEngines.length, totalEngines);
        const threatColor = this.getThreatColor(threatLevel);

        return {
            url: data.url,
            scanDate: data.scan_date,
            totalEngines: totalEngines,
            detectedCount: detectedEngines.length,
            threatLevel: threatLevel,
            threatColor: threatColor,
            isSafe: detectedEngines.length === 0,
            scanId: data.scan_id,
            permalink: data.permalink,
            scans: Object.entries(scans).map(([engine, result]) => ({
                engine: engine,
                detected: result.detected,
                result: result.result || 'clean',
                version: result.version,
                update: result.update
            })).sort((a, b) => {
                // Sắp xếp: detected trước, sau đó theo tên engine
                if (a.detected && !b.detected) return -1;
                if (!a.detected && b.detected) return 1;
                return a.engine.localeCompare(b.engine);
            })
        };
    }

    /**
     * Tính toán mức độ đe dọa
     * @param {number} detectedCount - Số engine phát hiện
     * @param {number} totalEngines - Tổng số engine
     * @returns {string} Mức độ đe dọa
     */
    calculateThreatLevel(detectedCount, totalEngines) {
        const percentage = (detectedCount / totalEngines) * 100;

        if (detectedCount === 0) return 'An toàn';
        if (percentage < 10) return 'Rủi ro thấp';
        if (percentage < 30) return 'Rủi ro trung bình';
        if (percentage < 60) return 'Rủi ro cao';
        return 'Rất nguy hiểm';
    }

    /**
     * Lấy màu sắc theo mức độ đe dọa
     * @param {string} threatLevel - Mức độ đe dọa
     * @returns {string} Màu sắc
     */
    getThreatColor(threatLevel) {
        const colors = {
            'An toàn': '#28a745',
            'Rủi ro thấp': '#ffc107',
            'Rủi ro trung bình': '#fd7e14',
            'Rủi ro cao': '#dc3545',
            'Rất nguy hiểm': '#6f42c1'
        };
        return colors[threatLevel] || '#6c757d';
    }
}

export default new VirusTotalService();
