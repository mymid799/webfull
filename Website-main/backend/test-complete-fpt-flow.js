// Complete test for FPT PRO column flow
// Using built-in fetch in Node.js 18+

const API_BASE = 'http://localhost:5000/api';
const TEST_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzVhYjQ4YzQ4YjQ4YjQ4YjQ4YjQ4YjQiLCJ1c2VybmFtZSI6ImFkbWluIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzM1NzQ4MDAwLCJleHAiOjE3MzU4MzQ0MDB9.test';

const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${TEST_TOKEN}`
};

async function testCompleteFPTFlow() {
    console.log('🧪 Testing Complete FPT PRO Flow...\n');

    try {
        // Step 1: Check if FPT PRO column exists
        console.log('1️⃣ Checking FPT PRO column...');
        const getColumnsResponse = await fetch(`${API_BASE}/dynamic-columns/windows`, {
            headers
        });

        const getColumnsResult = await getColumnsResponse.json();
        let fptProColumn = null;

        if (getColumnsResult.success && getColumnsResult.data.length > 0) {
            fptProColumn = getColumnsResult.data.find(col =>
                col.columnName === 'FPT PRO' || col.columnLabel === 'FPT PRO'
            );

            if (fptProColumn) {
                console.log('✅ FPT PRO column found!');
                console.log('📊 Column ID:', fptProColumn._id);
            } else {
                console.log('❌ FPT PRO column not found!');
                return;
            }
        } else {
            console.log('❌ No dynamic columns found!');
            return;
        }

        // Step 2: Get Windows records
        console.log('\n2️⃣ Getting Windows records...');
        const getRecordsResponse = await fetch(`${API_BASE}/admin/windows`, {
            headers
        });

        const getRecordsResult = await getRecordsResponse.json();
        if (getRecordsResult.length === 0) {
            console.log('❌ No Windows records found!');
            return;
        }

        console.log('✅ Windows records found!');
        console.log('📊 Number of records:', getRecordsResult.length);

        // Step 3: Test saving data for each record
        console.log('\n3️⃣ Testing data saving for each record...');
        const testData = [
            'https://fpt-pro.com/windows-11-pro-1',
            'https://fpt-pro.com/windows-11-pro-2',
            'https://fpt-pro.com/windows-11-pro-3'
        ];

        for (let i = 0; i < Math.min(getRecordsResult.length, testData.length); i++) {
            const record = getRecordsResult[i];
            const testValue = testData[i];

            console.log(`   Saving data for record ${i + 1} (${record._id}): ${testValue}`);

            const saveDataResponse = await fetch(`${API_BASE}/dynamic-columns/data`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    columnId: fptProColumn._id,
                    value: testValue,
                    category: 'windows',
                    parentRecord: record._id,
                    parentModel: 'Windows'
                })
            });

            const saveDataResult = await saveDataResponse.json();
            if (saveDataResult.success) {
                console.log(`   ✅ Data saved for record ${i + 1}`);
            } else {
                console.log(`   ❌ Failed to save data for record ${i + 1}:`, saveDataResult.message);
            }
        }

        // Step 4: Get all dynamic data
        console.log('\n4️⃣ Getting all dynamic data...');
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

            console.log('\n📊 Data grouped by record:');
            Object.entries(dataByRecord).forEach(([recordId, data]) => {
                console.log(`   Record ${recordId}:`);
                Object.entries(data).forEach(([columnId, value]) => {
                    console.log(`     Column ${columnId}: ${value}`);
                });
            });

            // Step 5: Simulate AdminPanel display
            console.log('\n5️⃣ Simulating AdminPanel display...');
            console.log('📊 All columns (static + dynamic):');

            // Static columns
            const staticColumns = [
                { key: "version", label: "Version", type: "text", isDynamic: false },
                { key: "edition", label: "Edition", type: "text", isDynamic: false },
                { key: "sha1", label: "SHA-1", type: "text", isDynamic: false }
            ];

            // Dynamic columns
            const dynamicColumns = getColumnsResult.data.map(col => ({
                key: col.columnKey,
                label: col.columnLabel,
                type: col.columnType,
                isDynamic: true,
                _id: col._id,
                columnId: col._id
            }));

            const allColumns = [...staticColumns, ...dynamicColumns];

            allColumns.forEach((col, index) => {
                console.log(`   ${index + 1}. ${col.label} (${col.type}) ${col.isDynamic ? '[Dynamic]' : '[Static]'}`);
            });

            console.log('\n📊 Table data simulation:');
            getRecordsResult.forEach((record, recordIndex) => {
                console.log(`   Row ${recordIndex + 1} (${record._id}):`);
                allColumns.forEach(col => {
                    if (col.isDynamic) {
                        const value = dataByRecord[record._id]?.[col._id] || "-";
                        console.log(`     ${col.label}: ${value} ${value !== "-" ? "✅" : "❌"}`);
                    } else {
                        const value = record[col.key] || "-";
                        console.log(`     ${col.label}: ${value}`);
                    }
                });
            });

        } else {
            console.log('❌ Failed to get all dynamic data:', getAllDynamicDataResult.message);
        }

        console.log('\n🎉 Complete test finished!');

    } catch (error) {
        console.error('❌ Test failed with error:', error);
    }
}

// Run the test
testCompleteFPTFlow();
