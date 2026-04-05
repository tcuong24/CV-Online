import React from "react";

export function AuthVisual() {
  return (
    <div className="relative hidden lg:flex flex-col gap-6 p-10 bg-primary/10 dark:bg-primary/20">
      <div className="flex flex-col gap-6 justify-center items-center text-center flex-1">
        <div className="w-full max-w-lg bg-center bg-no-repeat aspect-square bg-contain" data-alt="Illustration of a person building a professional resume with blocks and charts, symbolizing career growth and success." style={{
          backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCrZATcEGNdVhD2ZX9pvY__cpFhlMrxBs6TxcZ5K10NJEystZ7bnL3MIKqltETBdrO9IXTPyo7oJ683W2HONetmZT82PqQe3g-GvbQcV5DRbcwh1S6A5yc9X3FCvaqUFPF5oABoG3DztMuz3rX_F4WLBS7O9uYVOppDf6ySuSKXz4cQ_iSCkpAskqN23sZPbE9jejxGfEs1DnZP6HbNthZzuZ8TGdDZSyZRun_bg6KH-jAH2daL66bbJWkpM-AAlF5pOB3K_t5CL4M")'
        }} />

        <div className="flex flex-col gap-2 max-w-md">
          <h1 className="text-[#111418] dark:text-white text-4xl font-black leading-tight tracking-tight">
            Tạo CV chuyên nghiệp, mở lối thành công.
          </h1>
          <h2 className="text-[#111418]/80 dark:text-white/80 text-base font-normal leading-normal">
            Tham gia cùng hàng ngàn chuyên gia đang xây dựng sự nghiệp của họ với chúng tôi.
          </h2>
        </div>
      </div>

      <div className="absolute bottom-6 left-6 text-sm text-[#111418]/60 dark:text-white/60">
        © 2024 CV Builder
      </div>
    </div>
  );
}