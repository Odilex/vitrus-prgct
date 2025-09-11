// Using built-in fetch API (Node.js 18+)

async function createTestUser() {
  console.log('🔧 Creating test user for authentication testing...');
  
  const API_BASE_URL = 'http://localhost:5000/api/v1';
  
  const testUser = {
    email: 'test@vitrus.com',
    password: 'TestPass123!',
    full_name: 'Test User',
    phone: '1234567890',
    role: 'client'
  };
  
  try {
    console.log('📝 Registering test user...');
    
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testUser)
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Test user created successfully!');
      console.log('📧 Email:', testUser.email);
      console.log('🔑 Password:', testUser.password);
      console.log('🆔 User ID:', data.user.id);
      console.log('🎫 Access Token:', data.tokens.access_token.substring(0, 20) + '...');
      
      console.log('\n🧪 You can now use these credentials in the debug tool:');
      console.log(`   Email: ${testUser.email}`);
      console.log(`   Password: ${testUser.password}`);
      
    } else {
      if (response.status === 409) {
        console.log('ℹ️  Test user already exists. You can use these credentials:');
        console.log(`   Email: ${testUser.email}`);
        console.log(`   Password: ${testUser.password}`);
      } else {
        console.log('❌ Failed to create test user:', data.message);
        console.log('Response:', JSON.stringify(data, null, 2));
      }
    }
    
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }
}

createTestUser();