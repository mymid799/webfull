import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

async function testOptimizedVirusTotalAPI() {
    console.log('🧪 Testing Optimized VirusTotal API Integration...\n');

    // Test URLs - một số an toàn, một số có thể có vấn đề
    const testUrls = [
        'https://www.google.com',
        'https://www.github.com',
        'https://www.stackoverflow.com',
        'https://www.microsoft.com',
        'https://www.apple.com'
    ];

    try {
        console.log('1️⃣ Testing optimized single URL scan...');
        const testUrl = testUrls[0];

        console.log(`   Quét URL: ${testUrl}`);
        console.log('   ⏳ Đang chờ kết quả (có thể mất 10-30 giây)...');

        const startTime = Date.now();
        const response = await axios.post(`${BASE_URL}/api/virustotal/scan`, {
            url: testUrl
        });
        const endTime = Date.now();

        if (response.data.success) {
            console.log('✅ Single URL scan successful!');
            console.log(`   ⏱️ Thời gian: ${(endTime - startTime) / 1000}s`);
            console.log(`   🔗 URL: ${response.data.data.url}`);
            console.log(`   🛡️ Threat Level: ${response.data.data.threatLevel}`);
            console.log(`   📊 Detected: ${response.data.data.detectedCount}/${response.data.data.totalEngines}`);
            console.log(`   ✅ Safe: ${response.data.data.isSafe ? 'Yes' : 'No'}`);
        } else {
            console.log('❌ Single URL scan failed:', response.data.message);
        }

    } catch (error) {
        console.log('❌ Single URL scan error:', error.message);
    }

    console.log('\n' + '='.repeat(60) + '\n');

    try {
        console.log('2️⃣ Testing optimized batch URL scan...');
        console.log(`   Quét ${testUrls.length} URLs...`);
        console.log('   ⏳ Đang chờ kết quả (có thể mất 30-60 giây)...');

        const startTime = Date.now();
        const response = await axios.post(`${BASE_URL}/api/virustotal/batch-scan`, {
            urls: testUrls
        });
        const endTime = Date.now();

        if (response.data.success) {
            console.log('✅ Batch URL scan successful!');
            console.log(`   ⏱️ Thời gian: ${(endTime - startTime) / 1000}s`);
            console.log(`   📊 Total URLs: ${response.data.data.total}`);
            console.log(`   ✅ Successful: ${response.data.data.successCount}`);
            console.log(`   ❌ Errors: ${response.data.data.errorCount}`);

            console.log('\n   📋 Kết quả chi tiết:');
            response.data.data.results.forEach((result, index) => {
                console.log(`   ${index + 1}. ${result.url}`);
                console.log(`      🛡️ ${result.threatLevel} (${result.detectedCount}/${result.totalEngines})`);
                console.log(`      ✅ ${result.isSafe ? 'An toàn' : 'Có rủi ro'}`);
            });

            if (response.data.data.errors.length > 0) {
                console.log('\n   ❌ Lỗi:');
                response.data.data.errors.forEach((error, index) => {
                    console.log(`   ${index + 1}. ${error.url}: ${error.error}`);
                });
            }
        } else {
            console.log('❌ Batch URL scan failed:', response.data.message);
        }

    } catch (error) {
        console.log('❌ Batch URL scan error:', error.message);
    }

    console.log('\n' + '='.repeat(60) + '\n');

    try {
        console.log('3️⃣ Testing scan status endpoint...');

        // Lấy scan ID từ kết quả trước (nếu có)
        const response = await axios.get(`${BASE_URL}/api/virustotal/stats`);

        if (response.data.success) {
            console.log('✅ Scan stats retrieved successfully!');
            console.log('   📊 Stats:', JSON.stringify(response.data.data, null, 2));
        } else {
            console.log('❌ Scan stats failed:', response.data.message);
        }

    } catch (error) {
        console.log('❌ Scan stats error:', error.message);
    }

    console.log('\n🎉 Optimized VirusTotal API testing completed!');
    console.log('\n📝 Ghi chú:');
    console.log('   - Retry logic đã được tối ưu với exponential backoff');
    console.log('   - Xử lý response_code 0 (Resource does not exist)');
    console.log('   - Tối đa 10 lần thử với delay tăng dần');
    console.log('   - Frontend hiển thị tiến trình và lỗi rõ ràng');
}

// Run the test
testOptimizedVirusTotalAPI().catch(console.error);
