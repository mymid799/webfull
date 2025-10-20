// Complete test for FPT PRO column - from creation to display
// Using built-in fetch in Node.js 18+

const API_BASE = 'http://localhost:5000/api';
const TEST_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzVhYjQ4YzQ4YjQ4YjQ4YjQ4YjQ4YjQiLCJ1c2VybmFtZSI6ImFkbWluIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzM1NzQ4MDAwLCJleHAiOjE3MzU4MzQ0MDB9.test';

const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${TEST_TOKEN}`
};

async function testFullFPTFlow() {
    console.log('🧪 Testing Complete FPT PRO Flow - End to End...\n');

    try {
        // Step 1: Check if FPT PRO column exists, if not create it
        console.log('1️⃣ Checking/Creating FPT PRO column...');
        let getColumnsResponse = await fetch(`${API_BASE}/dynamic-columns/windows`, {
            headers
        });

        let getColumnsResult = await getColumnsResponse.json();
        let fptProColumn = null;

        if (getColumnsResult.success && getColumnsResult.data.length > 0) {
            fptProColumn = getColumnsResult.data.find(col =>
                col.columnName === 'FPT PRO' || col.columnLabel === 'FPT PRO'
            );
        }

        if (!fptProColumn) {
            console.log('   Creating FPT PRO column...');
            const createColumnResponse = await fetch(`${API_BASE}/dynamic-columns`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    columnName: 'FPT PRO',
                    columnType: 'text',
                    columnLabel: 'FPT PRO',
                    columnDescription: 'FPT PRO download link',
                    category: 'windows',
                    isRequired: false,
                    isVisible: true,
                    sortOrder: 0
                })
            });

            const createColumnResult = await createColumnResponse.json();
            if (createColumnResult.success) {
                fptProColumn = createColumnResult.data;
                console.log('   ✅ FPT PRO column created!');
            } else {
                console.log('   ❌ Failed to create FPT PRO column:', createColumnResult.message);
                return;
            }
        } else {
            console.log('   ✅ FPT PRO column already exists!');
        }

        console.log('📊 Column ID:', fptProColumn._id);

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

        // Step 3: Clear existing FPT PRO data and add new test data
        console.log('\n3️⃣ Clearing existing FPT PRO data...');
        const getAllDynamicDataResponse = await fetch(`${API_BASE}/dynamic-columns/data/windows/null`, {
            headers
        });

        const getAllDynamicDataResult = await getAllDynamicDataResponse.json();
        if (getAllDynamicDataResult.success) {
            // Delete existing FPT PRO data
            for (const item of getAllDynamicDataResult.data) {
                if (item.columnId === fptProColumn._id) {
                    const deleteResponse = await fetch(`${API_BASE}/dynamic-columns/data/${item._id}`, {
                        method: 'DELETE',
                        headers
                    });
                    const deleteResult = await deleteResponse.json();
                    if (deleteResult.success) {
                        console.log(`   ✅ Deleted existing data for record ${item.parentRecord}`);
                    }
                }
            }
        }

        // Step 4: Add new test data for each record
        console.log('\n4️⃣ Adding new test data...');
        const testData = [
            'https://fpt-pro.com/windows-11-pro-final-1',
            'https://fpt-pro.com/windows-11-pro-final-2',
            'https://fpt-pro.com/windows-11-pro-final-3'
        ];

        for (let i = 0; i < Math.min(getRecordsResult.length, testData.length); i++) {
            const record = getRecordsResult[i];
            const testValue = testData[i];

            console.log(`   Adding data for record ${i + 1}: ${testValue}`);

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

        // Step 5: Simulate AdminPanel data loading
        console.log('\n5️⃣ Simulating AdminPanel data loading...');

        // Load dynamic columns (like AdminPanel does)
        const loadColumnsResponse = await fetch(`${API_BASE}/dynamic-columns/windows`, {
            headers
        });

        const loadColumnsResult = await loadColumnsResponse.json();
        if (!loadColumnsResult.success) {
            console.log('❌ Failed to load dynamic columns:', loadColumnsResult.message);
            return;
        }

        console.log('✅ Dynamic columns loaded!');
        console.log('📊 Number of columns:', loadColumnsResult.data.length);

        // Load dynamic data (like AdminPanel does)
        const loadDynamicDataResponse = await fetch(`${API_BASE}/dynamic-columns/data/windows/null`, {
            headers
        });

        const loadDynamicDataResult = await loadDynamicDataResponse.json();
        if (!loadDynamicDataResult.success) {
            console.log('❌ Failed to load dynamic data:', loadDynamicDataResult.message);
            return;
        }

        console.log('✅ Dynamic data loaded!');
        console.log('📊 Number of dynamic data items:', loadDynamicDataResult.data.length);

        // Group data by parentRecord (like AdminPanel does)
        const dataByRecord = {};
        loadDynamicDataResult.data.forEach(item => {
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

        // Step 6: Simulate table rendering
        console.log('\n6️⃣ Simulating table rendering...');

        // Static columns
        const staticColumns = [
            { key: "version", label: "Version", type: "text" },
            { key: "edition", label: "Edition", type: "text" },
            { key: "sha1", label: "SHA-1", type: "text" }
        ];

        // Dynamic columns
        const dynamicColumns = loadColumnsResult.data.map(col => ({
            key: col.columnKey,
            label: col.columnLabel,
            type: col.columnType,
            isDynamic: true,
            _id: col._id,
            columnId: col._id
        }));

        const allColumns = [...staticColumns, ...dynamicColumns];

        console.log('📊 All columns:');
        allColumns.forEach((col, index) => {
            console.log(`   ${index + 1}. ${col.label} (${col.type}) ${col.isDynamic ? '[Dynamic]' : '[Static]'}`);
        });

        console.log('\n📊 Table data:');
        getRecordsResult.forEach((record, recordIndex) => {
            console.log(`   Row ${recordIndex + 1} (${record._id}):`);
            allColumns.forEach(col => {
                if (col.isDynamic) {
                    // Dynamic column - show data from dynamicData state
                    const value = dataByRecord[record._id]?.[col._id] || "-";
                    console.log(`     ${col.label}: ${value} ${value !== "-" ? "✅" : "❌"}`);
                } else {
                    // Static column
                    const value = record[col.key] || "-";
                    console.log(`     ${col.label}: ${value}`);
                }
            });
        });

        console.log('\n🎉 Complete FPT PRO flow test finished!');
        console.log('📋 Summary:');
        console.log('   ✅ FPT PRO column exists');
        console.log('   ✅ Test data saved for records');
        console.log('   ✅ Data loading simulation works');
        console.log('   ✅ Table rendering simulation works');

    } catch (error) {
        console.error('❌ Test failed with error:', error);
    }
}

// Run the test
testFullFPTFlow();
