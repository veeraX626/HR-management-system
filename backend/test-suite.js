#!/usr/bin/env node

/**
 * 🧪 COMPREHENSIVE TEST - Dayflow HRMS Backend Refactor
 * Tests complete workflow per mentor spec:
 * 1. Admin login (HR001)
 * 2. Admin creates new employee
 * 3. New employee login
 * 4. Employee accesses self profile (/api/me)
 * 5. Employee cannot access admin endpoints
 */

import axios from 'axios';
import chalk from 'chalk';

const BASE_URL = 'http://localhost:5000';
let adminToken = null;
let employeeToken = null;

console.log(chalk.bold.cyan('\n🧪 DAYFLOW HRMS BACKEND TEST SUITE\n'));
console.log(chalk.gray('Testing complete workflow per mentor spec...\n'));

// Helper function for API calls
const api = axios.create({
  baseURL: BASE_URL,
  validateStatus: () => true // Don't throw on any status
});

// ==================== TEST 1: Health Check ====================
async function testHealth() {
  console.log(chalk.bold.blue('📋 TEST 1: Health Check'));
  
  try {
    const response = await api.get('/health');
    
    if (response.status === 200 && response.data.database === 'Connected') {
      console.log(chalk.green('✅ PASS: Health check successful'));
      console.log(chalk.gray(`   Database: ${response.data.database}`));
      console.log(chalk.gray(`   Uptime: ${response.data.uptime.toFixed(2)}s\n`));
      return true;
    } else {
      console.log(chalk.red(`❌ FAIL: Health check failed (Status: ${response.status})`));
      console.log(chalk.gray(`   Response: ${JSON.stringify(response.data)}\n`));
      return false;
    }
  } catch (error) {
    console.log(chalk.red(`❌ FAIL: ${error.message}\n`));
    return false;
  }
}

// ==================== TEST 2: Admin Login ====================
async function testAdminLogin() {
  console.log(chalk.bold.blue('🔐 TEST 2: Admin Login (HR001)'));
  
  try {
    const response = await api.post('/api/auth/signin', {
      email: 'admin@dayflow.com',
      password: 'Admin123'
    });
    
    if (response.status === 200 && response.data.token && response.data.user.role === 'ADMIN') {
      adminToken = response.data.token;
      console.log(chalk.green('✅ PASS: Admin login successful'));
      console.log(chalk.gray(`   Email: ${response.data.user.email}`));
      console.log(chalk.gray(`   EmployeeId: ${response.data.user.employeeId}`));
      console.log(chalk.gray(`   Role: ${response.data.user.role}`));
      console.log(chalk.gray(`   Token: ${adminToken.substring(0, 20)}...\n`));
      return true;
    } else {
      console.log(chalk.red(`❌ FAIL: Admin login failed (Status: ${response.status})`));
      console.log(chalk.gray(`   Response: ${JSON.stringify(response.data)}\n`));
      return false;
    }
  } catch (error) {
    console.log(chalk.red(`❌ FAIL: ${error.message}\n`));
    return false;
  }
}

// ==================== TEST 3: Create New Employee ====================
async function testCreateEmployee() {
  console.log(chalk.bold.blue('👤 TEST 3: Admin Creates New Employee'));
  
  if (!adminToken) {
    console.log(chalk.red('❌ FAIL: No admin token available\n'));
    return false;
  }
  
  try {
    const response = await api.post(
      '/api/admin/employees',
      {
        employeeId: 'E004',
        email: 'testemployee@dayflow.com',
        password: 'TestEmp@123456',
        firstName: 'Test',
        lastName: 'Employee',
        phone: '+1-555-0104',
        gender: 'Male'
      },
      {
        headers: {
          Authorization: `Bearer ${adminToken}`
        }
      }
    );
    
    if (response.status === 201 && response.data.data.employeeId === 'E004') {
      console.log(chalk.green('✅ PASS: Employee created successfully'));
      console.log(chalk.gray(`   EmployeeId: ${response.data.data.employeeId}`));
      console.log(chalk.gray(`   Email: ${response.data.data.email}`));
      console.log(chalk.gray(`   Role: ${response.data.data.role}\n`));
      return true;
    } else {
      console.log(chalk.red(`❌ FAIL: Failed to create employee (Status: ${response.status})`));
      console.log(chalk.gray(`   Response: ${JSON.stringify(response.data)}\n`));
      return false;
    }
  } catch (error) {
    console.log(chalk.red(`❌ FAIL: ${error.message}\n`));
    return false;
  }
}

