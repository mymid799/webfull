import AdminInfo from "../models/AdminInfo.js";

// GET admin info (public - không cần authentication)
export const getAdminInfo = async (req, res) => {
    try {
        let adminInfo = await AdminInfo.findOne({ isActive: true });

        // Nếu chưa có thông tin admin, tạo mặc định
        if (!adminInfo) {
            adminInfo = new AdminInfo({
                adminName: "Admin",
                adminEmail: "admin@safedownload.com",
                adminTitle: "Quản trị viên hệ thống",
                adminDescription: "Liên hệ với admin để được hỗ trợ và giải đáp thắc mắc",
                workingHours: "Thứ 2 - Thứ 6: 8:00 - 17:00"
            });
            await adminInfo.save();
        }

        res.json(adminInfo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// PUT update admin info (chỉ admin)
export const updateAdminInfo = async (req, res) => {
    try {
        const updateData = req.body;

        let adminInfo = await AdminInfo.findOne({ isActive: true });

        if (!adminInfo) {
            // Tạo mới nếu chưa có
            adminInfo = new AdminInfo(updateData);
        } else {
            // Cập nhật thông tin hiện có
            Object.assign(adminInfo, updateData);
        }

        await adminInfo.save();

        res.json({
            message: "✅ Cập nhật thông tin admin thành công!",
            adminInfo: adminInfo
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET admin info for admin panel (chỉ admin)
export const getAdminInfoForAdmin = async (req, res) => {
    try {
        let adminInfo = await AdminInfo.findOne({ isActive: true });

        if (!adminInfo) {
            // Tạo mặc định nếu chưa có
            adminInfo = new AdminInfo({
                adminName: "Admin",
                adminEmail: "admin@safedownload.com",
                adminTitle: "Quản trị viên hệ thống",
                adminDescription: "Liên hệ với admin để được hỗ trợ và giải đáp thắc mắc",
                workingHours: "Thứ 2 - Thứ 6: 8:00 - 17:00"
            });
            await adminInfo.save();
        }

        res.json(adminInfo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
