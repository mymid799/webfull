import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = 'http://localhost:5000/api';

async function testSystemHealth() {
    console.log('🔍 Testing System Health...\n');

    // Test 1: Server connectivity
    try {
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: 'test',
                password: 'test'
            })
        });
        console.log('✅ Server is running on port 5000');
    } catch (error) {
        console.log('❌ Server connection failed:', error.message);
        return;
    }

    // Test 2: Column Config API
    try {
        const response = await fetch(`${BASE_URL}/column-config/data/windows`);
        if (response.ok) {
            console.log('✅ Column Config API is working');
        } else {
            console.log('⚠️ Column Config API returned:', response.status);
        }
    } catch (error) {
        console.log('❌ Column Config API error:', error.message);
    }

    // Test 3: Office API
    try {
        const response = await fetch(`${BASE_URL}/column-config/data/office`);
        if (response.ok) {
            console.log('✅ Office API is working');
        } else {
            console.log('⚠️ Office API returned:', response.status);
        }
    } catch (error) {
        console.log('❌ Office API error:', error.message);
    }

    // Test 4: Tools API
    try {
        const response = await fetch(`${BASE_URL}/column-config/data/tools`);
        if (response.ok) {
            console.log('✅ Tools API is working');
        } else {
            console.log('⚠️ Tools API returned:', response.status);
        }
    } catch (error) {
        console.log('❌ Tools API error:', error.message);
    }

    // Test 5: Antivirus API
    try {
        const response = await fetch(`${BASE_URL}/column-config/data/antivirus`);
        if (response.ok) {
            console.log('✅ Antivirus API is working');
        } else {
            console.log('⚠️ Antivirus API returned:', response.status);
        }
    } catch (error) {
        console.log('❌ Antivirus API error:', error.message);
    }

    console.log('\n🎯 System Health Check Complete!');
}

testSystemHealth();
