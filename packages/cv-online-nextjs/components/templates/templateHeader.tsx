import { Button } from "@/components/ui/button";

export function TemplatesHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-14 w-full items-center">
        <div className="mr-4 hidden md:flex">
          <a className="mr-6 flex items-center space-x-2" href="/">
            <div className="font-headline text-2xl font-black tracking-tighter text-foreground">
              CVision
            </div>
          </a>
          <nav className="flex items-center gap-6 text-sm">
            <a
              className="transition-colors hover:text-foreground/80 text-foreground/60"
              href="#"
            >
              Quản lý CV
            </a>
            <a
              className="transition-colors hover:text-foreground/80 text-foreground/60"
              href="#"
            >
              Tài khoản
            </a>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <Button className="hidden sm:inline-flex">Tạo CV Mới</Button>
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA7fStwC3Wc0GO5JGbRHywikom_eouL6FyZltMkSrZpfF-Moyp4A8FR6yGUMrLTjL41WTC6PTPOuIIMgJ4aJ-l2ciorRda5tRb0lur34Jk9DnhLjQ_kBOcxuGYnWBFbkTqDBVF2LYrminToZrmSpBJ2cR6cyT2CaM0XA2YsvZB2X39jymF2OxhKL8xylVgqHBGkAx8ODtnjPDDN4-KYzm6PWDPIax9YeKp2tCfavgQah4JFfGVjWV6lxOtW9lSTRaFxK8iavFgWNj4")',
            }}
          />
        </div>
      </div>
    </header>
  );
}