// ==================== TEST 4: Existing Employee Login ====================
async function testEmployeeLogin() {
  console.log(chalk.bold.blue('🔐 TEST 4: Employee Login (E001)'));
  
  try {
    const response = await api.post('/api/auth/signin', {
      email: 'employee1@dayflow.com',
      password: 'Employee@123456'
    });
    
    if (response.status === 200 && response.data.token && response.data.user.role === 'EMPLOYEE') {
      employeeToken = response.data.token;
      console.log(chalk.green('✅ PASS: Employee login successful'));
      console.log(chalk.gray(`   Email: ${response.data.user.email}`));
      console.log(chalk.gray(`   EmployeeId: ${response.data.user.employeeId}`));
      console.log(chalk.gray(`   Role: ${response.data.user.role}`));
      console.log(chalk.gray(`   Token: ${employeeToken.substring(0, 20)}...\n`));
      return true;
    } else {
      console.log(chalk.red(`❌ FAIL: Employee login failed (Status: ${response.status})`));
      console.log(chalk.gray(`   Response: ${JSON.stringify(response.data)}\n`));
      return false;
    }
  } catch (error) {
    console.log(chalk.red(`❌ FAIL: ${error.message}\n`));
    return false;
  }
}

// ==================== TEST 5: Get Self Profile (/api/me) ====================
async function testGetSelfProfile() {
  console.log(chalk.bold.blue('📄 TEST 5: Employee Gets Self Profile (/api/me)'));
  
  if (!employeeToken) {
    console.log(chalk.red('❌ FAIL: No employee token available\n'));
    return false;
  }
  
  try {
    const response = await api.get('/api/me', {
      headers: {
        Authorization: `Bearer ${employeeToken}`
      }
    });
    
    if (response.status === 200 && response.data.data.email === 'employee1@dayflow.com') {
      console.log(chalk.green('✅ PASS: Self profile retrieved successfully'));
      console.log(chalk.gray(`   Email: ${response.data.data.email}`));
      console.log(chalk.gray(`   EmployeeId: ${response.data.data.employeeId}`));
      console.log(chalk.gray(`   Profile: ${response.data.data.profile.firstName} ${response.data.data.profile.lastName}\n`));
      return true;
    } else {
      console.log(chalk.red(`❌ FAIL: Failed to get self profile (Status: ${response.status})`));
      console.log(chalk.gray(`   Response: ${JSON.stringify(response.data)}\n`));
      return false;
    }
  } catch (error) {
    console.log(chalk.red(`❌ FAIL: ${error.message}\n`));
    return false;
  }
}

// ==================== TEST 6: Employee Cannot Access Admin Endpoints ====================
async function testEmployeeCannotAccessAdmin() {
  console.log(chalk.bold.blue('🔒 TEST 6: Employee Cannot Access Admin Endpoints'));
  
  if (!employeeToken) {
    console.log(chalk.red('❌ FAIL: No employee token available\n'));
    return false;
  }
  
  try {
    const response = await api.get('/api/admin/employees', {
      headers: {
        Authorization: `Bearer ${employeeToken}`
      }
    });
    
    if (response.status === 403 && response.data.error.includes('Admin')) {
      console.log(chalk.green('✅ PASS: Employee correctly denied access to admin endpoint'));
      console.log(chalk.gray(`   Status: ${response.status}`));
      console.log(chalk.gray(`   Error: ${response.data.error}\n`));
      return true;
    } else {
      console.log(chalk.red(`❌ FAIL: Access control failed (Status: ${response.status})`));
      console.log(chalk.gray(`   Response: ${JSON.stringify(response.data)}\n`));
      return false;
    }
  } catch (error) {
    console.log(chalk.red(`❌ FAIL: ${error.message}\n`));
    return false;
  }
}

