import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with development data...');

  // Create admin user
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    throw new Error('ADMIN_PASSWORD must be provided via environment variables for seeding.');
  }
  const hashedPassword = await hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@studio.com' },
    update: {},
    create: {
      email: 'admin@studio.com',
      name: 'Studio Admin',
      password: hashedPassword
    }
  });

  console.log('✅ Admin user created:', admin.email);

  // Create sample freelancers
  const freelancers = [
    {
      id: 'f-001',
      name: 'Sarah Johnson',
      email: 'sarah@designstudio.com',
      role: 'Senior Graphic Designer',
      rate: 75,
      status: 'ACTIVE',
      bio: '8+ years in branding and visual identity. Specializes in minimalist design approach.',
      location: 'America/New_York',
      availability: 'High'
    },
    {
      id: 'f-002',
      name: 'Marcus Chen',
      email: 'marcus@techsolutions.com',
      role: 'Full Stack Developer',
      rate: 95,
      status: 'ACTIVE',
      bio: 'MERN stack expert with 6 years enterprise experience.',
      location: 'Asia/Tokyo',
      availability: 'High'
    },
    {
      id: 'f-003',
      name: 'Elena Rodriguez',
      email: 'elena@postproduction.com',
      role: 'Video Editor',
      rate: 65,
      status: 'ACTIVE',
      bio: 'Award-winning editor specializing in commercials and documentaries.',
      location: 'America/Los_Angeles',
      availability: 'Medium'
    },
    {
      id: 'f-004',
      name: 'David Thompson',
      email: 'david@wordsandwich.com',
      role: 'Copywriter',
      rate: 60,
      status: 'ACTIVE',
      bio: 'Former journalist turned copywriter. 5 years crafting compelling narratives.',
      location: 'Europe/London',
      availability: 'Medium'
    },
    {
      id: 'f-005',
      name: 'Alex Moreno',
      email: 'alex@socialboost.com',
      role: 'Social Media Manager',
      rate: 50,
      status: 'ACTIVE',
      bio: 'Social media expert helping brands grow their online presence.',
      location: 'America/Mexico_City',
      availability: 'High'
    }
  ];

  for (const freelancer of freelancers) {
    await prisma.freelancer.upsert({
      where: { id: freelancer.id },
      update: {},
      create: freelancer
    });
  }

  console.log('✅ Created 5 freelancers');

  // Create sample projects
  const projects = [
    {
      id: 'p-001',
      title: 'TechCorp Rebrand',
      description: 'Complete brand refresh including logo, website, and marketing materials.',
      status: 'IN_PROGRESS',
      startDate: new Date('2025-01-15'),
      endDate: new Date('2025-03-30'),
      budget: 35000,
      client: 'TechCorp Inc.'
    },
    {
      id: 'p-002',
      title: 'AutoMax Campaign Video',
      description: '30-second and 60-second commercial spots for new car models.',
      status: 'PLANNED',
      startDate: new Date('2025-02-01'),
      endDate: new Date('2025-02-28'),
      budget: 18000,
      client: 'AutoMax Dealership'
    },
    {
      id: 'p-003',
      title: 'EcoBrands Website',
      description: 'E-commerce website for sustainable products with blog and social integration.',
      status: 'COMPLETED',
      startDate: new Date('2024-11-01'),
      endDate: new Date('2025-01-15'),
      budget: 25000,
      client: 'EcoBrands Co.'
    },
    {
      id: 'p-004',
      title: 'Foodie Influencer Campaign',
      description: 'Social media content series featuring food products with influencer partnerships.',
      status: 'IN_PROGRESS',
      startDate: new Date('2025-01-10'),
      endDate: new Date('2025-04-10'),
      budget: 12000,
      client: 'Culinary Delights'
    }
  ];

  for (const project of projects) {
    await prisma.project.upsert({
      where: { id: project.id },
      update: {},
      create: project
    });
  }

  console.log('✅ Created 4 projects');

  // Create sample assignments
  const assignments = [
    {
      id: 'asn-001',
      projectId: 'p-001',
      freelancerId: 'f-001',
      role: 'Lead Designer',
      startDate: new Date('2025-01-15'),
      endDate: new Date('2025-02-15'),
      allocation: 100,
      status: 'confirmed'
    },
    {
      id: 'asn-002',
      projectId: 'p-001',
      freelancerId: 'f-002',
      role: 'Frontend Developer',
      startDate: new Date('2025-02-01'),
      endDate: new Date('2025-03-15'),
      allocation: 80,
      status: 'confirmed'
    },
    {
      id: 'asn-003',
      projectId: 'p-002',
      freelancerId: 'f-003',
      role: 'Video Editor',
      startDate: new Date('2025-02-01'),
      endDate: new Date('2025-02-20'),
      allocation: 100,
      status: 'confirmed'
    },
    {
      id: 'asn-004',
      projectId: 'p-003',
      freelancerId: 'f-002',
      role: 'Full Stack Developer',
      startDate: new Date('2024-11-01'),
      endDate: new Date('2025-01-10'),
      allocation: 90,
      status: 'completed'
    },
    {
      id: 'asn-005',
      projectId: 'p-004',
      freelancerId: 'f-005',
      role: 'Content Creator',
      startDate: new Date('2025-01-10'),
      endDate: new Date('2025-03-01'),
      allocation: 70,
      status: 'confirmed'
    },
    {
      id: 'asn-006',
      projectId: 'p-004',
      freelancerId: 'f-004',
      role: 'Copywriter',
      startDate: new Date('2025-01-15'),
      endDate: new Date('2025-02-15'),
      allocation: 60,
      status: 'confirmed'
    }
  ];

  for (const assignment of assignments) {
    await prisma.assignment.upsert({
      where: { id: assignment.id },
      update: {},
      create: assignment
    });
  }

  console.log('✅ Created 6 assignments');

  console.log('🎉 Database seeding completed successfully!');
  console.log('📊 Summary:');
  console.log('   - 1 Admin user');
  console.log('   - 5 Freelancers');
  console.log('   - 4 Projects');
  console.log('   - 6 Assignments');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
