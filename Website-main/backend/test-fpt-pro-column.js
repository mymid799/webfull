// Test FPT PRO column data saving and loading
// Using built-in fetch in Node.js 18+

const API_BASE = 'http://localhost:5000/api';
const TEST_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzVhYjQ4YzQ4YjQ4YjQ4YjQ4YjQ4YjQiLCJ1c2VybmFtZSI6ImFkbWluIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzM1NzQ4MDAwLCJleHAiOjE3MzU4MzQ0MDB9.test';

const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${TEST_TOKEN}`
};

async function testFPTProColumn() {
    console.log('🧪 Testing FPT PRO Column Data Flow...\n');

    try {
        // Step 1: Check if FPT PRO column exists
        console.log('1️⃣ Checking existing dynamic columns...');
        const getColumnsResponse = await fetch(`${API_BASE}/dynamic-columns/windows`, {
            headers
        });

        const getColumnsResult = await getColumnsResponse.json();
        if (getColumnsResult.success) {
            console.log('✅ Dynamic columns retrieved successfully!');
            console.log('📊 Number of columns:', getColumnsResult.data.length);

            const fptProColumn = getColumnsResult.data.find(col =>
                col.columnName === 'FPT PRO' || col.columnLabel === 'FPT PRO'
            );

            if (fptProColumn) {
                console.log('✅ FPT PRO column found!');
                console.log('📊 Column ID:', fptProColumn._id);
                console.log('📊 Column Key:', fptProColumn.columnKey);
                console.log('📊 Column Type:', fptProColumn.columnType);
            } else {
                console.log('❌ FPT PRO column not found!');
                return;
            }
        } else {
            console.log('❌ Failed to get columns:', getColumnsResult.message);
            return;
        }

        // Step 2: Get existing Windows records
        console.log('\n2️⃣ Getting existing Windows records...');
        const getRecordsResponse = await fetch(`${API_BASE}/admin/windows`, {
            headers
        });

        const getRecordsResult = await getRecordsResponse.json();
        if (getRecordsResult.length > 0) {
            console.log('✅ Windows records found!');
            console.log('📊 Number of records:', getRecordsResult.length);

            const firstRecord = getRecordsResult[0];
            console.log('📊 First record ID:', firstRecord._id);
            console.log('📊 First record version:', firstRecord.version);
        } else {
            console.log('❌ No Windows records found!');
            return;
        }

        const firstRecordId = getRecordsResult[0]._id;

        // Step 3: Save FPT PRO data for the first record
        console.log('\n3️⃣ Saving FPT PRO data for first record...');
        const fptProColumn = getColumnsResult.data.find(col =>
            col.columnName === 'FPT PRO' || col.columnLabel === 'FPT PRO'
        );

        const saveDataResponse = await fetch(`${API_BASE}/dynamic-columns/data`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                columnId: fptProColumn._id,
                value: 'https://fpt-pro.com/download/windows-11-pro',
                category: 'windows',
                parentRecord: firstRecordId,
                parentModel: 'Windows'
            })
        });

        const saveDataResult = await saveDataResponse.json();
        if (saveDataResult.success) {
            console.log('✅ FPT PRO data saved successfully!');
            console.log('📊 Saved data:', saveDataResult.data);
        } else {
            console.log('❌ Failed to save FPT PRO data:', saveDataResult.message);
        }

        // Step 4: Get all dynamic data for the record
        console.log('\n4️⃣ Getting all dynamic data for the record...');
        const getDynamicDataResponse = await fetch(`${API_BASE}/dynamic-columns/data/windows/${firstRecordId}`, {
            headers
        });

        const getDynamicDataResult = await getDynamicDataResponse.json();
        if (getDynamicDataResult.success) {
            console.log('✅ Dynamic data retrieved successfully!');
            console.log('📊 Number of dynamic data items:', getDynamicDataResult.data.length);

            getDynamicDataResult.data.forEach((item, index) => {
                console.log(`   Item ${index + 1}:`);
                console.log(`     Column ID: ${item.columnId}`);
                console.log(`     Value: ${item.value}`);
                console.log(`     Parent Record: ${item.parentRecord}`);
                console.log(`     Parent Model: ${item.parentModel}`);
            });
        } else {
            console.log('❌ Failed to get dynamic data:', getDynamicDataResult.message);
        }

        // Step 5: Get all dynamic data for category (like AdminPanel does)
        console.log('\n5️⃣ Getting all dynamic data for category...');
        const getAllDynamicDataResponse = await fetch(`${API_BASE}/dynamic-columns/data/windows/null`, {
            headers
        });

        const getAllDynamicDataResult = await getAllDynamicDataResponse.json();
        if (getAllDynamicDataResult.success) {
            console.log('✅ All dynamic data retrieved successfully!');
            console.log('📊 Number of dynamic data items:', getAllDynamicDataResult.data.length);

            // Group by parentRecord
            const dataByRecord = {};
            getAllDynamicDataResult.data.forEach(item => {
                if (item.parentRecord) {
                    const recordId = item.parentRecord;
                    if (!dataByRecord[recordId]) {
                        dataByRecord[recordId] = {};
                    }
                    dataByRecord[recordId][item.columnId] = item.value;
                }
            });

            console.log('📊 Data grouped by record:');
            Object.entries(dataByRecord).forEach(([recordId, data]) => {
                console.log(`   Record ${recordId}:`);
                Object.entries(data).forEach(([columnId, value]) => {
                    console.log(`     Column ${columnId}: ${value}`);
                });
            });
        } else {
            console.log('❌ Failed to get all dynamic data:', getAllDynamicDataResult.message);
        }

        console.log('\n🎉 Test completed!');

    } catch (error) {
        console.error('❌ Test failed with error:', error);
    }
}

// Run the test
testFPTProColumn();
