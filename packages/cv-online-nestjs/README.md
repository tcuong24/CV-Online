# ⚙️ CV-Online Backend (NestJS)

Đây là REST API Backend cho dự án **CV-Online**. Hệ thống chịu trách nhiệm quản lý dữ liệu người dùng, lưu trữ trạng thái CV, và xử lý các tác vụ phức tạp như xuất file PDF chất lượng cao.

## 🌟 Tính năng chính

- **RESTful API**: Cung cấp các endpoint cho quản lý User, CV, và Style template.
- **Server-Side PDF Export**: Tích hợp `Puppeteer` để generate CV trực tiếp từ HTML/CSS state, đảm bảo tỷ lệ chuẩn A4 và giữ vector typography sắc nét.
- **Database & ORM**: Sử dụng PostgreSQL kết hợp cùng Prisma ORM để quản lý dữ liệu an toàn, hiệu quả.
- **Authentication**: JWT-based Authentication bảo mật các API route.
- **Modular Architecture**: Tuân thủ chuẩn cấu trúc module của NestJS (Controllers, Services, Modules).

## 🛠 Tech Stack

- **Framework**: [NestJS](https://nestjs.com/)
- **Cơ sở dữ liệu**: PostgreSQL
- **ORM**: [Prisma](https://www.prisma.io/)
- **PDF Generation**: [Puppeteer](https://pptr.dev/)
- **Ngôn ngữ**: TypeScript

## 🚀 Hướng dẫn chạy (Local)

1. **Cấu hình môi trường (`.env`)**:
   Bạn cần tạo file `.env` với các cấu hình tương tự như sau:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/cv_online?schema=public"
   JWT_SECRET="your-super-secret-key"
   PORT=3001
   ```

2. **Cài đặt & Migrate Database**:
   ```bash
   pnpm install
   pnpm prisma generate
   pnpm prisma db push # Hoặc pnpm prisma migrate dev
   ```

3. **Chạy Server NestJS**:
   ```bash
   pnpm run start:dev
   ```

Backend sẽ chạy tại: `http://localhost:3001` (hoặc PORT bạn đã cấu hình).

## 📂 Các module chính (`src/`)

- `auth/`: Xử lý đăng nhập, cấp và kiểm tra JWT token.
- `users/`: Xử lý dữ liệu người dùng cá nhân.
- `cv/` & `cv-sections/`: Quản lý logic lưu, đọc và cập nhật schema dự án CV.
- `export/`: Xử lý Puppeteer headless browser để export CV thành định dạng PDF.
