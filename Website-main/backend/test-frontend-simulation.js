// Test frontend simulation for FPT PRO column
// Using built-in fetch in Node.js 18+

const API_BASE = 'http://localhost:5000/api';
const TEST_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzVhYjQ4YzQ4YjQ4YjQ4YjQ4YjQ4YjQiLCJ1c2VybmFtZSI6ImFkbWluIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzM1NzQ4MDAwLCJleHAiOjE3MzU4MzQ0MDB9.test';

const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${TEST_TOKEN}`
};

async function testFrontendSimulation() {
    console.log('🧪 Testing Frontend Simulation for FPT PRO...\n');

    try {
        // Step 1: Simulate AdminPanel useEffect - Load Windows data
        console.log('1️⃣ Loading Windows data (AdminPanel useEffect)...');
        const getWindowsResponse = await fetch(`${API_BASE}/admin/windows`, {
            headers
        });

        const windowsData = await getWindowsResponse.json();
        console.log('✅ Windows data loaded!');
        console.log('📊 Number of records:', windowsData.length);

        // Step 2: Simulate loadDynamicColumns
        console.log('\n2️⃣ Loading dynamic columns...');
        const getColumnsResponse = await fetch(`${API_BASE}/dynamic-columns/windows`, {
            headers
        });

        const getColumnsResult = await getColumnsResponse.json();
        if (getColumnsResult.success) {
            console.log('✅ Dynamic columns loaded!');
            console.log('📊 Number of columns:', getColumnsResult.data.length);

            // Simulate combining static and dynamic columns
            const staticColumns = [
                { key: "version", label: "Version", type: "text" },
                { key: "edition", label: "Edition", type: "text" },
                { key: "sha1", label: "SHA-1", type: "text" }
            ];

            const dynamicColumns = getColumnsResult.data.map(col => ({
                key: col.columnKey,
                label: col.columnLabel,
                type: col.columnType,
                isDynamic: true,
                _id: col._id,
                columnId: col._id
            }));

            const allColumns = [...staticColumns, ...dynamicColumns];
            console.log('📊 All columns (static + dynamic):');
            allColumns.forEach((col, index) => {
                console.log(`   ${index + 1}. ${col.label} (${col.type}) ${col.isDynamic ? '[Dynamic]' : '[Static]'}`);
            });
        } else {
            console.log('❌ Failed to load dynamic columns:', getColumnsResult.message);
            return;
        }

        // Step 3: Simulate loadExistingDynamicData
        console.log('\n3️⃣ Loading existing dynamic data...');
        const getDynamicDataResponse = await fetch(`${API_BASE}/dynamic-columns/data/windows/null`, {
            headers
        });

        const getDynamicDataResult = await getDynamicDataResponse.json();
        if (getDynamicDataResult.success) {
            console.log('✅ Dynamic data loaded!');
            console.log('📊 Number of dynamic data items:', getDynamicDataResult.data.length);

            // Simulate grouping by parentRecord (like AdminPanel does)
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

            console.log('📊 Data grouped by record:');
            Object.entries(dataByRecord).forEach(([recordId, data]) => {
                console.log(`   Record ${recordId}:`);
                Object.entries(data).forEach(([columnId, value]) => {
                    console.log(`     Column ${columnId}: ${value}`);
                });
            });

            // Step 4: Simulate table rendering
            console.log('\n4️⃣ Simulating table rendering...');
            const staticColumns = [
                { key: "version", label: "Version", type: "text" },
                { key: "edition", label: "Edition", type: "text" },
                { key: "sha1", label: "SHA-1", type: "text" }
            ];

            const dynamicColumns = getColumnsResult.data.map(col => ({
                key: col.columnKey,
                label: col.columnLabel,
                type: col.columnType,
                isDynamic: true,
                _id: col._id,
                columnId: col._id
            }));

            const allColumns = [...staticColumns, ...dynamicColumns];

            console.log('📊 Table rendering simulation:');
            windowsData.forEach((record, recordIndex) => {
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

        } else {
            console.log('❌ Failed to load dynamic data:', getDynamicDataResult.message);
        }

        console.log('\n🎉 Frontend simulation completed!');

    } catch (error) {
        console.error('❌ Test failed with error:', error);
    }
}

// Run the test
testFrontendSimulation();
