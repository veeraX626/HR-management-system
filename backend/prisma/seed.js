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

    // Hash passwords per mentor spec
    const adminPassword = await bcryptjs.hash('Admin123', 12); // HR001 admin
    const employeePassword = await bcryptjs.hash('Employee@123456', 12);

    // Create Admin User (HR001 - per mentor spec)
    const admin = await prisma.user.create({
      data: {
        employeeId: 'HR001',
        email: 'admin@dayflow.com', // Per mentor spec
        password: adminPassword,
        role: 'ADMIN',
        isVerified: true,
        profile: {
          create: {
            firstName: 'Admin',
            lastName: 'User',
            phone: '+1-555-0100',
            gender: 'Male',
            department: 'Administration',
            position: 'System Administrator'
          }
        }
      }
    });

    console.log('✅ Admin created:', admin.email, '(HR001)');

    // Create Employee 1 (E001 - per mentor spec)
    const employee1 = await prisma.user.create({
      data: {
        employeeId: 'E001',
        email: 'employee1@dayflow.com',
        password: employeePassword,
        role: 'EMPLOYEE',
        isVerified: true,
        profile: {
          create: {
            firstName: 'Jane',
            lastName: 'Developer',
            phone: '+1-555-0101',
            gender: 'Female',
            department: 'Engineering',
            position: 'Senior Developer'
          }
        }
      }
    });

    console.log('✅ Employee 1 created:', employee1.email, '(E001)');

    // Create Employee 2 (E002 - per mentor spec)
    const employee2 = await prisma.user.create({
      data: {
        employeeId: 'E002',
        email: 'employee2@dayflow.com',
        password: employeePassword,
        role: 'EMPLOYEE',
        isVerified: true,
        profile: {
          create: {
            firstName: 'Michael',
            lastName: 'Designer',
            phone: '+1-555-0102',
            gender: 'Male',
            department: 'Design',
            position: 'UI/UX Designer'
          }
        }
      }
    });

    console.log('✅ Employee 2 created:', employee2.email, '(E002)');

    // Create Employee 3 (E003 - per mentor spec)
    const employee3 = await prisma.user.create({
      data: {
        employeeId: 'E003',
        email: 'employee3@dayflow.com',
        password: employeePassword,
        role: 'EMPLOYEE',
        isVerified: true,
        profile: {
          create: {
            firstName: 'Sarah',
            lastName: 'Manager',
            phone: '+1-555-0103',
            gender: 'Female',
            department: 'Management',
            position: 'Project Manager'
          }
        }
      }
    });

    console.log('✅ Employee 3 created:', employee3.email, '(E003)');

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
    console.log('\n📝 Login Credentials (per mentor spec):');
    console.log('\n🔐 ADMIN (HR001):');
    console.log('  Email: admin@dayflow.com');
    console.log('  Password: Admin123');
    console.log('  EmployeeId: HR001');
    console.log('\n👤 Employee 1 (E001):');
    console.log('  Email: employee1@dayflow.com');
    console.log('  Password: Employee@123456');
    console.log('  EmployeeId: E001');
    console.log('\n👤 Employee 2 (E002):');
    console.log('  Email: employee2@dayflow.com');
    console.log('  Password: Employee@123456');
    console.log('  EmployeeId: E002');
    console.log('\n👤 Employee 3 (E003):');
    console.log('  Email: employee3@dayflow.com');
    console.log('  Password: Employee@123456');
    console.log('  EmployeeId: E003');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
