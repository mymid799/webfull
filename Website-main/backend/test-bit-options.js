// Test script for bit options functionality
const BASE_URL = 'http://127.0.0.1:5000';

const testBitOptions = async () => {
    try {
        console.log('🧪 Testing bit options functionality...');

        // Test 1: Add URL column with bit options
        console.log('\n1. Adding URL column with bit options...');
        const addColumnResponse = await fetch(`${BASE_URL}/api/admin/columns/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                category: 'windows',
                columnKey: 'test_url_with_bits',
                columnType: 'url',
                bitOptions: {
                    show64bit: true,
                    show32bit: true,
                    showBoth: false
                }
            })
        });

        if (addColumnResponse.ok) {
            const result = await addColumnResponse.json();
            console.log('✅ Add URL column with bit options result:', result);
        } else {
            const error = await addColumnResponse.text();
            console.log('❌ Add URL column failed:', error);
        }

        // Test 2: Save column configuration with bit options
        console.log('\n2. Saving column configuration with bit options...');
        const testColumns = [
            { key: 'version', label: 'Version', type: 'text' },
            { key: 'edition', label: 'Edition', type: 'text' },
            { key: 'fshare', label: 'Fshare', type: 'url' },
            { key: 'drive', label: 'Google Drive', type: 'url' },
            { key: 'oneDrive', label: 'OneDrive', type: 'url' },
            { key: 'sha1', label: 'SHA-1', type: 'text' },
            {
                key: 'test_url_with_bits',
                label: 'Test URL with Bits',
                type: 'url',
                bitOptions: {
                    show64bit: true,
                    show32bit: true,
                    showBoth: false
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
            console.log('✅ Save config with bit options result:', result);
        } else {
            const error = await saveConfigResponse.text();
            console.log('❌ Save config failed:', error);
        }

        // Test 3: Get column configuration to verify bit options
        console.log('\n3. Getting column configuration to verify bit options...');
        const getConfigResponse = await fetch(`${BASE_URL}/api/admin/columns/windows`);
        if (getConfigResponse.ok) {
            const config = await getConfigResponse.json();
            console.log('✅ Column config with bit options:', config);

            // Find the test column
            const testColumn = config.find(col => col.key === 'test_url_with_bits');
            if (testColumn && testColumn.bitOptions) {
                console.log('✅ Bit options found:', testColumn.bitOptions);
            } else {
                console.log('❌ Bit options not found in column config');
            }
        } else {
            console.log('❌ Failed to get column config:', getConfigResponse.status);
        }

        // Test 4: Clean up - delete test column
        console.log('\n4. Cleaning up - deleting test column...');
        const deleteColumnResponse = await fetch(`${BASE_URL}/api/admin/columns/delete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                category: 'windows',
                columnKey: 'test_url_with_bits'
            })
        });

        if (deleteColumnResponse.ok) {
            const result = await deleteColumnResponse.json();
            console.log('✅ Delete test column result:', result);
        } else {
            const error = await deleteColumnResponse.text();
            console.log('❌ Delete test column failed:', error);
        }

        console.log('\n🎉 Bit options functionality test completed!');

    } catch (error) {
        console.error('❌ Test failed:', error);
    }
};

// Run the test
testBitOptions();
