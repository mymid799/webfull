import Report from "../models/Report.js";

// GET all reports (chỉ admin)
export const getAllReports = async (req, res) => {
    try {
        const reports = await Report.find().sort({ createdAt: -1 });
        res.json(reports);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET single report by ID (chỉ admin)
export const getReportById = async (req, res) => {
    try {
        const { id } = req.params;
        const report = await Report.findById(id);

        if (!report) {
            return res.status(404).json({ message: "Không tìm thấy báo cáo" });
        }

        res.json(report);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET reports by category (chỉ admin)
export const getReportsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const reports = await Report.find({ category }).sort({ createdAt: -1 });
        res.json(reports);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET reports by status (chỉ admin)
export const getReportsByStatus = async (req, res) => {
    try {
        const { status } = req.params;
        const reports = await Report.find({ status }).sort({ createdAt: -1 });
        res.json(reports);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// POST create new report (người dùng)
export const createReport = async (req, res) => {
    try {
        const newReport = new Report(req.body);
        await newReport.save();
        res.json({
            message: "✅ Báo cáo đã được gửi thành công! Cảm ơn bạn đã đóng góp.",
            report: newReport
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// PUT update report status (chỉ admin)
export const updateReportStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, adminNotes, publicResponse, responseStatus } = req.body;

        const updatedReport = await Report.findByIdAndUpdate(
            id,
            {
                status,
                adminNotes,
                publicResponse,
                responseStatus,
                updatedAt: new Date()
            },
            { new: true }
        );

        if (!updatedReport) {
            return res.status(404).json({ message: "Không tìm thấy báo cáo" });
        }

        res.json({
            message: "✅ Cập nhật trạng thái thành công!",
            report: updatedReport
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE report (chỉ admin)
export const deleteReport = async (req, res) => {
    try {
        const { id } = req.params;
        await Report.findByIdAndDelete(id);
        res.json({ message: "✅ Xóa báo cáo thành công!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET report statistics (chỉ admin)
export const getReportStats = async (req, res) => {
    try {
        const totalReports = await Report.countDocuments();
        const pendingReports = await Report.countDocuments({ status: "pending" });
        const resolvedReports = await Report.countDocuments({ status: "resolved" });
        const inProgressReports = await Report.countDocuments({ status: "in_progress" });

        // Thống kê theo loại báo cáo
        const brokenLinkReports = await Report.countDocuments({ reportType: "broken_link" });
        const versionUpdateReports = await Report.countDocuments({ reportType: "version_update" });
        const generalFeedbackReports = await Report.countDocuments({ reportType: "general_feedback" });

        // Thống kê theo category
        const windowsReports = await Report.countDocuments({ category: "windows" });
        const officeReports = await Report.countDocuments({ category: "office" });
        const toolsReports = await Report.countDocuments({ category: "tools" });
        const antivirusReports = await Report.countDocuments({ category: "antivirus" });

        res.json({
            total: totalReports,
            pending: pendingReports,
            resolved: resolvedReports,
            inProgress: inProgressReports,
            byType: {
                brokenLink: brokenLinkReports,
                versionUpdate: versionUpdateReports,
                generalFeedback: generalFeedbackReports
            },
            byCategory: {
                windows: windowsReports,
                office: officeReports,
                tools: toolsReports,
                antivirus: antivirusReports
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};