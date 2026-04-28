import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    // Sử dụng process.env thay vì hàm env() để tránh crash khi thiếu biến môi trường trên CI
    url: process.env.DATABASE_URL || "postgresql://placeholder:5432/placeholder",
  },
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
});