// ==================== TEST 7: List All Employees (Admin Only) ====================
async function testListEmployees() {
  console.log(chalk.bold.blue('📋 TEST 7: Admin Lists All Employees'));
  
  if (!adminToken) {
    console.log(chalk.red('❌ FAIL: No admin token available\n'));
    return false;
  }
  
  try {
    const response = await api.get('/api/admin/employees', {
      headers: {
        Authorization: `Bearer ${adminToken}`
      }
    });
    
    if (response.status === 200 && Array.isArray(response.data.data)) {
      console.log(chalk.green('✅ PASS: Employees list retrieved successfully'));
      console.log(chalk.gray(`   Total Employees: ${response.data.data.length}`));
      response.data.data.forEach((emp, idx) => {
        console.log(chalk.gray(`   ${idx + 1}. ${emp.email} (${emp.employeeId}) - ${emp.role}`));
      });
      console.log();
      return true;
    } else {
      console.log(chalk.red(`❌ FAIL: Failed to list employees (Status: ${response.status})`));
      console.log(chalk.gray(`   Response: ${JSON.stringify(response.data)}\n`));
      return false;
    }
  } catch (error) {
    console.log(chalk.red(`❌ FAIL: ${error.message}\n`));
    return false;
  }
}

// ==================== TEST 8: Invalid Credentials ====================
async function testInvalidCredentials() {
  console.log(chalk.bold.blue('🚫 TEST 8: Invalid Login Credentials'));
  
  try {
    const response = await api.post('/api/auth/signin', {
      email: 'admin@dayflow.com',
      password: 'WrongPassword123'
    });
    
    if (response.status === 401 && response.data.error.includes('Invalid')) {
      console.log(chalk.green('✅ PASS: Invalid credentials correctly rejected'));
      console.log(chalk.gray(`   Status: ${response.status}`));
      console.log(chalk.gray(`   Error: ${response.data.error}\n`));
      return true;
    } else {
      console.log(chalk.red(`❌ FAIL: Invalid credentials not properly rejected (Status: ${response.status})`));
      console.log(chalk.gray(`   Response: ${JSON.stringify(response.data)}\n`));
      return false;
    }
  } catch (error) {
    console.log(chalk.red(`❌ FAIL: ${error.message}\n`));
    return false;
  }
}

// ==================== Main Test Runner ====================
async function runAllTests() {
  const results = [];
  
  results.push(await testHealth());
  results.push(await testAdminLogin());
  results.push(await testCreateEmployee());
  results.push(await testEmployeeLogin());
  results.push(await testGetSelfProfile());
  results.push(await testEmployeeCannotAccessAdmin());
  results.push(await testListEmployees());
  results.push(await testInvalidCredentials());
  
  // Print summary
  const passed = results.filter(r => r).length;
  const total = results.length;
  const percentage = Math.round((passed / total) * 100);
  
  console.log(chalk.bold.cyan('━'.repeat(60)));
  console.log(chalk.bold.cyan('📊 TEST SUMMARY'));
  console.log(chalk.bold.cyan('━'.repeat(60)));
  console.log(chalk.gray(`Total Tests: ${total}`));
  console.log(chalk.green(`Passed: ${passed}`));
  console.log(chalk.red(`Failed: ${total - passed}`));
  console.log(chalk.bold(percentage === 100 ? chalk.green(`Success Rate: ${percentage}%`) : chalk.yellow(`Success Rate: ${percentage}%`)));
  console.log(chalk.bold.cyan('━'.repeat(60) + '\n'));
  
  if (percentage === 100) {
    console.log(chalk.bold.green('🎉 ALL TESTS PASSED! Backend refactor is complete.\n'));
  } else {
    console.log(chalk.bold.yellow('⚠️  Some tests failed. Review output above.\n'));
  }
  
  process.exit(percentage === 100 ? 0 : 1);
}

// Run tests
runAllTests().catch(error => {
  console.error(chalk.red('Fatal error:', error));
  process.exit(1);
});
