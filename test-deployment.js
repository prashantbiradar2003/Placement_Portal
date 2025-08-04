// Test script to verify Render deployment
const https = require('https');

const RENDER_URL = 'https://placement-portal-ir4x.onrender.com';

async function testEndpoint(endpoint) {
  return new Promise((resolve, reject) => {
    const url = `${RENDER_URL}${endpoint}`;
    console.log(`🧪 Testing: ${url}`);
    
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`✅ ${endpoint} - Status: ${res.statusCode}`);
        try {
          const jsonData = JSON.parse(data);
          console.log(`📄 Response:`, jsonData);
        } catch (e) {
          console.log(`📄 Response: ${data}`);
        }
        resolve({ status: res.statusCode, data });
      });
    }).on('error', (err) => {
      console.error(`❌ ${endpoint} - Error: ${err.message}`);
      reject(err);
    });
  });
}

async function runTests() {
  console.log('🚀 Testing Render Deployment...\n');
  
  try {
    // Test 1: Basic endpoint
    await testEndpoint('/');
    
    // Test 2: Health check
    await testEndpoint('/health');
    
    // Test 3: API endpoint
    await testEndpoint('/api/auth/check');
    
    console.log('\n✅ All tests completed!');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
  }
}

runTests(); 