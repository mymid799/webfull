// Test script to verify the complete column management flow

const BASE_URL = 'http://127.0.0.1:5000';

const testFullFlow = async () => {
    try {
        console.log('🧪 Testing complete column management flow...');

        // Test 1: Get current column configuration
        console.log('\n1. Getting current column configuration...');
        const getConfigResponse = await fetch(`${BASE_URL}/api/admin/columns/windows`);
        if (getConfigResponse.ok) {
            const config = await getConfigResponse.json();
            console.log('✅ Current config:', config);
        } else {
            console.log('❌ Failed to get config:', getConfigResponse.status);
        }

        // Test 2: Add a test column
        console.log('\n2. Adding test column...');
        const addColumnResponse = await fetch(`${BASE_URL}/api/admin/columns/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                category: 'windows',
                columnKey: 'test_column_optimized',
                columnType: 'text'
            })
        });

        if (addColumnResponse.ok) {
            const result = await addColumnResponse.json();
            console.log('✅ Add column result:', result);
        } else {
            const error = await addColumnResponse.text();
            console.log('❌ Add column failed:', error);
        }

        // Test 3: Save column configuration with new column
        console.log('\n3. Saving column configuration...');
        const testColumns = [
            { key: 'version', label: 'Version', type: 'text' },
            { key: 'edition', label: 'Edition', type: 'text' },
            { key: 'fshare', label: 'Fshare', type: 'url' },
            { key: 'drive', label: 'Google Drive', type: 'url' },
            { key: 'oneDrive', label: 'OneDrive', type: 'url' },
            { key: 'sha1', label: 'SHA-1', type: 'text' },
            { key: 'test_column_optimized', label: 'Test Column', type: 'text' }
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

        // Test 4: Delete the test column
        console.log('\n4. Deleting test column...');
        const deleteColumnResponse = await fetch(`${BASE_URL}/api/admin/columns/delete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                category: 'windows',
                columnKey: 'test_column_optimized'
            })
        });

        if (deleteColumnResponse.ok) {
            const result = await deleteColumnResponse.json();
            console.log('✅ Delete column result:', result);
        } else {
            const error = await deleteColumnResponse.text();
            console.log('❌ Delete column failed:', error);
        }

        // Test 5: Verify final configuration
        console.log('\n5. Verifying final configuration...');
        const finalConfigResponse = await fetch(`${BASE_URL}/api/admin/columns/windows`);
        if (finalConfigResponse.ok) {
            const finalConfig = await finalConfigResponse.json();
            console.log('✅ Final config:', finalConfig);
        } else {
            console.log('❌ Failed to get final config:', finalConfigResponse.status);
        }

        console.log('\n🎉 Complete flow test finished!');

    } catch (error) {
        console.error('❌ Test failed:', error);
    }
};

// Run the test
testFullFlow();
