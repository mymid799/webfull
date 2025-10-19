// Test script for optimized column management
import mongoose from 'mongoose';
import Software from './models/Software.js';
import Windows from './models/Windows.js';

const testColumnOptimization = async () => {
    try {
        console.log('🧪 Testing optimized column management...');

        // Test 1: Add column to data
        console.log('\n1. Testing add column to data...');
        const addColumnResponse = await fetch('http://localhost:5000/api/admin/columns/add', {
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
            console.log('✅ Add column test passed:', result);
        } else {
            const error = await addColumnResponse.json();
            console.log('❌ Add column test failed:', error);
        }

        // Test 2: Save column configuration
        console.log('\n2. Testing save column configuration...');
        const testColumns = [
            { key: 'version', label: 'Version', type: 'text' },
            { key: 'edition', label: 'Edition', type: 'text' },
            { key: 'test_column', label: 'Test Column', type: 'text' }
        ];

        const saveConfigResponse = await fetch('http://localhost:5000/api/admin/columns/save', {
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
            console.log('✅ Save config test passed:', result);
        } else {
            const error = await saveConfigResponse.json();
            console.log('❌ Save config test failed:', error);
        }

        // Test 3: Get column configuration
        console.log('\n3. Testing get column configuration...');
        const getConfigResponse = await fetch('http://localhost:5000/api/admin/columns/windows');

        if (getConfigResponse.ok) {
            const result = await getConfigResponse.json();
            console.log('✅ Get config test passed:', result);
        } else {
            const error = await getConfigResponse.json();
            console.log('❌ Get config test failed:', error);
        }

        // Test 4: Delete column from data
        console.log('\n4. Testing delete column from data...');
        const deleteColumnResponse = await fetch('http://localhost:5000/api/admin/columns/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                category: 'windows',
                columnKey: 'test_column'
            })
        });

        if (deleteColumnResponse.ok) {
            const result = await deleteColumnResponse.json();
            console.log('✅ Delete column test passed:', result);
        } else {
            const error = await deleteColumnResponse.json();
            console.log('❌ Delete column test failed:', error);
        }

        console.log('\n🎉 All column optimization tests completed!');

    } catch (error) {
        console.error('❌ Test failed:', error);
    }
};

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    testColumnOptimization();
}

export default testColumnOptimization;
