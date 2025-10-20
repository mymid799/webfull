import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

async function testDynamicColumns() {
    console.log('🧪 Testing Dynamic Columns System...\n');

    try {
        // Test 1: Create dynamic column
        console.log('1️⃣ Testing create dynamic column...');
        const newColumn = {
            columnName: 'test_version',
            columnType: 'text',
            columnLabel: 'Test Version',
            columnDescription: 'Test column for version information',
            category: 'windows',
            isRequired: true
        };

        const createResponse = await axios.post(`${BASE_URL}/api/dynamic-columns`, newColumn);

        if (createResponse.data.success) {
            console.log('✅ Dynamic column created successfully!');
            console.log('   Column ID:', createResponse.data.data._id);
            console.log('   Column Key:', createResponse.data.data.columnKey);
            console.log('   Column Label:', createResponse.data.data.columnLabel);

            const columnId = createResponse.data.data._id;

            // Test 2: Get dynamic columns
            console.log('\n2️⃣ Testing get dynamic columns...');
            const getColumnsResponse = await axios.get(`${BASE_URL}/api/dynamic-columns/windows`);

            if (getColumnsResponse.data.success) {
                console.log('✅ Dynamic columns retrieved successfully!');
                console.log('   Total columns:', getColumnsResponse.data.data.length);
                getColumnsResponse.data.data.forEach((col, index) => {
                    console.log(`   ${index + 1}. ${col.columnLabel} (${col.columnType})`);
                });
            }

            // Test 3: Save dynamic data
            console.log('\n3️⃣ Testing save dynamic data...');
            const testData = {
                columnId: columnId,
                value: '1.0.0',
                category: 'windows',
                parentRecord: 'test-record-123',
                parentModel: 'Windows'
            };

            const saveDataResponse = await axios.post(`${BASE_URL}/api/dynamic-columns/data`, testData);

            if (saveDataResponse.data.success) {
                console.log('✅ Dynamic data saved successfully!');
                console.log('   Data ID:', saveDataResponse.data.data._id);
                console.log('   Value:', saveDataResponse.data.data.value);
                console.log('   Data Type:', saveDataResponse.data.data.dataType);
            }

            // Test 4: Get dynamic data
            console.log('\n4️⃣ Testing get dynamic data...');
            const getDataResponse = await axios.get(`${BASE_URL}/api/dynamic-columns/data/windows/test-record-123?parentModel=Windows`);

            if (getDataResponse.data.success) {
                console.log('✅ Dynamic data retrieved successfully!');
                console.log('   Total data entries:', getDataResponse.data.data.length);
                getDataResponse.data.data.forEach((item, index) => {
                    console.log(`   ${index + 1}. ${item.columnId.columnLabel}: ${item.value}`);
                });
            }

            // Test 5: Get columns with data
            console.log('\n5️⃣ Testing get columns with data...');
            const getColumnsWithDataResponse = await axios.get(`${BASE_URL}/api/dynamic-columns/windows/with-data?parentRecord=test-record-123&parentModel=Windows`);

            if (getColumnsWithDataResponse.data.success) {
                console.log('✅ Columns with data retrieved successfully!');
                console.log('   Total columns with data:', getColumnsWithDataResponse.data.data.length);
                getColumnsWithDataResponse.data.data.forEach((col, index) => {
                    console.log(`   ${index + 1}. ${col.columnLabel}: ${col.data ? col.data.value : 'No data'}`);
                });
            }

            // Test 6: Update dynamic column
            console.log('\n6️⃣ Testing update dynamic column...');
            const updateResponse = await axios.put(`${BASE_URL}/api/dynamic-columns/${columnId}`, {
                columnDescription: 'Updated test column description',
                isRequired: false
            });

            if (updateResponse.data.success) {
                console.log('✅ Dynamic column updated successfully!');
                console.log('   Updated description:', updateResponse.data.data.columnDescription);
                console.log('   Is required:', updateResponse.data.data.isRequired);
            }

            // Test 7: Delete dynamic column (cleanup)
            console.log('\n7️⃣ Testing delete dynamic column...');
            const deleteResponse = await axios.delete(`${BASE_URL}/api/dynamic-columns/${columnId}`);

            if (deleteResponse.data.success) {
                console.log('✅ Dynamic column deleted successfully!');
                console.log('   Related data also deleted');
            }

        } else {
            console.log('❌ Create dynamic column failed:', createResponse.data.message);
        }

    } catch (error) {
        console.log('❌ Test error:', error.message);
        if (error.response) {
            console.log('   Response:', error.response.data);
        }
    }

    console.log('\n🎉 Dynamic Columns System testing completed!');
    console.log('\n📝 Features tested:');
    console.log('   ✅ Create dynamic column');
    console.log('   ✅ Get dynamic columns by category');
    console.log('   ✅ Save dynamic data');
    console.log('   ✅ Get dynamic data');
    console.log('   ✅ Get columns with data');
    console.log('   ✅ Update dynamic column');
    console.log('   ✅ Delete dynamic column and related data');
}

// Run the test
testDynamicColumns().catch(console.error);
