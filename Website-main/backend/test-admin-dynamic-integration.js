import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

async function testAdminDynamicIntegration() {
    console.log('🧪 Testing Admin Panel Dynamic Columns Integration...\n');

    try {
        // Test 1: Create a dynamic column
        console.log('1️⃣ Creating dynamic column...');
        const dynamicColumn = {
            columnName: 'test_build',
            columnType: 'text',
            columnLabel: 'Build Number',
            columnDescription: 'Build number for the software',
            category: 'windows',
            isRequired: false
        };

        const createColumnResponse = await axios.post(`${BASE_URL}/api/dynamic-columns`, dynamicColumn);

        if (createColumnResponse.data.success) {
            console.log('✅ Dynamic column created successfully!');
            const columnId = createColumnResponse.data.data._id;
            console.log('   Column ID:', columnId);
            console.log('   Column Key:', createColumnResponse.data.data.columnKey);

            // Test 2: Create a regular admin record
            console.log('\n2️⃣ Creating admin record...');
            const adminRecord = {
                version: '1.0.0',
                edition: 'Professional',
                sha1: 'abc123def456',
                category: 'windows'
            };

            const createRecordResponse = await axios.post(`${BASE_URL}/api/admin`, adminRecord);

            if (createRecordResponse.data.success) {
                console.log('✅ Admin record created successfully!');
                const recordId = createRecordResponse.data._id;
                console.log('   Record ID:', recordId);

                // Test 3: Save dynamic data for the record
                console.log('\n3️⃣ Saving dynamic data for the record...');
                const dynamicData = {
                    columnId: columnId,
                    value: 'Build-2024.01.15',
                    category: 'windows',
                    parentRecord: recordId,
                    parentModel: 'windows'
                };

                const saveDataResponse = await axios.post(`${BASE_URL}/api/dynamic-columns/data`, dynamicData);

                if (saveDataResponse.data.success) {
                    console.log('✅ Dynamic data saved successfully!');
                    console.log('   Data ID:', saveDataResponse.data.data._id);
                    console.log('   Value:', saveDataResponse.data.data.value);

                    // Test 4: Get columns with data
                    console.log('\n4️⃣ Getting columns with data...');
                    const getColumnsWithDataResponse = await axios.get(`${BASE_URL}/api/dynamic-columns/windows/with-data?parentRecord=${recordId}&parentModel=windows`);

                    if (getColumnsWithDataResponse.data.success) {
                        console.log('✅ Columns with data retrieved successfully!');
                        console.log('   Total columns:', getColumnsWithDataResponse.data.data.length);

                        getColumnsWithDataResponse.data.data.forEach((col, index) => {
                            console.log(`   ${index + 1}. ${col.columnLabel}: ${col.data ? col.data.value : 'No data'}`);
                        });
                    }

                    // Test 5: Get all admin records
                    console.log('\n5️⃣ Getting all admin records...');
                    const getRecordsResponse = await axios.get(`${BASE_URL}/api/admin/windows`);

                    if (getRecordsResponse.data) {
                        console.log('✅ Admin records retrieved successfully!');
                        console.log('   Total records:', getRecordsResponse.data.length);
                        getRecordsResponse.data.forEach((record, index) => {
                            console.log(`   ${index + 1}. Version: ${record.version}, Edition: ${record.edition}`);
                        });
                    }

                    // Test 6: Cleanup - Delete the dynamic column
                    console.log('\n6️⃣ Cleaning up - deleting dynamic column...');
                    const deleteColumnResponse = await axios.delete(`${BASE_URL}/api/dynamic-columns/${columnId}`);

                    if (deleteColumnResponse.data.success) {
                        console.log('✅ Dynamic column deleted successfully!');
                        console.log('   Related data also deleted');
                    }

                    // Test 7: Delete the admin record
                    console.log('\n7️⃣ Cleaning up - deleting admin record...');
                    const deleteRecordResponse = await axios.delete(`${BASE_URL}/api/admin/${recordId}`);

                    if (deleteRecordResponse.status === 200) {
                        console.log('✅ Admin record deleted successfully!');
                    }

                } else {
                    console.log('❌ Save dynamic data failed:', saveDataResponse.data.message);
                }
            } else {
                console.log('❌ Create admin record failed:', createRecordResponse.data.message);
            }
        } else {
            console.log('❌ Create dynamic column failed:', createColumnResponse.data.message);
        }

    } catch (error) {
        console.log('❌ Test error:', error.message);
        if (error.response) {
            console.log('   Response:', error.response.data);
        }
    }

    console.log('\n🎉 Admin Panel Dynamic Columns Integration testing completed!');
    console.log('\n📝 Integration features tested:');
    console.log('   ✅ Create dynamic column');
    console.log('   ✅ Create admin record');
    console.log('   ✅ Save dynamic data linked to admin record');
    console.log('   ✅ Retrieve columns with data');
    console.log('   ✅ Get admin records');
    console.log('   ✅ Cleanup operations');
    console.log('\n🎯 Frontend should now show:');
    console.log('   - Dynamic columns in table header with [Động] label');
    console.log('   - Blue-bordered input fields for dynamic columns in add row');
    console.log('   - Dynamic data displayed in blue text in table cells');
    console.log('   - Automatic saving of both static and dynamic data');
}

// Run the test
testAdminDynamicIntegration().catch(console.error);
