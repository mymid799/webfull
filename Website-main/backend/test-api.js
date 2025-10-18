// Test script để kiểm tra API
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend is working!' });
});

// Test column config endpoint
app.post('/api/admin/columns/save', (req, res) => {
    console.log('Received column config:', req.body);
    res.json({
        success: true,
        message: "Column configuration saved successfully",
        config: req.body
    });
});

app.get('/api/admin/columns/:category', (req, res) => {
    const { category } = req.params;
    console.log(`Getting column config for: ${category}`);

    // Return default columns
    const defaultColumns = {
        windows: [
            { key: "version", label: "Version", type: "text" },
            { key: "edition", label: "Edition", type: "text" },
            { key: "fshare", label: "Fshare", type: "url" },
            { key: "drive", label: "Google Drive", type: "url" },
            { key: "oneDrive", label: "OneDrive", type: "url" },
            { key: "sha1", label: "SHA-1", type: "text" }
        ]
    };

    res.json(defaultColumns[category] || []);
});

app.listen(PORT, () => {
    console.log(`🚀 Test server running on http://localhost:${PORT}`);
    console.log('✅ Backend is ready for testing!');
});
