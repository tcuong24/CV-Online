
import 'dotenv/config';  
import { PrismaClient } from '../generated/prisma/client';  

import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL not set in .env');
}

const pool = new Pool({
  connectionString,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();  // ← quan trọng: đóng pool để tránh leak
  });

async function main() {
  console.log('🌱 Starting seed...');

  // Create users
  const user1 = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      email: 'john@example.com',
      fullName: 'John Doe',
      passwordHash: 'hashed_password_here',
      subscriptionType: 'free',
    },
  });

  console.log('✅ Created user:', user1.email);

  // Create Modern Blue Template
  const modernBlue = await prisma.template.upsert({
    where: { id: 'template-001' },
    update: {},
    create: {
      id: 'template-001',
      name: 'Modern Blue',
      description: 'A clean, modern template with blue accents',
      thumbnailUrl: '/templates/modern-blue-thumb.png',
      category: 'Modern',
      isPremium: false,
      isPublished: true,
      layoutType: 'sidebar-left',
      designConfig: {
        colors: {
          primary: '#2563eb',
          secondary: '#1e40af',
          accent: '#3b82f6',
          text: {
            heading: '#1e293b',
            body: '#334155',
            muted: '#64748b',
          },
          background: {
            page: '#ffffff',
            sidebar: '#1e40af',
            section: '#f8fafc',
          },
        },
        typography: {
          fonts: {
            heading: {
              family: 'Inter',
              weights: [600, 700],
              googleFont: true,
            },
            body: {
              family: 'Inter',
              weights: [400, 500],
              googleFont: true,
            },
          },
          sizes: {
            name: '32px',
            section_title: '20px',
            subsection: '16px',
            body: '14px',
            small: '12px',
          },
          lineHeights: {
            heading: 1.2,
            body: 1.6,
          },
        },
        spacing: {
          page: {
            margin: '20mm',
          },
          section: {
            marginBottom: '20px',
          },
          element: {
            gap: '12px',
          },
        },
        layout: {
          maxWidth: '210mm',
          columnRatio: '35:65',
        },
      },
      sectionsConfig: {
        available_sections: [
          {
            id: 'personalInfo',
            type: 'personalInfo',
            label: 'Personal Information',
            icon: 'user',
            is_required: true,
            is_visible_by_default: true,
            layout: { style: 'default' },
          },
          {
            id: 'experiences',
            type: 'experiences',
            label: 'Work Experience',
            icon: 'briefcase',
            is_required: false,
            is_visible_by_default: true,
            layout: {
              style: 'timeline',
              showDates: true,
              dateFormat: 'MMM YYYY',
            },
          },
          {
            id: 'education',
            type: 'education',
            label: 'Education',
            icon: 'graduation-cap',
            is_required: false,
            is_visible_by_default: true,
            layout: {
              style: 'timeline',
              showGPA: true,
            },
          },
          {
            id: 'skills',
            type: 'skills',
            label: 'Skills',
            icon: 'star',
            is_required: false,
            is_visible_by_default: true,
            layout: {
              style: 'grid',
              columns: 2,
              showProficiency: true,
              proficiencyStyle: 'bars',
            },
          },
        ],
        default_order: ['personalInfo', 'experiences', 'education', 'skills'],
        sidebar_sections: ['personalInfo', 'skills'],
        main_sections: ['experiences', 'education'],
      },
    },
  });

  console.log('✅ Created template:', modernBlue.name);

  // Create Minimal Template
  const minimal = await prisma.template.upsert({
    where: { id: 'template-002' },
    update: {},
    create: {
      id: 'template-002',
      name: 'Minimal Black & White',
      description: 'A minimalist template with clean typography',
      thumbnailUrl: '/templates/minimal-bw-thumb.png',
      category: 'Minimal',
      isPremium: false,
      isPublished: true,
      layoutType: 'single-column',
      designConfig: {
        colors: {
          primary: '#000000',
          secondary: '#333333',
          accent: '#666666',
          text: {
            heading: '#000000',
            body: '#333333',
            muted: '#666666',
          },
          background: {
            page: '#ffffff',
            section: '#fafafa',
          },
        },
        typography: {
          fonts: {
            heading: {
              family: 'Playfair Display',
              weights: [700],
              googleFont: true,
            },
            body: {
              family: 'Source Sans Pro',
              weights: [400, 600],
              googleFont: true,
            },
          },
          sizes: {
            name: '36px',
            section_title: '22px',
            subsection: '16px',
            body: '14px',
            small: '12px',
          },
          lineHeights: {
            heading: 1.3,
            body: 1.7,
          },
        },
        spacing: {
          page: {
            margin: '25mm',
          },
          section: {
            marginBottom: '25px',
          },
        },
        layout: {
          maxWidth: '210mm',
        },
      },
      sectionsConfig: {
        available_sections: [
          {
            id: 'personalInfo',
            type: 'personalInfo',
            label: 'Personal Information',
            is_required: true,
            is_visible_by_default: true,
            layout: { style: 'centered' },
          },
          {
            id: 'experiences',
            type: 'experiences',
            label: 'Experience',
            is_required: false,
            is_visible_by_default: true,
            layout: { style: 'simple' },
          },
        ],
        default_order: ['personalInfo', 'experiences', 'education', 'skills'],
      },
    },
  });

  console.log('✅ Created template:', minimal.name);

  console.log('🎉 Seed completed!');
}