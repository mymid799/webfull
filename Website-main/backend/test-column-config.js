import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000/api/column-config';

async function testColumnConfigAPI() {
    console.log('🧪 Testing Column Config API...\n');

    try {
        // Test 1: Save column config
        console.log('1️⃣ Testing save column config...');
        const columnConfig = {
            category: 'windows',
            columns: [
                { key: 'version', label: 'Version', type: 'text', order: 0, isVisible: true },
                { key: 'edition', label: 'Edition', type: 'text', order: 1, isVisible: true },
                { key: 'fshare', label: 'Fshare', type: 'url', bitOption: 'both', order: 2, isVisible: true },
                { key: 'drive', label: 'Google Drive', type: 'url', bitOption: 'both', order: 3, isVisible: true },
                { key: 'oneDrive', label: 'OneDrive', type: 'url', bitOption: 'both', order: 4, isVisible: true },
                { key: 'fpt', label: 'FPT', type: 'url', bitOption: 'both', order: 5, isVisible: true },
                { key: 'sha1', label: 'SHA-1', type: 'text', order: 6, isVisible: true }
            ]
        };

        const saveConfigRes = await fetch(`${BASE_URL}/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(columnConfig)
        });

        const saveConfigResult = await saveConfigRes.json();
        console.log('✅ Save config result:', saveConfigResult);

        // Test 2: Get column config
        console.log('\n2️⃣ Testing get column config...');
        const getConfigRes = await fetch(`${BASE_URL}/windows`);
        const getConfigResult = await getConfigRes.json();
        console.log('✅ Get config result:', getConfigResult);

        // Test 3: Save data with config
        console.log('\n3️⃣ Testing save data with config...');
        const testData = [
            {
                version: 'Windows 10 version 19',
                edition: 'Consumer (S/SL/Home)',
                fshare32: 'https://www.fshare.vn/file/32bit',
                fshare64: 'https://www.fshare.vn/file/64bit',
                fshareShow: 'both',
                drive32: 'https://drive.google.com/file/32bit',
                drive64: 'https://drive.google.com/file/64bit',
                driveShow: 'both',
                oneDrive32: 'https://onedrive.live.com/file/32bit',
                oneDrive64: 'https://onedrive.live.com/file/64bit',
                oneDriveShow: 'both',
                fpt32: 'https://fpt.vn/file/32bit',
                fpt64: 'https://fpt.vn/file/64bit',
                fptShow: 'both',
                sha1: 'abc123def456'
            },
            {
                version: 'Windows 10 version 20',
                edition: 'Consumer',
                fshare32: 'https://www.fshare.vn/file2/32bit',
                fshare64: 'https://www.fshare.vn/file2/64bit',
                fshareShow: 'both',
                drive32: 'https://drive.google.com/file2/32bit',
                drive64: 'https://drive.google.com/file2/64bit',
                driveShow: 'both',
                oneDrive32: 'https://onedrive.live.com/file2/32bit',
                oneDrive64: 'https://onedrive.live.com/file2/64bit',
                oneDriveShow: 'both',
                fpt32: 'https://fpt.vn/file2/32bit',
                fpt64: 'https://fpt.vn/file2/64bit',
                fptShow: 'both',
                sha1: 'def456ghi789'
            }
        ];

        const saveDataRes = await fetch(`${BASE_URL}/data/save`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                category: 'windows',
                data: testData,
                columnConfig: { columns: columnConfig.columns }
            })
        });

        const saveDataResult = await saveDataRes.json();
        console.log('✅ Save data result:', saveDataResult);

        // Test 4: Get data with config
        console.log('\n4️⃣ Testing get data with config...');
        const getDataRes = await fetch(`${BASE_URL}/data/windows`);
        const getDataResult = await getDataRes.json();
        console.log('✅ Get data result:', getDataResult);

        console.log('\n🎉 All tests completed successfully!');

    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

// Run the test
testColumnConfigAPI();
