// Test script to monitor login attempts and backend logs
// This will help identify the 'failed_login_attempt' warnings

// Using built-in fetch API (Node.js 18+)

const API_BASE_URL = 'http://localhost:5000';

const testCredentials = {
  email: 'test@vitrus.com',
  password: 'TestPass123!'
};

async function testLogin() {
  console.log('🔍 Testing login to identify failed_login_attempt warnings...');
  console.log('📧 Using credentials:', testCredentials.email);
  
  try {
    console.log('\n📤 Sending login request...');
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testCredentials)
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Login successful!');
      console.log('📊 Response status:', response.status);
      console.log('🔑 Token received:', data.token ? 'Yes' : 'No');
      
      if (data.token) {
        console.log('🔍 Token preview:', data.token.substring(0, 20) + '...');
      }
    } else {
      console.log('❌ Login failed!');
      console.log('📊 Status:', response.status);
      console.log('💬 Message:', data.message || 'Unknown error');
    }
    
  } catch (error) {
    console.log('❌ Network error!');
    console.log('💬 Message:', error.message);
  }
}

// Test multiple login attempts to see if this triggers the warnings
async function testMultipleLogins() {
  console.log('\n🔄 Testing multiple login attempts...');
  
  for (let i = 1; i <= 3; i++) {
    console.log(`\n--- Attempt ${i} ---`);
    await testLogin();
    
    // Wait between attempts
    if (i < 3) {
      console.log('⏳ Waiting 2 seconds...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
}

// Test with wrong credentials to see if this causes the warnings
async function testWrongCredentials() {
  console.log('\n🚫 Testing with wrong credentials...');
  
  const wrongCredentials = {
    email: 'test@vitrus.com',
    password: 'WrongPassword123!'
  };
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(wrongCredentials)
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('⚠️ Unexpected success with wrong credentials!');
    } else {
      console.log('✅ Correctly rejected wrong credentials');
      console.log('📊 Status:', response.status);
      console.log('💬 Message:', data.message || 'Unknown error');
    }
    
  } catch (error) {
    console.log('❌ Network error with wrong credentials');
    console.log('💬 Message:', error.message);
  }
}

async function runTests() {
  console.log('🚀 Starting login monitoring tests...');
  console.log('👀 Watch the backend terminal for "failed_login_attempt" warnings\n');
  
  // Test 1: Normal login
  await testLogin();
  
  // Test 2: Wrong credentials (might trigger warnings)
  await testWrongCredentials();
  
  // Test 3: Multiple attempts
  await testMultipleLogins();
  
  console.log('\n✅ Tests completed. Check backend logs for any warnings.');
}

if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testLogin, testWrongCredentials, testMultipleLogins };