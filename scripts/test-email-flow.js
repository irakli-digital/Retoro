const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testRegistration() {
  const timestamp = Date.now();
  const email = `test.user+${timestamp}@mail.retoro.app`; // Use the domain you configured
  const password = 'TestPassword123!';
  
  console.log(`[TEST] Attempting to register user: ${email}`);

  try {
    const response = await axios.post(`${BASE_URL}/api/auth/register`, {
      email,
      password,
      name: 'Test User'
    });

    console.log('[TEST] Registration Response Status:', response.status);
    console.log('[TEST] Registration Response Data:', JSON.stringify(response.data, null, 2));

    if (response.data.success) {
      console.log('✅ Registration successful!');
      if (response.data.verificationLink) {
        console.log('ℹ️ Verification Link (Dev Mode):', response.data.verificationLink);
      } else {
        console.log('ℹ️ Verification Link not returned (likely sent via Email/Mailgun). Check your inbox or Mailgun logs.');
      }
    } else {
      console.error('❌ Registration failed (API returned success: false)');
    }

  } catch (error) {
    if (error.response) {
      console.error('❌ API Error:', error.response.status, error.response.data);
    } else {
      console.error('❌ Network/Script Error:', error.message);
    }
  }
}

testRegistration();
