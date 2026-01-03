import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🌱 Seeding database...');

    // Clear existing data
    await prisma.leave.deleteMany({});
    await prisma.attendance.deleteMany({});
    await prisma.profile.deleteMany({});
    await prisma.user.deleteMany({});

    // Hash passwords
    const adminPassword = await bcryptjs.hash('Admin@123456', 12);
    const employeePassword = await bcryptjs.hash('Employee@123456', 12);

    // Create Admin User
    const admin = await prisma.user.create({
      data: {
        employeeId: 'ADMIN001',
        email: 'admin@dayflow-hrms.com',
        password: adminPassword,
        role: 'ADMIN',
        isVerified: true,
        profile: {
          create: {
            firstName: 'John',
            lastName: 'Administrator',
            phone: '+1-555-0100',
            gender: 'Male',
            department: 'Administration',
            position: 'System Administrator',
            joiningDate: new Date('2023-01-15'),
            salary: {
              baseSalary: 120000,
              dearness: 5000,
              allowances: 10000,
              deductions: 5000
            }
          }
        }
      }
    });

    console.log('✅ Admin created:', admin.email);

    // Create Employee 1
    const employee1 = await prisma.user.create({
      data: {
        employeeId: 'EMP001',
        email: 'employee1@dayflow-hrms.com',
        password: employeePassword,
        role: 'EMPLOYEE',
        isVerified: true,
        profile: {
          create: {
            firstName: 'Jane',
            lastName: 'Developer',
            phone: '+1-555-0101',
            dateOfBirth: new Date('1995-05-20'),
            gender: 'Female',
            address: '123 Main Street',
            city: 'San Francisco',
            state: 'CA',
            zipCode: '94102',
            department: 'Engineering',
            position: 'Senior Developer',
            joiningDate: new Date('2022-03-10'),
            reportingTo: admin.id,
            salary: {
              baseSalary: 100000,
              dearness: 4000,
              allowances: 8000,
              deductions: 3000
            }
          }
        }
      }
    });

    console.log('✅ Employee 1 created:', employee1.email);

    // Create Employee 2
    const employee2 = await prisma.user.create({
      data: {
        employeeId: 'EMP002',
        email: 'employee2@dayflow-hrms.com',
        password: employeePassword,
        role: 'EMPLOYEE',
        isVerified: true,
        profile: {
          create: {
            firstName: 'Michael',
            lastName: 'Designer',
            phone: '+1-555-0102',
            dateOfBirth: new Date('1998-08-15'),
            gender: 'Male',
            address: '456 Oak Avenue',
            city: 'San Francisco',
            state: 'CA',
            zipCode: '94103',
            department: 'Design',
            position: 'UI/UX Designer',
            joiningDate: new Date('2023-01-20'),
            reportingTo: admin.id,
            salary: {
              baseSalary: 85000,
              dearness: 3500,
              allowances: 7000,
              deductions: 2500
            }
          }
        }
      }
    });

    console.log('✅ Employee 2 created:', employee2.email);

    // Create sample attendance records
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    await prisma.attendance.createMany({
      data: [
        {
          userId: employee1.id,
          date: today,
          checkInTime: new Date(today.setHours(9, 0, 0)),
          status: 'PRESENT'
        },
        {
          userId: employee1.id,
          date: yesterday,
          checkInTime: new Date(yesterday.setHours(9, 15, 0)),
          checkOutTime: new Date(yesterday.setHours(18, 30, 0)),
          status: 'PRESENT'
        },
        {
          userId: employee2.id,
          date: yesterday,
          status: 'ABSENT'
        }
      ]
    });

    console.log('✅ Attendance records created');

    // Create sample leave requests
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 10);
    const endDate = new Date(futureDate);
    endDate.setDate(endDate.getDate() + 4);

    await prisma.leave.create({
      data: {
        userId: employee1.id,
        type: 'PAID',
        startDate: futureDate,
        endDate: endDate,
        remarks: 'Vacation planning',
        status: 'PENDING'
      }
    });

    console.log('✅ Leave request created');

    console.log('\n✅ Database seeding completed successfully!');
    console.log('\n📝 Login Credentials:');
    console.log('Admin:');
    console.log('  Email: admin@dayflow-hrms.com');
    console.log('  Password: Admin@123456');
    console.log('\nEmployee 1:');
    console.log('  Email: employee1@dayflow-hrms.com');
    console.log('  Password: Employee@123456');
    console.log('\nEmployee 2:');
    console.log('  Email: employee2@dayflow-hrms.com');
    console.log('  Password: Employee@123456');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
