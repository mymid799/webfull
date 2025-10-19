import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

async function testVirusTotalAPI() {
    console.log('🧪 Testing VirusTotal API Integration...\n');

    try {
        // Test 1: Scan a single URL
        console.log('1️⃣ Testing single URL scan...');
        const testUrl = 'https://www.google.com';

        const response = await axios.post(`${BASE_URL}/api/virustotal/scan`, {
            url: testUrl
        });

        if (response.data.success) {
            console.log('✅ Single URL scan successful!');
            console.log(`   URL: ${response.data.data.url}`);
            console.log(`   Threat Level: ${response.data.data.threatLevel}`);
            console.log(`   Detected: ${response.data.data.detectedCount}/${response.data.data.totalEngines}`);
            console.log(`   Safe: ${response.data.data.isSafe ? 'Yes' : 'No'}`);
        } else {
            console.log('❌ Single URL scan failed:', response.data.message);
        }

    } catch (error) {
        console.log('❌ Single URL scan error:', error.message);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    try {
        // Test 2: Batch scan multiple URLs
        console.log('2️⃣ Testing batch URL scan...');
        const testUrls = [
            'https://www.google.com',
            'https://www.github.com',
            'https://www.stackoverflow.com'
        ];

        const response = await axios.post(`${BASE_URL}/api/virustotal/batch-scan`, {
            urls: testUrls
        });

        if (response.data.success) {
            console.log('✅ Batch URL scan successful!');
            console.log(`   Total URLs: ${response.data.data.total}`);
            console.log(`   Successful: ${response.data.data.successCount}`);
            console.log(`   Errors: ${response.data.data.errorCount}`);

            response.data.data.results.forEach((result, index) => {
                console.log(`   URL ${index + 1}: ${result.url} - ${result.threatLevel}`);
            });
        } else {
            console.log('❌ Batch URL scan failed:', response.data.message);
        }

    } catch (error) {
        console.log('❌ Batch URL scan error:', error.message);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    try {
        // Test 3: Get scan stats
        console.log('3️⃣ Testing scan stats...');

        const response = await axios.get(`${BASE_URL}/api/virustotal/stats`);

        if (response.data.success) {
            console.log('✅ Scan stats retrieved successfully!');
            console.log('   Stats:', JSON.stringify(response.data.data, null, 2));
        } else {
            console.log('❌ Scan stats failed:', response.data.message);
        }

    } catch (error) {
        console.log('❌ Scan stats error:', error.message);
    }

    console.log('\n🎉 VirusTotal API testing completed!');
}

// Run the test
testVirusTotalAPI().catch(console.error);
