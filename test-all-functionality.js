// Comprehensive functionality test script
const https = require('https');

const RENDER_URL = 'https://placement-portal-ir4x.onrender.com';

// Test data
const testUsers = {
  student: {
    name: "Test Student",
    email: "teststudent@example.com",
    password: "password123",
    role: "student",
    branch: "Computer Science Engineering",
    cgpa: "8.5"
  },
  officer: {
    name: "Test Officer",
    email: "testofficer@example.com", 
    password: "password123",
    role: "officer"
  }
};

let authTokens = {};

async function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });
    
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

async function testRegistration() {
  console.log('\n🧪 Testing Registration...');
  
  // Test student registration
  console.log('📝 Testing student registration...');
  const studentReg = await makeRequest(`${RENDER_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testUsers.student)
  });
  
  if (studentReg.status === 201 || studentReg.status === 200) {
    console.log('✅ Student registration successful');
    if (studentReg.data.token) {
      authTokens.student = studentReg.data.token;
    }
  } else {
    console.log('❌ Student registration failed:', studentReg.data);
  }
  
  // Test officer registration
  console.log('📝 Testing officer registration...');
  const officerReg = await makeRequest(`${RENDER_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testUsers.officer)
  });
  
  if (officerReg.status === 201 || officerReg.status === 200) {
    console.log('✅ Officer registration successful');
    if (officerReg.data.token) {
      authTokens.officer = officerReg.data.token;
    }
  } else {
    console.log('❌ Officer registration failed:', officerReg.data);
  }
}

async function testLogin() {
  console.log('\n🧪 Testing Login...');
  
  // Test student login
  console.log('📝 Testing student login...');
  const studentLogin = await makeRequest(`${RENDER_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testUsers.student.email,
      password: testUsers.student.password
    })
  });
  
  if (studentLogin.status === 200) {
    console.log('✅ Student login successful');
    authTokens.student = studentLogin.data.token;
  } else {
    console.log('❌ Student login failed:', studentLogin.data);
  }
  
  // Test officer login
  console.log('📝 Testing officer login...');
  const officerLogin = await makeRequest(`${RENDER_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testUsers.officer.email,
      password: testUsers.officer.password
    })
  });
  
  if (officerLogin.status === 200) {
    console.log('✅ Officer login successful');
    authTokens.officer = officerLogin.data.token;
  } else {
    console.log('❌ Officer login failed:', officerLogin.data);
  }
}

async function testJobPosting() {
  console.log('\n🧪 Testing Job Posting...');
  
  if (!authTokens.officer) {
    console.log('❌ No officer token available for job posting test');
    return;
  }
  
  const testJob = {
    title: "Software Engineer",
    description: "Full-stack development role",
    company: "Tech Corp",
    salary: "8 LPA",
    branches: ["Computer Science Engineering", "Information Science"],
    location: "Bangalore",
    deadline: "2025-12-31",
    minCGPA: "7.0"
  };
  
  const jobPost = await makeRequest(`${RENDER_URL}/api/jobs`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authTokens.officer}`
    },
    body: JSON.stringify(testJob)
  });
  
  if (jobPost.status === 201) {
    console.log('✅ Job posting successful');
    return jobPost.data.job._id;
  } else {
    console.log('❌ Job posting failed:', jobPost.data);
    return null;
  }
}

async function testJobFetching() {
  console.log('\n🧪 Testing Job Fetching...');
  
  // Test without token (should fail)
  console.log('📝 Testing jobs endpoint without token...');
  const noTokenJobs = await makeRequest(`${RENDER_URL}/api/jobs`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  
  if (noTokenJobs.status === 401) {
    console.log('✅ Jobs endpoint correctly requires authentication');
  } else {
    console.log('❌ Jobs endpoint should require authentication:', noTokenJobs.status);
  }
  
  // Test with officer token
  if (authTokens.officer) {
    console.log('📝 Testing jobs endpoint with officer token...');
    const officerJobs = await makeRequest(`${RENDER_URL}/api/jobs`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authTokens.officer}`
      }
    });
    
    if (officerJobs.status === 200) {
      console.log('✅ Officer can fetch jobs successfully');
      console.log(`📊 Found ${officerJobs.data.length} jobs`);
    } else {
      console.log('❌ Officer job fetching failed:', officerJobs.data);
    }
  }
  
  // Test with student token
  if (authTokens.student) {
    console.log('📝 Testing jobs endpoint with student token...');
    const studentJobs = await makeRequest(`${RENDER_URL}/api/jobs`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authTokens.student}`
      }
    });
    
    if (studentJobs.status === 200) {
      console.log('✅ Student can fetch jobs successfully');
      console.log(`📊 Found ${studentJobs.data.length} jobs`);
    } else {
      console.log('❌ Student job fetching failed:', studentJobs.data);
    }
  }
}

async function testUserProfile() {
  console.log('\n🧪 Testing User Profile...');
  
  if (authTokens.student) {
    console.log('📝 Testing student profile...');
    const studentProfile = await makeRequest(`${RENDER_URL}/api/auth/me`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authTokens.student}`
      }
    });
    
    if (studentProfile.status === 200) {
      console.log('✅ Student profile fetch successful');
      console.log(`👤 Student: ${studentProfile.data.name} (${studentProfile.data.role})`);
    } else {
      console.log('❌ Student profile fetch failed:', studentProfile.data);
    }
  }
  
  if (authTokens.officer) {
    console.log('📝 Testing officer profile...');
    const officerProfile = await makeRequest(`${RENDER_URL}/api/auth/me`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authTokens.officer}`
      }
    });
    
    if (officerProfile.status === 200) {
      console.log('✅ Officer profile fetch successful');
      console.log(`👤 Officer: ${officerProfile.data.name} (${officerProfile.data.role})`);
    } else {
      console.log('❌ Officer profile fetch failed:', officerProfile.data);
    }
  }
}

async function runAllTests() {
  console.log('🚀 Starting comprehensive functionality test...');
  console.log(`🌐 Testing against: ${RENDER_URL}`);
  
  try {
    await testRegistration();
    await testLogin();
    await testJobPosting();
    await testJobFetching();
    await testUserProfile();
    
    console.log('\n✅ All tests completed!');
    console.log('\n📋 Summary:');
    console.log(`- Student Token: ${authTokens.student ? '✅ Available' : '❌ Not available'}`);
    console.log(`- Officer Token: ${authTokens.officer ? '✅ Available' : '❌ Not available'}`);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the tests
runAllTests(); 