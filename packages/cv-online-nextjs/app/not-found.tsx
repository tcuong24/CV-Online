import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F9F6F0] flex flex-col items-center justify-center px-6 font-sans">
      <div className="max-w-md w-full text-center space-y-8 p-8 bg-white border border-[#EBE6DD] rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
        {/* Animated Icon Container */}
        <div className="relative w-24 h-24 mx-auto flex items-center justify-center rounded-full bg-[#1D283D]/5 text-[#1D283D]">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
          <span className="absolute inset-0 rounded-full border-2 border-[#1D283D]/10 animate-ping opacity-25"></span>
        </div>

        {/* Text Details */}
        <div className="space-y-3">
          <h1 className="text-5xl font-extrabold text-[#1D283D] tracking-tight">404</h1>
          <h2 className="text-xl font-bold text-gray-800">Không tìm thấy hoặc CV chưa được công khai</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            Liên kết này không tồn tại hoặc chủ sở hữu chưa kích hoạt chế độ **Chia sẻ công khai**. Vui lòng kiểm tra lại đường dẫn.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-4">
          <Link href="/">
            <span className="inline-block w-full py-3 px-6 text-sm font-semibold text-white bg-[#1D283D] hover:bg-[#2c3d5a] rounded-lg shadow-sm transition-all duration-150 transform hover:-translate-y-[1px] cursor-pointer">
              Trở về trang chủ
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
