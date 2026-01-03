#!/usr/bin/env node

/**
 * Quick API Test Script for Dayflow HRMS Backend
 * Run from backend directory: node test-api.js
 */

const http = require('http');

const BASE_URL = 'http://localhost:5000';

function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + path);
    const options = {
      hostname: url.hostname,
      port: url.port || 80,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runTests() {
  console.log('\n📋 Dayflow HRMS Backend API Tests\n');
  console.log('═══════════════════════════════════════════\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣  Testing Health Check...');
    const health = await makeRequest('GET', '/health');
    console.log(`   Status: ${health.status}`);
    console.log(`   Response:`, health.data);
    console.log();

    // Test 2: Valid Login
    console.log('2️⃣  Testing Valid Login...');
    const validLogin = await makeRequest('POST', '/api/auth/signin', {
      email: 'admin@dayflow-hrms.com',
      password: 'Admin@123456'
    });
    console.log(`   Status: ${validLogin.status}`);
    console.log(`   Success: ${validLogin.data.success}`);
    console.log(`   Token: ${validLogin.data.token ? '✅ Received' : '❌ Missing'}`);
    console.log();

    // Test 3: Invalid Password
    console.log('3️⃣  Testing Invalid Password...');
    const invalidPassword = await makeRequest('POST', '/api/auth/signin', {
      email: 'admin@dayflow-hrms.com',
      password: 'WrongPassword'
    });
    console.log(`   Status: ${invalidPassword.status}`);
    console.log(`   Error: ${invalidPassword.data.error}`);
    console.log();

    // Test 4: Invalid Email
    console.log('4️⃣  Testing Invalid Email...');
    const invalidEmail = await makeRequest('POST', '/api/auth/signin', {
      email: 'wrong@email.com',
      password: 'Admin@123456'
    });
    console.log(`   Status: ${invalidEmail.status}`);
    console.log(`   Error: ${invalidEmail.data.error}`);
    console.log();

    // Test 5: Missing Credentials
    console.log('5️⃣  Testing Missing Credentials...');
    const missingCreds = await makeRequest('POST', '/api/auth/signin', {
      email: 'admin@dayflow-hrms.com'
    });
    console.log(`   Status: ${missingCreds.status}`);
    console.log(`   Message: ${missingCreds.data.message}`);
    console.log();

    console.log('═══════════════════════════════════════════');
    console.log('✅ All tests completed!\n');

  } catch (error) {
    console.error('❌ Test Error:', error.message);
    console.error('\nMake sure backend is running on http://localhost:5000');
  }
}

runTests();
