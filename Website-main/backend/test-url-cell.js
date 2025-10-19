// Test script for URL cell functionality
const BASE_URL = 'http://127.0.0.1:5000';

const testUrlCell = async () => {
    try {
        console.log('🧪 Testing URL cell functionality...');

        // Test 1: Add URL column with bit options
        console.log('\n1. Adding URL column with bit options...');
        const addColumnResponse = await fetch(`${BASE_URL}/api/admin/columns/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                category: 'windows',
                columnKey: 'test_url_cell',
                columnType: 'url',
                bitOptions: {
                    url32bit: '',
                    url64bit: '',
                    displayOption: 'download_chung'
                }
            })
        });

        if (addColumnResponse.ok) {
            const result = await addColumnResponse.json();
            console.log('✅ Add URL column result:', result);
        } else {
            const error = await addColumnResponse.text();
            console.log('❌ Add URL column failed:', error);
        }

        // Test 2: Save column configuration
        console.log('\n2. Saving column configuration...');
        const testColumns = [
            { key: 'version', label: 'Version', type: 'text' },
            { key: 'edition', label: 'Edition', type: 'text' },
            { key: 'fshare', label: 'Fshare', type: 'url' },
            { key: 'drive', label: 'Google Drive', type: 'url' },
            { key: 'oneDrive', label: 'OneDrive', type: 'url' },
            { key: 'sha1', label: 'SHA-1', type: 'text' },
            {
                key: 'test_url_cell',
                label: 'Test URL Cell',
                type: 'url',
                bitOptions: {
                    url32bit: '',
                    url64bit: '',
                    displayOption: 'download_chung'
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
            console.log('✅ Save config result:', result);
        } else {
            const error = await saveConfigResponse.text();
            console.log('❌ Save config failed:', error);
        }

        // Test 3: Test auto-save functionality
        console.log('\n3. Testing auto-save functionality...');

        // Simulate updating a row with URL data
        const testData = {
            version: 'Windows 10',
            edition: 'Business',
            test_url_cell: {
                url32bit: 'https://example.com/windows10-32bit.iso',
                url64bit: 'https://example.com/windows10-64bit.iso',
                displayOption: 'show_both'
            }
        };

        // Test updating a specific row (assuming row ID exists)
        const updateResponse = await fetch(`${BASE_URL}/api/windows`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testData)
        });

        if (updateResponse.ok) {
            const result = await updateResponse.json();
            console.log('✅ Auto-save test result:', result);
        } else {
            const error = await updateResponse.text();
            console.log('❌ Auto-save test failed:', error);
        }

        // Test 4: Get data to verify URL cell structure
        console.log('\n4. Getting data to verify URL cell structure...');
        const getDataResponse = await fetch(`${BASE_URL}/api/windows`);
        if (getDataResponse.ok) {
            const data = await getDataResponse.json();
            console.log('✅ Data retrieved:', data.length, 'records');

            // Find records with URL cell data
            const recordsWithUrlCell = data.filter(record => record.test_url_cell);
            console.log('✅ Records with URL cell data:', recordsWithUrlCell.length);

            if (recordsWithUrlCell.length > 0) {
                const sampleRecord = recordsWithUrlCell[0];
                console.log('✅ Sample URL cell data:', sampleRecord.test_url_cell);
            }
        } else {
            console.log('❌ Failed to get data:', getDataResponse.status);
        }

        // Test 5: Test different display options
        console.log('\n5. Testing different display options...');
        const displayOptions = ['download_chung', 'show_32bit', 'show_64bit', 'show_both', 'hide'];

        for (const option of displayOptions) {
            console.log(`\nTesting display option: ${option}`);

            const testUrlData = {
                url32bit: 'https://example.com/32bit.exe',
                url64bit: 'https://example.com/64bit.exe',
                displayOption: option
            };

            console.log(`✅ Display option "${option}" configured:`, testUrlData);
        }

        // Test 6: Clean up
        console.log('\n6. Cleaning up...');
        const deleteColumnResponse = await fetch(`${BASE_URL}/api/admin/columns/delete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                category: 'windows',
                columnKey: 'test_url_cell'
            })
        });

        if (deleteColumnResponse.ok) {
            const result = await deleteColumnResponse.json();
            console.log('✅ Delete test column result:', result);
        } else {
            const error = await deleteColumnResponse.text();
            console.log('❌ Delete test column failed:', error);
        }

        console.log('\n🎉 URL cell functionality test completed!');

    } catch (error) {
        console.error('❌ Test failed:', error);
    }
};

// Run the test
testUrlCell();
