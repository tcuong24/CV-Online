# 🎨 CV-Online Frontend (Next.js)

Đây là Giao diện Web (Front-end) của dự án **CV-Online**. Nền tảng mang đến trình chỉnh sửa CV linh hoạt, theo phong cách "Pageless", cho phép người dùng kéo thả, điều chỉnh section trực quan mà không bị ngăn cách bởi khổ giấy A4 truyền thống.

## 🌟 Tính năng chính

- **Pageless Canvas Editor**: Giao diện liền mạch, tự do thiết kế không gò bó.
- **Drag & Drop Layouting**: Kéo thả và thay đổi thứ tự các khối thông tin (Học vấn, Kinh nghiệm, Kỹ năng, ...) dễ dàng.
- **Real-time Preview**: Mọi chỉnh sửa được render ngay lập tức (WYSWYG).
- **Zustand State Management**: Quản lý state của CV (nội dung, style, layout) cực nhẹ và hiệu quả.
- **Dynamic Theming**: Hỗ trợ nhiều template layout (ví dụ: Single Column, Sidebar Left).
- **Responsive System**: Giao diện linh hoạt, tối ưu trên cả desktop lẫn tablet.

## 🛠 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **UI & Styling**: React, TailwindCSS, Radix UI Primitives (shadcn/ui layout)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Ngôn ngữ**: TypeScript

## 🚀 Hướng dẫn chạy (Local)

1. **Cấu hình môi trường (`.env.local`)**:
   Bạn cần tạo file `.env.local` tại thư mục này với các thông tin:
   ```env
   NEXT_PUBLIC_API_URL="http://localhost:3001/api"
   NEXTAUTH_SECRET="your-nextauth-secret"
   NEXTAUTH_URL="http://localhost:3000"
   ```

2. **Cài đặt thư viện**:
   ```bash
   pnpm install
   ```

3. **Chạy Môi trường Development**:
   ```bash
   pnpm run dev
   ```

Frontend sẽ chạy tại mạch định là: `http://localhost:3000`.

## 📂 Các thư mục chính

- `app/`: Các routing pages (App Router) như `/(home)`, `/cvs/create`, `/preview`.
- `components/`: Nơi chứa các components tái sử dụng (UI, Editor Panel, Layout Templates).
- `store/`: Thiết lập Zustand store (`useCvEditorStore.ts`) quản lý logic state chuyên sâu của CV.
- `lib/`: Các tiện ích, API calls, mapper data.
