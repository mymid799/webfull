import express from "express";
import cors from "cors";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/api/windows", (req, res) => {
    console.log("📡 Windows API called");
    res.json([
        {
            _id: "test1",
            version: "Windows 10 20H2",
            edition: "Home",
            fshare32: "https://fshare.vn/file1-32",
            fshare64: "https://fshare.vn/file1-64",
            fshareShow: "both",
            drive32: "https://drive.google.com/file1-32",
            drive64: "https://drive.google.com/file1-64",
            driveShow: "both",
            oneDrive32: "https://onedrive.com/file1-32",
            oneDrive64: "https://onedrive.com/file1-64",
            oneDriveShow: "both",
            sha1: "abc123def456"
        },
        {
            _id: "test2",
            version: "Windows 11 22H2",
            edition: "Pro",
            fshare32: "https://fshare.vn/file2-32",
            fshare64: "https://fshare.vn/file2-64",
            fshareShow: "both",
            drive32: "https://drive.google.com/file2-32",
            drive64: "https://drive.google.com/file2-64",
            driveShow: "both",
            oneDrive32: "https://onedrive.com/file2-32",
            oneDrive64: "https://onedrive.com/file2-64",
            oneDriveShow: "both",
            sha1: "def456ghi789"
        }
    ]);
});

// Column config route
app.get("/api/admin/columns/windows", (req, res) => {
    console.log("📡 Column config API called");
    res.json([
        { key: "version", label: "Version", type: "text" },
        { key: "edition", label: "Edition", type: "text" },
        { key: "fshare", label: "Fshare", type: "url" },
        { key: "drive", label: "Google Drive", type: "url" },
        { key: "oneDrive", label: "OneDrive", type: "url" },
        { key: "sha1", label: "SHA-1", type: "text" }
    ]);
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Test server running on port ${PORT}`);
    console.log("📡 Available endpoints:");
    console.log("  - GET /api/windows");
    console.log("  - GET /api/admin/columns/windows");
});
