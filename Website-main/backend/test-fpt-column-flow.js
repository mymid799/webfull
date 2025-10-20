import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

async function testFPTColumnFlow() {
    console.log('🧪 Testing FPT Column Flow...\n');

    try {
        // Step 1: Create FPT dynamic column
        console.log('1️⃣ Creating FPT dynamic column...');
        const fptColumn = {
            columnName: 'fpt',
            columnType: 'text',
            columnLabel: 'FPT',
            columnDescription: 'FPT download link',
            category: 'windows',
            isRequired: false
        };

        const createColumnResponse = await axios.post(`${BASE_URL}/api/dynamic-columns`, fptColumn);

        if (createColumnResponse.data.success) {
            console.log('✅ FPT column created successfully!');
            const columnId = createColumnResponse.data.data._id;
            console.log('   Column ID:', columnId);
            console.log('   Column Key:', createColumnResponse.data.data.columnKey);

            // Step 2: Create a Windows record
            console.log('\n2️⃣ Creating Windows record...');
            const windowsRecord = {
                version: '1.0.0',
                edition: 'Professional',
                sha1: 'test123',
                category: 'windows'
            };

            const createRecordResponse = await axios.post(`${BASE_URL}/api/admin`, windowsRecord);

            console.log('Create record response:', createRecordResponse.data);

            if (createRecordResponse.status === 201) {
                console.log('✅ Windows record created successfully!');
                const recordId = createRecordResponse.data._id;
                console.log('   Record ID:', recordId);

                // Step 3: Save FPT data for the record
                console.log('\n3️⃣ Saving FPT data for the record...');
                const fptData = {
                    columnId: columnId,
                    value: 'https://fpt.com/download/windows-pro',
                    category: 'windows',
                    parentRecord: recordId,
                    parentModel: 'Windows'
                };

                const saveDataResponse = await axios.post(`${BASE_URL}/api/dynamic-columns/data`, fptData);

                if (saveDataResponse.data.success) {
                    console.log('✅ FPT data saved successfully!');
                    console.log('   Data ID:', saveDataResponse.data.data._id);
                    console.log('   Value:', saveDataResponse.data.data.value);

                    // Step 4: Get all dynamic data for windows category
                    console.log('\n4️⃣ Getting all dynamic data for windows category...');
                    const getAllDataResponse = await axios.get(`${BASE_URL}/api/dynamic-columns/data/windows/null`);

                    if (getAllDataResponse.data.success) {
                        console.log('✅ All dynamic data retrieved successfully!');
                        console.log('   Total data entries:', getAllDataResponse.data.data.length);

                        getAllDataResponse.data.data.forEach((item, index) => {
                            console.log(`   ${index + 1}. Record: ${item.parentRecord}, Column: ${item.columnId}, Value: ${item.value}`);
                        });

                        // Step 5: Get columns with data
                        console.log('\n5️⃣ Getting columns with data...');
                        const getColumnsWithDataResponse = await axios.get(`${BASE_URL}/api/dynamic-columns/windows/with-data?parentRecord=${recordId}&parentModel=windows`);

                        if (getColumnsWithDataResponse.data.success) {
                            console.log('✅ Columns with data retrieved successfully!');
                            console.log('   Total columns:', getColumnsWithDataResponse.data.data.length);

                            getColumnsWithDataResponse.data.data.forEach((col, index) => {
                                console.log(`   ${index + 1}. ${col.columnLabel}: ${col.data ? col.data.value : 'No data'}`);
                            });
                        }

                        // Step 6: Get all admin records
                        console.log('\n6️⃣ Getting all admin records...');
                        const getRecordsResponse = await axios.get(`${BASE_URL}/api/admin/windows`);

                        if (getRecordsResponse.data) {
                            console.log('✅ Admin records retrieved successfully!');
                            console.log('   Total records:', getRecordsResponse.data.length);
                            getRecordsResponse.data.forEach((record, index) => {
                                console.log(`   ${index + 1}. Version: ${record.version}, Edition: ${record.edition}, ID: ${record._id}`);
                            });
                        }

                        // Step 7: Test the complete flow
                        console.log('\n7️⃣ Testing complete data flow...');
                        console.log('   Expected: FPT column should show "https://fpt.com/download/windows-pro" for record', recordId);

                        // Simulate what frontend should do
                        const dataByRecord = {};
                        getAllDataResponse.data.data.forEach(item => {
                            if (item.parentRecord) {
                                const recordId = item.parentRecord;
                                if (!dataByRecord[recordId]) {
                                    dataByRecord[recordId] = {};
                                }
                                dataByRecord[recordId][item.columnId] = item.value;
                            }
                        });

                        console.log('   Grouped data by record:', dataByRecord);

                        if (dataByRecord[recordId] && dataByRecord[recordId][columnId]) {
                            console.log('✅ FPT data found for record:', dataByRecord[recordId][columnId]);
                        } else {
                            console.log('❌ FPT data NOT found for record');
                        }

                    } else {
                        console.log('❌ Get all dynamic data failed:', getAllDataResponse.data.message);
                    }

                    // Step 8: Cleanup
                    console.log('\n8️⃣ Cleaning up...');
                    await axios.delete(`${BASE_URL}/api/dynamic-columns/${columnId}`);
                    await axios.delete(`${BASE_URL}/api/admin/${recordId}`);
                    console.log('✅ Cleanup completed');

                } else {
                    console.log('❌ Save FPT data failed:', saveDataResponse.data.message);
                }
            } else {
                console.log('❌ Create Windows record failed:', createRecordResponse.data.message);
            }
        } else {
            console.log('❌ Create FPT column failed:', createColumnResponse.data.message);
        }

    } catch (error) {
        console.log('❌ Test error:', error.message);
        if (error.response) {
            console.log('   Response:', error.response.data);
        }
    }

    console.log('\n🎉 FPT Column Flow testing completed!');
    console.log('\n📝 If this test passes, the frontend should:');
    console.log('   ✅ Show FPT column in table header with [Động] label');
    console.log('   ✅ Display FPT data in blue text in table cells');
    console.log('   ✅ Allow input of FPT data in add row form');
    console.log('   ✅ Save and persist FPT data correctly');
}

// Run the test
testFPTColumnFlow().catch(console.error);
