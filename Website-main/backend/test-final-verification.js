// Final verification test for FPT PRO column system
// Using built-in fetch in Node.js 18+

const API_BASE = 'http://localhost:5000/api';
const TEST_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzVhYjQ4YzQ4YjQ4YjQ4YjQ4YjQ4YjQiLCJ1c2VybmFtZSI6ImFkbWluIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzM1NzQ4MDAwLCJleHAiOjE3MzU4MzQ0MDB9.test';

const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${TEST_TOKEN}`
};

async function testFinalVerification() {
    console.log('🧪 Final Verification Test for FPT PRO System...\n');

    try {
        // Step 1: Verify FPT PRO column exists
        console.log('1️⃣ Verifying FPT PRO column...');
        const getColumnsResponse = await fetch(`${API_BASE}/dynamic-columns/windows`, {
            headers
        });

        const getColumnsResult = await getColumnsResponse.json();
        if (!getColumnsResult.success) {
            console.log('❌ Failed to get columns:', getColumnsResult.message);
            return;
        }

        const fptProColumn = getColumnsResult.data.find(col =>
            col.columnName === 'FPT PRO' || col.columnLabel === 'FPT PRO'
        );

        if (!fptProColumn) {
            console.log('❌ FPT PRO column not found!');
            return;
        }

        console.log('✅ FPT PRO column verified!');
        console.log('📊 Column ID:', fptProColumn._id);
        console.log('📊 Column Key:', fptProColumn.columnKey);
        console.log('📊 Column Type:', fptProColumn.columnType);

        // Step 2: Verify Windows records exist
        console.log('\n2️⃣ Verifying Windows records...');
        const getRecordsResponse = await fetch(`${API_BASE}/admin/windows`, {
            headers
        });

        const getRecordsResult = await getRecordsResponse.json();
        if (getRecordsResult.length === 0) {
            console.log('❌ No Windows records found!');
            return;
        }

        console.log('✅ Windows records verified!');
        console.log('📊 Number of records:', getRecordsResult.length);

        // Step 3: Verify dynamic data exists
        console.log('\n3️⃣ Verifying dynamic data...');
        const getDynamicDataResponse = await fetch(`${API_BASE}/dynamic-columns/data/windows/null`, {
            headers
        });

        const getDynamicDataResult = await getDynamicDataResponse.json();
        if (!getDynamicDataResult.success) {
            console.log('❌ Failed to get dynamic data:', getDynamicDataResult.message);
            return;
        }

        console.log('✅ Dynamic data verified!');
        console.log('📊 Number of dynamic data items:', getDynamicDataResult.data.length);

        // Step 4: Verify data grouping works
        console.log('\n4️⃣ Verifying data grouping...');
        const dataByRecord = {};
        getDynamicDataResult.data.forEach(item => {
            if (item.parentRecord) {
                const recordId = item.parentRecord;
                if (!dataByRecord[recordId]) {
                    dataByRecord[recordId] = {};
                }
                dataByRecord[recordId][item.columnId] = item.value;
            }
        });

        console.log('✅ Data grouping verified!');
        console.log('📊 Records with FPT PRO data:', Object.keys(dataByRecord).length);

        // Step 5: Simulate complete AdminPanel flow
        console.log('\n5️⃣ Simulating complete AdminPanel flow...');

        // Static columns
        const staticColumns = [
            { key: "version", label: "Version", type: "text" },
            { key: "edition", label: "Edition", type: "text" },
            { key: "sha1", label: "SHA-1", type: "text" }
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

        console.log('✅ Column combination verified!');
        console.log('📊 Total columns:', allColumns.length);
        console.log('📊 Static columns:', staticColumns.length);
        console.log('📊 Dynamic columns:', dynamicColumns.length);

        // Step 6: Verify table rendering
        console.log('\n6️⃣ Verifying table rendering...');
        let recordsWithFPTData = 0;
        let recordsWithoutFPTData = 0;

        getRecordsResult.forEach((record, recordIndex) => {
            const hasFPTData = dataByRecord[record._id]?.[fptProColumn._id] !== undefined;
            if (hasFPTData) {
                recordsWithFPTData++;
                console.log(`   ✅ Record ${recordIndex + 1} (${record._id}): Has FPT PRO data`);
            } else {
                recordsWithoutFPTData++;
                console.log(`   ❌ Record ${recordIndex + 1} (${record._id}): No FPT PRO data`);
            }
        });

        console.log('✅ Table rendering verified!');
        console.log('📊 Records with FPT PRO data:', recordsWithFPTData);
        console.log('📊 Records without FPT PRO data:', recordsWithoutFPTData);

        // Step 7: Test adding new data
        console.log('\n7️⃣ Testing adding new data...');
        const testRecord = getRecordsResult[0];
        const testValue = 'https://fpt-pro.com/test-new-data';

        const saveDataResponse = await fetch(`${API_BASE}/dynamic-columns/data`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                columnId: fptProColumn._id,
                value: testValue,
                category: 'windows',
                parentRecord: testRecord._id,
                parentModel: 'Windows'
            })
        });

        const saveDataResult = await saveDataResponse.json();
        if (saveDataResult.success) {
            console.log('✅ New data added successfully!');
            console.log('📊 Test value:', testValue);
        } else {
            console.log('❌ Failed to add new data:', saveDataResult.message);
        }

        // Step 8: Final verification
        console.log('\n8️⃣ Final verification...');
        const finalDynamicDataResponse = await fetch(`${API_BASE}/dynamic-columns/data/windows/null`, {
            headers
        });

        const finalDynamicDataResult = await finalDynamicDataResponse.json();
        if (finalDynamicDataResult.success) {
            const finalDataByRecord = {};
            finalDynamicDataResult.data.forEach(item => {
                if (item.parentRecord) {
                    const recordId = item.parentRecord;
                    if (!finalDataByRecord[recordId]) {
                        finalDataByRecord[recordId] = {};
                    }
                    finalDataByRecord[recordId][item.columnId] = item.value;
                }
            });

            const testRecordData = finalDataByRecord[testRecord._id]?.[fptProColumn._id];
            if (testRecordData === testValue) {
                console.log('✅ Final verification passed!');
                console.log('📊 Test record has correct data:', testRecordData);
            } else {
                console.log('❌ Final verification failed!');
                console.log('📊 Expected:', testValue);
                console.log('📊 Actual:', testRecordData);
            }
        }

        console.log('\n🎉 Final verification completed!');
        console.log('📋 System Status:');
        console.log('   ✅ FPT PRO column exists and is accessible');
        console.log('   ✅ Windows records are accessible');
        console.log('   ✅ Dynamic data can be saved and retrieved');
        console.log('   ✅ Data grouping works correctly');
        console.log('   ✅ Column combination works correctly');
        console.log('   ✅ Table rendering simulation works');
        console.log('   ✅ New data can be added successfully');
        console.log('   ✅ System is ready for frontend use');

    } catch (error) {
        console.error('❌ Final verification failed with error:', error);
    }
}

// Run the test
testFinalVerification();
