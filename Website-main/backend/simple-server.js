const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Simple column config storage (in-memory for testing)
let columnConfigs = {};

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend is working!', timestamp: new Date() });
});

// Save column config
app.post('/api/admin/columns/save', (req, res) => {
    try {
        const { category, columns } = req.body;
        console.log(`💾 Saving column config for ${category}:`, columns);

        columnConfigs[category] = {
            category,
            columns,
            updatedAt: new Date()
        };

        res.json({
            success: true,
            message: "Column configuration saved successfully",
            config: columnConfigs[category]
        });
    } catch (error) {
        console.error('❌ Error saving column config:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Get column config
app.get('/api/admin/columns/:category', (req, res) => {
    try {
        const { category } = req.params;
        console.log(`📋 Getting column config for ${category}`);

        if (columnConfigs[category]) {
            console.log('✅ Found saved config:', columnConfigs[category]);
            res.json(columnConfigs[category].columns);
        } else {
            // Return default columns
            const defaultColumns = {
                windows: [
                    { key: "version", label: "Version", type: "text" },
                    { key: "edition", label: "Edition", type: "text" },
                    { key: "fshare", label: "Fshare", type: "url" },
                    { key: "drive", label: "Google Drive", type: "url" },
                    { key: "oneDrive", label: "OneDrive", type: "url" },
                    { key: "sha1", label: "SHA-1", type: "text" }
                ],
                office: [
                    { key: "version", label: "Version", type: "text" },
                    { key: "edition", label: "Edition", type: "text" },
                    { key: "fshare", label: "Fshare", type: "url" },
                    { key: "drive", label: "Google Drive", type: "url" },
                    { key: "oneDrive", label: "OneDrive", type: "url" },
                    { key: "sha1", label: "SHA-1", type: "text" }
                ],
                tools: [
                    { key: "toolName", label: "Tên Tool", type: "text" },
                    { key: "mainLink", label: "Trang chủ / Link gốc", type: "url" },
                    { key: "googleDrive", label: "Google Drive", type: "url" },
                    { key: "ownCloud", label: "OwnCloud", type: "url" },
                    { key: "note", label: "Note", type: "text" }
                ],
                antivirus: [
                    { key: "toolName", label: "Tên Tool", type: "text" },
                    { key: "mainLink", label: "Trang chủ / Link gốc", type: "url" },
                    { key: "googleDrive", label: "Google", type: "url" },
                    { key: "oneDrive", label: "OneDrive", type: "url" },
                    { key: "note", label: "Note", type: "text" }
                ]
            };

            console.log('📋 Using default columns for', category);
            res.json(defaultColumns[category] || []);
        }
    } catch (error) {
        console.error('❌ Error getting column config:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Simple server running on http://localhost:${PORT}`);
    console.log('✅ Backend is ready for testing!');
    console.log('📋 Available endpoints:');
    console.log('  - GET  /api/test');
    console.log('  - POST /api/admin/columns/save');
    console.log('  - GET  /api/admin/columns/:category');
});
