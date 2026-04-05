# CV-Online
Listed directory CV-Online
Viewed package.json:1-32

Dưới đây là một bản mẫu **README.md** cho dự án CV-Online của bạn. Nó được biên soạn dựa trên cấu trúc monorepo (Next.js & NestJS) và các tính năng chính của ứng dụng. Bạn có thể sao chép và tinh chỉnh cho phù hợp.

```markdown
# 📄 CV-Online

CV-Online là một nền tảng xây dựng và thiết kế CV chuyên nghiệp, được phát triển trên kiến trúc Monorepo kết hợp giữa **Next.js** (Frontend) và **NestJS** (Backend). Ứng dụng cung cấp các công cụ trực quan để tạo, tùy chỉnh và xuất CV ra định dạng PDF chất lượng cao.

## 🚀 Tính năng nổi bật

- **Trình chỉnh sửa Pageless & Kéo thả (Drag & Drop):** Tùy chỉnh trực tiếp bằng giao diện liền mạch, cho phép kéo thả các template/cấu trúc để sắp xếp layout một cách linh hoạt không bị giới hạn bởi trang A4 thông thường.
- **Xuất PDF chất lượng cao (Server-Side PDF Export):** Sử dụng `Puppeteer` ở backend để render CV thành định dạng PDF theo chuẩn in ấn, giúp giữ nguyên độ sắc nét của font chữ (vector quality) và layout pixel-perfect.
- **Quản lý CV (Lưu trữ trực tuyến):** Lưu CV đang chỉnh sửa vào cơ sở dữ liệu và quản lý dễ dàng.
- **Xác thực người dùng:** Đăng nhập và đăng ký tải khoản mượt mà với `NextAuth`.
- **Tùy chỉnh thông minh:** Tự động đồng bộ thông tin cá nhân (Tên, Ảnh đại diện) của người dùng ngay khi lên khung CV. Đa dạng các template (Single Column Layout, Sidebar Layout, v.v.).

## 🛠 Tech Stack

- **Trình quản lý gói:** [pnpm](https://pnpm.io/)
- **Frontend (`packages/nextjs-frontend`):** [Next.js](https://nextjs.org/) (App Router), React, Zustand (Quản lý State), TailwindCSS.
- **Backend (`packages/cv-online-nestjs`):** [NestJS](https://nestjs.com/), TypeScript, Prisma ORM, Puppeteer (PDF Generation).
- **Cơ sở dữ liệu:** PostgreSQL (Thông qua Prisma).

## 📁 Cấu trúc thư mục (Monorepo)

```text
CV-Online/
├── packages/
│   ├── cv-online-nestjs/    # REST API Backend, Database Schema & Services
│   └── nextjs-frontend/     # Ứng dụng Web / Giao diện người dùng
├── package.json             # Root package.json (Quản lý các workspace script)
└── pnpm-workspace.yaml      # Cấu hình Pnpm Workspace
```

## ⚙️ Hướng dẫn cài đặt & Chạy ứng dụng

### 1. Yêu cầu hệ thống
- Node.js (>= 18.0.0)
- pnpm (>= 8.0.0)
- PostgreSQL (Đã cài đặt hoặc chạy qua Docker)

### 2. Cài đặt Dependencies
Từ thư mục gốc dự án (Repository Root), chạy:
```bash
pnpm install
```

### 3. Cấu hình biến môi trường
Thiết lập các biến môi trường cho cả hai package:
- Tạo file `.env` tại `packages/cv-online-nestjs/.env` (khai báo `DATABASE_URL`, JWT Secret, v.v.)
- Tạo file `.env.local` tại `packages/nextjs-frontend/.env.local` (khai báo NextAuth URL, API Endpoint, v.v.)

### 4. Khởi tạo Database (Prisma)
Migrate Database bằng script hỗ trợ sẵn ở thư mục gốc:
```bash
pnpm run prisma:generate
pnpm run prisma:migrate
```

### 5. Chạy môi trường Development (Local)
Dự án được cấu hình script chạy song song cả 2 môi trường.

**Chạy đồng thời cả Frontend và Backend:**
```bash
pnpm run dev
# Hoặc: pnpm run dev:all
```

**Chạy độc lập từng services nếu cần:**
```bash
pnpm run dev:backend   # Chạy riêng NestJS
pnpm run dev:frontend  # Chạy riêng Next.js
```

## 📦 Scripts hỗ trợ

- `pnpm run build` - Build production cho cả 2 dự án.
- `pnpm run start:backend` - Khởi chạy Backend.
- `pnpm run start:frontend` - Khởi chạy Frontend.
- `pnpm run lint` - Kiểm tra lỗi cú pháp (Lint) toàn kho lưu trữ.
- `pnpm run prisma:studio` - Mở Prisma Studio trực quan hóa Database.
- `pnpm run clean` - Xóa các thư mục `dist` và `node_modules` cho cả dự án.

## 🤝 Đóng góp

Mọi đóng góp, báo lỗi (issues) và yêu cầu kéo (pull requests) đều được hoan nghênh.

---
_Đây là README được tạo tự động, xin vui lòng kiểm tra và bổ sung thêm các thông tin chi tiết về giấy phép (License), tác giả hoặc liên hệ hướng dẫn của bạn._
```

Bạn có muốn tôi tự động tạo file `README.md` này vào thư mục gốc của dự án thay bạn không? (Bạn mới có một file `README.md` trống 12 bytes ở thư mục gốc).
