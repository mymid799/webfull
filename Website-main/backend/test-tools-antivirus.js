// Test script for Tools and Antivirus column management
const BASE_URL = 'http://127.0.0.1:5000';

const testToolsAndAntivirus = async () => {
    try {
        console.log('🧪 Testing Tools and Antivirus column management...');

        // Test Tools
        console.log('\n=== TESTING TOOLS ===');

        // 1. Get Tools column config
        console.log('\n1. Getting Tools column configuration...');
        const toolsConfigResponse = await fetch(`${BASE_URL}/api/admin/columns/tools`);
        if (toolsConfigResponse.ok) {
            const toolsConfig = await toolsConfigResponse.json();
            console.log('✅ Tools config:', toolsConfig);
        } else {
            console.log('❌ Failed to get Tools config:', toolsConfigResponse.status);
        }

        // 2. Add test column to Tools
        console.log('\n2. Adding test column to Tools...');
        const addToolsColumnResponse = await fetch(`${BASE_URL}/api/admin/columns/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                category: 'tools',
                columnKey: 'test_tools_column',
                columnType: 'text'
            })
        });

        if (addToolsColumnResponse.ok) {
            const result = await addToolsColumnResponse.json();
            console.log('✅ Add Tools column result:', result);
        } else {
            const error = await addToolsColumnResponse.text();
            console.log('❌ Add Tools column failed:', error);
        }

        // 3. Delete test column from Tools
        console.log('\n3. Deleting test column from Tools...');
        const deleteToolsColumnResponse = await fetch(`${BASE_URL}/api/admin/columns/delete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                category: 'tools',
                columnKey: 'test_tools_column'
            })
        });

        if (deleteToolsColumnResponse.ok) {
            const result = await deleteToolsColumnResponse.json();
            console.log('✅ Delete Tools column result:', result);
        } else {
            const error = await deleteToolsColumnResponse.text();
            console.log('❌ Delete Tools column failed:', error);
        }

        // Test Antivirus
        console.log('\n=== TESTING ANTIVIRUS ===');

        // 1. Get Antivirus column config
        console.log('\n1. Getting Antivirus column configuration...');
        const antivirusConfigResponse = await fetch(`${BASE_URL}/api/admin/columns/antivirus`);
        if (antivirusConfigResponse.ok) {
            const antivirusConfig = await antivirusConfigResponse.json();
            console.log('✅ Antivirus config:', antivirusConfig);
        } else {
            console.log('❌ Failed to get Antivirus config:', antivirusConfigResponse.status);
        }

        // 2. Add test column to Antivirus
        console.log('\n2. Adding test column to Antivirus...');
        const addAntivirusColumnResponse = await fetch(`${BASE_URL}/api/admin/columns/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                category: 'antivirus',
                columnKey: 'test_antivirus_column',
                columnType: 'text'
            })
        });

        if (addAntivirusColumnResponse.ok) {
            const result = await addAntivirusColumnResponse.json();
            console.log('✅ Add Antivirus column result:', result);
        } else {
            const error = await addAntivirusColumnResponse.text();
            console.log('❌ Add Antivirus column failed:', error);
        }

        // 3. Delete test column from Antivirus
        console.log('\n3. Deleting test column from Antivirus...');
        const deleteAntivirusColumnResponse = await fetch(`${BASE_URL}/api/admin/columns/delete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                category: 'antivirus',
                columnKey: 'test_antivirus_column'
            })
        });

        if (deleteAntivirusColumnResponse.ok) {
            const result = await deleteAntivirusColumnResponse.json();
            console.log('✅ Delete Antivirus column result:', result);
        } else {
            const error = await deleteAntivirusColumnResponse.text();
            console.log('❌ Delete Antivirus column failed:', error);
        }

        console.log('\n🎉 Tools and Antivirus column management test completed!');

    } catch (error) {
        console.error('❌ Test failed:', error);
    }
};

// Run the test
testToolsAndAntivirus();
