import axios from 'axios';

const API_BASE = 'http://localhost:5000';

// Test data
let tokens = {};
let userIds = {};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const log = (color, message) => console.log(`${color}${message}${colors.reset}`);

async function test(name, fn) {
  try {
    log(colors.cyan, `\n🧪 Testing: ${name}`);
    await fn();
    log(colors.green, `✅ ${name} passed`);
  } catch (error) {
    log(colors.red, `❌ ${name} failed`);
    log(colors.red, `Error: ${error.message}`);
    if (error.response?.data) {
      log(colors.red, `Response: ${JSON.stringify(error.response.data, null, 2)}`);
    }
  }
}

async function runTests() {
  log(colors.blue, '🚀 Starting API Tests...\n');

  // Test 1: Health Check
  await test('Health Check', async () => {
    const res = await axios.get(`${API_BASE}/health`);
    console.log('Response:', JSON.stringify(res.data, null, 2));
    if (res.data.status !== 'OK') throw new Error('Health check failed');
  });

  // Test 2: Signin Admin
  await test('Admin Signin', async () => {
    const res = await axios.post(`${API_BASE}/api/auth/signin`, {
      email: 'admin@dayflow.com',
      password: 'Admin123'
    });
    console.log('Response:', JSON.stringify(res.data, null, 2));
    if (!res.data.data?.token) throw new Error('No token in response');
    tokens.admin = res.data.data.token;
    userIds.admin = res.data.data.user.id;
    log(colors.yellow, `Admin Token: ${tokens.admin.substring(0, 20)}...`);
  });

  // Test 3: Signin Employee
  await test('Employee Signin', async () => {
    const res = await axios.post(`${API_BASE}/api/auth/signin`, {
      email: 'employee1@dayflow.com',
      password: 'Employee@123456'
    });
    console.log('Response:', JSON.stringify(res.data, null, 2));
    if (!res.data.data?.token) throw new Error('No token in response');
    tokens.employee = res.data.data.token;
    userIds.employee = res.data.data.user.id;
    log(colors.yellow, `Employee Token: ${tokens.employee.substring(0, 20)}...`);
  });

  // Test 4: Get /me endpoint
  await test('GET /api/auth/me', async () => {
    const res = await axios.get(`${API_BASE}/api/auth/me`, {
      headers: { Authorization: `Bearer ${tokens.admin}` }
    });
    console.log('Response:', JSON.stringify(res.data, null, 2));
    if (!res.data.data?.id) throw new Error('No user data in response');
  });

  // Test 5: Admin Stats
  await test('GET /api/admin/stats', async () => {
    const res = await axios.get(`${API_BASE}/api/admin/stats`, {
      headers: { Authorization: `Bearer ${tokens.admin}` }
    });
    console.log('Response:', JSON.stringify(res.data, null, 2));
    if (typeof res.data.data?.employees !== 'number') throw new Error('Invalid stats format');
  });

  // Test 6: Admin List Employees
  await test('GET /api/admin/employees', async () => {
    const res = await axios.get(`${API_BASE}/api/admin/employees`, {
      headers: { Authorization: `Bearer ${tokens.admin}` }
    });
    console.log(`Response: ${res.data.data.length} employees`);
    if (!Array.isArray(res.data.data)) throw new Error('Not an array');
  });

  // Test 7: Get Profile
  await test('GET /api/profile', async () => {
    const res = await axios.get(`${API_BASE}/api/profile`, {
      headers: { Authorization: `Bearer ${tokens.employee}` }
    });
    console.log('Response:', JSON.stringify(res.data, null, 2));
    if (!res.data.data?.salary) throw new Error('No salary data in response');
  });

  // Test 8: Check-in
  await test('POST /api/attendance/check-in', async () => {
    const res = await axios.post(`${API_BASE}/api/attendance/check-in`, {}, {
      headers: { Authorization: `Bearer ${tokens.employee}` }
    });
    console.log('Response:', JSON.stringify(res.data, null, 2));
    if (res.data.data?.status !== 'PRESENT') throw new Error('Invalid check-in response');
  });

  // Test 9: Create Leave
  await test('POST /api/leaves', async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const endDate = new Date(tomorrow);
    endDate.setDate(endDate.getDate() + 4);

    const res = await axios.post(`${API_BASE}/api/leaves`, {
      type: 'PAID',
      startDate: tomorrow.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      reason: 'Test leave request'
    }, {
      headers: { Authorization: `Bearer ${tokens.employee}` }
    });
    console.log('Response:', JSON.stringify(res.data, null, 2));
    if (res.data.data?.status !== 'PENDING') throw new Error('Invalid leave response');
  });

  // Test 10: Admin Impersonate Employee
  await test('POST /api/admin/employees/:id/switch (Impersonate)', async () => {
    const res = await axios.post(
      `${API_BASE}/api/admin/employees/${userIds.employee}/switch`,
      {},
      {
        headers: { Authorization: `Bearer ${tokens.admin}` }
      }
    );
    console.log('Response:', JSON.stringify(res.data, null, 2));
    if (!res.data.data?.token) throw new Error('No impersonate token in response');
  });

  log(colors.blue, '\n✅ All tests completed!\n');
}

// Run tests
runTests().catch(error => {
  log(colors.red, `Fatal error: ${error.message}`);
  process.exit(1);
});
