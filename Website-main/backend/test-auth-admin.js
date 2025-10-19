import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

async function testAdminAuthentication() {
    console.log('🧪 Testing Admin Authentication...\n');

    try {
        // Test 1: Verify admin without token
        console.log('1️⃣ Testing verify admin without token...');
        try {
            const response = await axios.get(`${BASE_URL}/api/auth/verify-admin`);
            console.log('❌ Should have failed but got:', response.data);
        } catch (error) {
            if (error.response?.status === 401) {
                console.log('✅ Correctly rejected request without token');
                console.log('   Response:', error.response.data);
            } else {
                console.log('❌ Unexpected error:', error.message);
            }
        }

        console.log('\n' + '='.repeat(50) + '\n');

        // Test 2: Verify admin with invalid token
        console.log('2️⃣ Testing verify admin with invalid token...');
        try {
            const response = await axios.get(`${BASE_URL}/api/auth/verify-admin`, {
                headers: {
                    'Authorization': 'Bearer invalid_token_123'
                }
            });
            console.log('❌ Should have failed but got:', response.data);
        } catch (error) {
            if (error.response?.status === 401) {
                console.log('✅ Correctly rejected invalid token');
                console.log('   Response:', error.response.data);
            } else {
                console.log('❌ Unexpected error:', error.message);
            }
        }

        console.log('\n' + '='.repeat(50) + '\n');

        // Test 3: Login and verify admin with valid token
        console.log('3️⃣ Testing login and verify admin with valid token...');

        // First, try to login (you need to have an admin account)
        try {
            const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
                username: 'admin', // Change this to your admin username
                password: 'admin123' // Change this to your admin password
            });

            if (loginResponse.data.token) {
                console.log('✅ Login successful');
                const token = loginResponse.data.token;

                // Now verify admin with the token
                const verifyResponse = await axios.get(`${BASE_URL}/api/auth/verify-admin`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (verifyResponse.data.isAdmin) {
                    console.log('✅ Admin verification successful');
                    console.log('   Username:', verifyResponse.data.username);
                    console.log('   Message:', verifyResponse.data.message);
                } else {
                    console.log('❌ Admin verification failed');
                }
            } else {
                console.log('❌ Login failed - no token received');
            }
        } catch (error) {
            if (error.response?.status === 401) {
                console.log('❌ Login failed - invalid credentials');
                console.log('   Please make sure you have an admin account created');
                console.log('   Run: POST /api/auth/register with username and password');
            } else {
                console.log('❌ Login error:', error.message);
            }
        }

    } catch (error) {
        console.log('❌ Test error:', error.message);
    }

    console.log('\n🎉 Admin Authentication testing completed!');
    console.log('\n📝 Ghi chú:');
    console.log('   - Endpoint /api/auth/verify-admin kiểm tra quyền admin');
    console.log('   - Cần token hợp lệ để truy cập');
    console.log('   - Frontend sẽ ẩn các nút admin khi không có quyền');
}

// Run the test
testAdminAuthentication().catch(console.error);
