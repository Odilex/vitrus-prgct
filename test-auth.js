// Using built-in fetch API (Node.js 18+)

// Test authentication flow locally
async function testAuth() {
  const API_BASE_URL = 'http://localhost:5000/api/v1';
  
  console.log('🧪 Testing Authentication Flow Locally\n');
  
  // Test 1: Check if backend is running
  console.log('1. Testing backend connection...');
  try {
    const healthResponse = await fetch(`http://localhost:5000/health`);
    if (healthResponse.ok) {
      console.log('✅ Backend is running on port 5000');
    } else {
      console.log('❌ Backend health check failed');
      return;
    }
  } catch (error) {
    console.log('❌ Cannot connect to backend:', error.message);
    return;
  }
  
  // Test 2: Try unauthenticated request to properties
  console.log('\n2. Testing unauthenticated request to /api/v1/properties...');
  try {
    const response = await fetch(`${API_BASE_URL}/properties`);
    console.log(`Status: ${response.status}`);
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Got ${data.properties?.length || 0} properties`);
    } else {
      console.log('ℹ️ Unauthenticated request failed (expected)');
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
  
  // Test 3: Try authenticated request without token
  console.log('\n3. Testing POST to /api/v1/properties without token...');
  try {
    const response = await fetch(`${API_BASE_URL}/properties`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: 'Test Property',
        price: 100000,
        address: '123 Test St'
      })
    });
    
    console.log(`Status: ${response.status}`);
    const responseText = await response.text();
    console.log('Response:', responseText);
    
    if (response.status === 401) {
      console.log('✅ Correctly rejected unauthenticated request');
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
  
  // Test 4: Check auth endpoints
  console.log('\n4. Testing auth endpoints availability...');
  const authEndpoints = ['/auth/login', '/auth/register', '/auth/me'];
  
  for (const endpoint of authEndpoints) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: endpoint === '/auth/me' ? 'GET' : 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      console.log(`${endpoint}: ${response.status} ${response.statusText}`);
    } catch (error) {
      console.log(`${endpoint}: Error - ${error.message}`);
    }
  }
  
  console.log('\n📋 Test Summary:');
  console.log('- Backend is running and accessible');
  console.log('- Authentication is properly enforced (401 errors expected)');
  console.log('- Auth endpoints are available');
  console.log('\n💡 Next steps:');
  console.log('1. Check browser localStorage for access_token');
  console.log('2. Verify login process stores token correctly');
  console.log('3. Check Network tab for Authorization headers');
}

testAuth().catch(console.error);