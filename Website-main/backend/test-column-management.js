// Test script to verify column management APIs
const BASE_URL = 'http://127.0.0.1:5000';

const testColumnManagement = async () => {
    try {
        console.log('🧪 Testing column management APIs...\n');

        // Test 1: Get column configuration
        console.log('1. Testing GET /api/admin/columns/windows...');
        try {
            const getConfigResponse = await fetch(`${BASE_URL}/api/admin/columns/windows`);
            if (getConfigResponse.ok) {
                const config = await getConfigResponse.json();
                console.log('✅ Get config success:', config);
            } else {
                console.log('❌ Get config failed:', getConfigResponse.status);
            }
        } catch (error) {
            console.log('❌ Get config error:', error.message);
        }

        // Test 2: Add column to data
        console.log('\n2. Testing POST /api/admin/columns/add...');
        try {
            const addColumnResponse = await fetch(`${BASE_URL}/api/admin/columns/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    category: 'windows',
                    columnKey: 'test_column',
                    columnType: 'text'
                })
            });

            if (addColumnResponse.ok) {
                const result = await addColumnResponse.json();
                console.log('✅ Add column success:', result);
            } else {
                const error = await addColumnResponse.text();
                console.log('❌ Add column failed:', error);
            }
        } catch (error) {
            console.log('❌ Add column error:', error.message);
        }

        // Test 3: Save column configuration
        console.log('\n3. Testing POST /api/admin/columns/save...');
        try {
            const testColumns = [
                { key: 'version', label: 'Version', type: 'text' },
                { key: 'edition', label: 'Edition', type: 'text' },
                { key: 'test_column', label: 'Test Column', type: 'text' }
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
                console.log('✅ Save config success:', result);
            } else {
                const error = await saveConfigResponse.text();
                console.log('❌ Save config failed:', error);
            }
        } catch (error) {
            console.log('❌ Save config error:', error.message);
        }

        // Test 4: Delete column from data
        console.log('\n4. Testing POST /api/admin/columns/delete...');
        try {
            const deleteColumnResponse = await fetch(`${BASE_URL}/api/admin/columns/delete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    category: 'windows',
                    columnKey: 'test_column',
                    isUrlColumn: false
                })
            });

            if (deleteColumnResponse.ok) {
                const result = await deleteColumnResponse.json();
                console.log('✅ Delete column success:', result);
            } else {
                const error = await deleteColumnResponse.text();
                console.log('❌ Delete column failed:', error);
            }
        } catch (error) {
            console.log('❌ Delete column error:', error.message);
        }

        console.log('\n✅ Column management API tests completed!');

    } catch (error) {
        console.error('❌ Test failed:', error);
    }
};

// Run the test
testColumnManagement();
