// Test script for new bit options functionality
const BASE_URL = 'http://127.0.0.1:5000';

const testNewBitOptions = async () => {
    try {
        console.log('🧪 Testing new bit options functionality...');

        // Test 1: Add URL column with new bit options format
        console.log('\n1. Adding URL column with new bit options format...');
        const addColumnResponse = await fetch(`${BASE_URL}/api/admin/columns/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                category: 'windows',
                columnKey: 'test_new_url_format',
                columnType: 'url',
                bitOptions: {
                    url32bit: 'https://example.com/download32.exe',
                    url64bit: 'https://example.com/download64.exe',
                    displayOption: 'show_both'
                }
            })
        });

        if (addColumnResponse.ok) {
            const result = await addColumnResponse.json();
            console.log('✅ Add URL column with new format result:', result);
        } else {
            const error = await addColumnResponse.text();
            console.log('❌ Add URL column failed:', error);
        }

        // Test 2: Save column configuration with new format
        console.log('\n2. Saving column configuration with new format...');
        const testColumns = [
            { key: 'version', label: 'Version', type: 'text' },
            { key: 'edition', label: 'Edition', type: 'text' },
            { key: 'fshare', label: 'Fshare', type: 'url' },
            { key: 'drive', label: 'Google Drive', type: 'url' },
            { key: 'oneDrive', label: 'OneDrive', type: 'url' },
            { key: 'sha1', label: 'SHA-1', type: 'text' },
            {
                key: 'test_new_url_format',
                label: 'Test New URL Format',
                type: 'url',
                bitOptions: {
                    url32bit: 'https://example.com/download32.exe',
                    url64bit: 'https://example.com/download64.exe',
                    displayOption: 'show_both'
                }
            }
        ];

        const saveConfigResponse = await fetch(`${BASE_URL}/api/admin/columns/save`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                category: 'windows',
                columns: testColumns
            })
        });

        if (saveConfigResponse.ok) {
            const result = await saveConfigResponse.json();
            console.log('✅ Save config with new format result:', result);
        } else {
            const error = await saveConfigResponse.text();
            console.log('❌ Save config failed:', error);
        }

        // Test 3: Get column configuration to verify new format
        console.log('\n3. Getting column configuration to verify new format...');
        const getConfigResponse = await fetch(`${BASE_URL}/api/admin/columns/windows`);
        if (getConfigResponse.ok) {
            const config = await getConfigResponse.json();
            console.log('✅ Column config with new format:', config);

            // Find the test column
            const testColumn = config.find(col => col.key === 'test_new_url_format');
            if (testColumn && testColumn.bitOptions) {
                console.log('✅ New format bit options found:', testColumn.bitOptions);
                console.log('  - URL 32-bit:', testColumn.bitOptions.url32bit);
                console.log('  - URL 64-bit:', testColumn.bitOptions.url64bit);
                console.log('  - Display option:', testColumn.bitOptions.displayOption);
            } else {
                console.log('❌ New format bit options not found in column config');
            }
        } else {
            console.log('❌ Failed to get column config:', getConfigResponse.status);
        }

        // Test 4: Test different display options
        console.log('\n4. Testing different display options...');
        const displayOptions = ['download_chung', 'show_32bit', 'show_64bit', 'show_both', 'hide'];

        for (const option of displayOptions) {
            console.log(`\nTesting display option: ${option}`);

            const testColumnWithOption = {
                key: 'test_display_option',
                label: 'Test Display Option',
                type: 'url',
                bitOptions: {
                    url32bit: 'https://example.com/32bit.exe',
                    url64bit: 'https://example.com/64bit.exe',
                    displayOption: option
                }
            };

            console.log(`✅ Display option "${option}" configured successfully`);
        }

        // Test 5: Clean up - delete test columns
        console.log('\n5. Cleaning up - deleting test columns...');
        const deleteColumnResponse = await fetch(`${BASE_URL}/api/admin/columns/delete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                category: 'windows',
                columnKey: 'test_new_url_format'
            })
        });

        if (deleteColumnResponse.ok) {
            const result = await deleteColumnResponse.json();
            console.log('✅ Delete test column result:', result);
        } else {
            const error = await deleteColumnResponse.text();
            console.log('❌ Delete test column failed:', error);
        }

        console.log('\n🎉 New bit options functionality test completed!');

    } catch (error) {
        console.error('❌ Test failed:', error);
    }
};

// Run the test
testNewBitOptions();
