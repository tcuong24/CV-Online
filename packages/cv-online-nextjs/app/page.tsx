import Link from "next/link";
import Header from "@/components/layout/header";

export default function Home() {
  const btnEditorial =
    "border border-foreground px-8 py-3 font-label uppercase tracking-widest text-[0.75rem] transition-colors duration-100 hover:bg-foreground hover:text-background";

  return (
    <div className="bg-background text-foreground font-body antialiased selection:bg-foreground selection:text-background min-h-screen">
      <Header />
      <main className="pt-32">
        {/* 2. Hero Section */}
        <section className="px-6 md:px-12 py-24 md:py-48 text-center max-w-5xl mx-auto">
          <h1 className="font-headline text-5xl md:text-8xl font-black tracking-tighter leading-tight mb-8">
            Sự nghiệp của bạn,<br />Được viết bằng sự Tinh tế.
          </h1>
          <p className="font-body text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            CV chuyên nghiệp dành cho những ai trân trọng sự rõ ràng và tỉ mỉ. Hãy từ bỏ những điều bình thường; xây dựng một bộ hồ sơ phản ánh quyền uy của bạn. Hãy từ chối sự tầm thường; xây dựng một tài liệu phản ánh uy quyền của bạn.
          </p>
          <div className="flex flex-col md:flex-row justify-center items-center gap-8">
            <Link href="/editor" className={`w-full md:w-auto px-12 text-center ${btnEditorial}`}>
              Tạo CV của bạn
            </Link>
            <Link className="font-label uppercase tracking-widest text-[0.75rem] border-b border-foreground pb-1 hover:border-transparent transition-all" href="#">
              Xem các mẫu CV
            </Link>
          </div>
          <hr className="mt-24 border-foreground/10" />
        </section>

        {/* 3. Template Showcase */}
        <section className="px-6 md:px-12 py-24 max-w-[1440px] mx-auto">
          <div className="mb-16">
            <span className="block w-12 h-px bg-foreground mb-4"></span>
            <h2 className="font-headline text-3xl md:text-5xl font-black italic tracking-tight">Mẫu CV</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Template Card 1 */}
            <div className="group">
              <div className="border border-border bg-card p-1 mb-6 overflow-hidden aspect-[3/4] relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt="Template Alpha" className="w-full h-full object-cover filter grayscale" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPv9NB95-6dRCvso_rHPO6jweiorZbebZqzuYAj79YMzjtJU-aqqZuQi9wDiQNaWoMF7OK4NNe020FWISUejrizqsfAaoxSBlZLmPpyYoVRVGaLnKNwVygOeV2aeug8fWyJP-zM_opy2cOob3q8UHm47CFTy5sPpRZ6Deq02W0-rUBFGxDV9Qoy-XuUC-ugSq8wXPrfnhTbB9a6lSnKHgJqiZyUPn__OoffuZLYg1XdG4CytWAKwEfTCChwQj1HyUoncREmKaB93E" />
              </div>
              <h3 className="font-headline text-xl mb-2">The Jurist</h3>
              <p className="font-label text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">Conservative • Structured</p>
            </div>
            {/* Template Card 2 */}
            <div className="group">
              <div className="border border-border bg-card p-1 mb-6 overflow-hidden aspect-[3/4] relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt="Template Beta" className="w-full h-full object-cover filter grayscale" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDoR9g9JyFX8BBJWyIbQDhDuDVcQRkIV1Sxzunenl_jrcveUoxEA4qmcRw_vIYgTV9sJmpm-WN0x0QIJY9AlzTx0CkysnWIwFWbJ3i3_1Y3VczgEw4rSBIH_qTYr5cco_IKyZJT_ZhM6f2sfZKMg9pcrq2DkZnsJNej0perZJqUu1JP6T1uLwGfgvKspEn82rPpiD2YJg3LjGSWrYQ9dvjz_tWxyJMIBIRommam_Z_8D8jj8a90ueUaMKjxixY3b2MwtJaKNF08F88" />
              </div>
              <h3 className="font-headline text-xl mb-2">The Curator</h3>
              <p className="font-label text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">Modern • Asymmetrical</p>
            </div>
            {/* Template Card 3 */}
            <div className="group">
              <div className="border border-border bg-card p-1 mb-6 overflow-hidden aspect-[3/4] relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt="Template Gamma" className="w-full h-full object-cover filter grayscale" src="https://lh3.googleusercontent.com/aida-public/AB6AXuChNJqH7godpBU9nxMIDNO1sahK5lDZ6_e6oUWvnnppkit1V4GdS63nIy3Yd0JRNy1fpOFszj-VBogmnCzy0JoG8obVeaVd6WnG9qJXh6zKHkW33dFvnChlAhOTYQcVuxFXQIQDklQBQoqK3bqmp2rD0I7LRgpfll8iwYrCXFHE3SavvevQMCqVS5cKYDLZnRTooThvHUKWSBTru5P-JrdG1YPhINRkMWvbUH3pS-py2dj68iZfeRsd7aP-AYfKUDfX76qUD_7H8ks" />
              </div>
              <h3 className="font-headline text-xl mb-2">The Founder</h3>
              <p className="font-label text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">Classic • Authoritative</p>
            </div>
          </div>
        </section>

        {/* 4. Features Section (Alternating) */}
        <section className="px-6 md:px-12 py-24 bg-muted/30">
          <div className="max-w-[1440px] mx-auto space-y-32">
            {/* Feature 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div className="border-l border-foreground pl-8">
                <h3 className="font-headline text-3xl mb-6">Precise Typography Control</h3>
                <p className="font-body text-muted-foreground leading-relaxed">
                  Fine-tune kerning, line-height, and margins with the precision of a professional typesetter. Every character is curated for readability.
                </p>
              </div>
              <div className="border border-border bg-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt="Type Control" className="w-full aspect-video object-cover filter grayscale" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBX4nHO3qNreayUqdTA594FLpOySh4WF5OlX7p731aVkD6QmSbKEDGAlH_Jywe6CX7r1i-YSmS_Yt02ndL2OxtlZouirU8ISI8a9zhAbifMYtzLPRWqGahploLO5QTEI1yHSDi5erj8qYx5ZeJHya-h2P2bB5AKPvF5UhS2i4ydbDaiLDyQhdzSYi4vccuQovyM0SRprGudT2IrFrEGBQOEYqXahbPorf21Cr34RESqQj7jikgOTDhpYXc0xc2P5I1SUIY9vmeCVSs" />
              </div>
            </div>
            {/* Feature 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div className="order-2 md:order-1 border border-border bg-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt="Canvas Focus" className="w-full aspect-video object-cover filter grayscale" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpKD0UHJWpfeUKElvWXcLVJwh5ufJMLKHzYEd5GECUbEOhS4MWBcS_1frr-PSIAcuHtkFAoyM4sVzLPflRubOEDnHNF-Dto1w453vzJcdLgoMs_A1OGdLb8GWwre42NFh_EhuYGGEW7LJAhtbRxhddIoTzjIWQtaSyV4YzlwzMn6NCgmNqN05ZhbIHdhbWx6QylrEBaupTb6LmW_Wl44zTUi3mRrwiGDGS2mVMaWebMn45AUMbeVWhOXWUzLkiM_Smis6Zv7EQSUY" />
              </div>
              <div className="order-1 md:order-2 border-l border-foreground pl-8">
                <h3 className="font-headline text-3xl mb-6">The Distraction-Free Canvas</h3>
                <p className="font-body text-muted-foreground leading-relaxed">
                  A writing environment that mirrors the final document. No cluttered sidebars, just you and your narrative on digital paper.
                </p>
              </div>
            </div>
            {/* Feature 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div className="border-l border-foreground pl-8">
                <h3 className="font-headline text-3xl mb-6">Export with Integrity</h3>
                <p className="font-body text-muted-foreground leading-relaxed">
                  Direct-to-PDF export that maintains pixel-perfect alignment. Guaranteed to pass through ATS while retaining its visual soul.
                </p>
              </div>
              <div className="border border-border bg-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt="Export Quality" className="w-full aspect-video object-cover filter grayscale" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_pk1ga6Wfj8Se-SlN4_W6Kv4wzyl6mrTzo1CxhXeid1m_IU-iRhIAqzteBCmVzzrVNoo1ioF7J4n3rMf3SzHs3nQvI_ChSezPTurQG57FJ23osXpiyQVfWIsy5ReatG4GXHiA1z1yjtwfMVfg9ixXaw2oGGIDTgzU6EmkdScWw8qTg531Y0HifIw95XZ3ftJplBYPpUl0a26btoLGS9DCQQiVUr5QEUk8aXN7TDcSie2v89gf3bSHH5fEGHgqNIRXsTO6xaFmuUo" />
              </div>
            </div>
          </div>
        </section>

        {/* 5. How It Works */}
        <section className="px-6 md:px-12 py-32 max-w-[1440px] mx-auto border-b border-foreground/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            <div className="p-12 border-b md:border-b-0 md:border-r border-foreground/20">
              <span className="font-headline text-6xl block mb-8 font-black opacity-20">01</span>
              <h4 className="font-headline text-2xl mb-4">Choose a Shell</h4>
              <p className="font-body text-muted-foreground text-sm leading-relaxed">Select from our library of editorial structures designed for specific industries and seniority levels.</p>
            </div>
            <div className="p-12 border-b md:border-b-0 md:border-r border-foreground/20">
              <span className="font-headline text-6xl block mb-8 font-black opacity-20">02</span>
              <h4 className="font-headline text-2xl mb-4">Input Narrative</h4>
              <p className="font-body text-muted-foreground text-sm leading-relaxed">Compose your experience within our refined interface. Focus on your story while we handle the aesthetic.</p>
            </div>
            <div className="p-12">
              <span className="font-headline text-6xl block mb-8 font-black opacity-20">03</span>
              <h4 className="font-headline text-2xl mb-4">Curate &amp; Print</h4>
              <p className="font-body text-muted-foreground text-sm leading-relaxed">Export a document that commands attention in any boardroom or digital application portal.</p>
            </div>
          </div>
        </section>

        {/* 6. Testimonials */}
        <section className="px-6 md:px-12 py-32 bg-background text-center">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="space-y-6">
              <p className="font-headline italic text-lg leading-relaxed">&quot;The most sophisticated tool I&apos;ve used. It treats a CV as a piece of design, not just data.&quot;</p>
              <p className="font-label text-[0.65rem] uppercase tracking-widest text-foreground font-bold">ALEXA VANCE • DESIGN DIRECTOR</p>
            </div>
            <div className="space-y-6">
              <p className="font-headline italic text-lg leading-relaxed">&quot;Elegant in its simplicity. It allowed me to stand out in a sea of generic LinkedIn-style resumes.&quot;</p>
              <p className="font-label text-[0.65rem] uppercase tracking-widest text-foreground font-bold">MARCUS REED • VP OF PRODUCT</p>
            </div>
            <div className="space-y-6">
              <p className="font-headline italic text-lg leading-relaxed">&quot;Absolute clarity. THE MANUSCRIPT is for those who understand that less is significantly more.&quot;</p>
              <p className="font-label text-[0.65rem] uppercase tracking-widest text-foreground font-bold">SARAH CHEN • SENIOR PARTNER</p>
            </div>
          </div>
        </section>

        {/* 7. Pricing */}
        {/* <section className="px-6 md:px-12 py-32 max-w-[1440px] mx-auto">
          <div className="mb-16 text-center">
            <h2 className="font-headline text-4xl font-black">Investment</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 border border-foreground divide-y md:divide-y-0 md:divide-x divide-foreground">
            <div className="p-12 space-y-8 flex flex-col">
              <div>
                <h4 className="font-label uppercase tracking-widest text-[0.7rem] mb-2">Starter</h4>
                <p className="font-headline text-4xl">$0</p>
              </div>
              <ul className="space-y-4 font-body text-sm flex-grow">
                <li className="flex items-center gap-2"><Check size={16} /> 1 Professional Template</li>
                <li className="flex items-center gap-2"><Check size={16} /> PDF Export (Watermarked)</li>
                <li className="flex items-center gap-2 text-muted-foreground/40"><X size={16} /> Custom Typography</li>
              </ul>
              <button className={btnEditorial}>Select Plan</button>
            </div>
            <div className="p-12 space-y-8 flex flex-col bg-muted/40">
              <div>
                <h4 className="font-label uppercase tracking-widest text-[0.7rem] mb-2">Professional</h4>
                <p className="font-headline text-4xl">$12</p>
              </div>
              <ul className="space-y-4 font-body text-sm flex-grow">
                <li className="flex items-center gap-2"><Check size={16} /> All Templates</li>
                <li className="flex items-center gap-2"><Check size={16} /> No Watermarks</li>
                <li className="flex items-center gap-2"><Check size={16} /> Typography Control</li>
              </ul>
              <button className={`${btnEditorial} bg-foreground text-background`}>Current Standard</button>
            </div>
            <div className="p-12 space-y-8 flex flex-col">
              <div>
                <h4 className="font-label uppercase tracking-widest text-[0.7rem] mb-2">Executive</h4>
                <p className="font-headline text-4xl">$29</p>
              </div>
              <ul className="space-y-4 font-body text-sm flex-grow">
                <li className="flex items-center gap-2"><Check size={16} /> Everything in Pro</li>
                <li className="flex items-center gap-2"><Check size={16} /> Multiple Versions</li>
                <li className="flex items-center gap-2"><Check size={16} /> Personalized Review</li>
              </ul>
              <button className={btnEditorial}>Select Plan</button>
            </div>
          </div>
        </section> */}

        {/* 8. CTA Banner */}
        <section className="px-6 md:px-12 py-32 bg-foreground text-background text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-headline text-4xl md:text-6xl font-black mb-12 tracking-tight">Ready to write your next chapter?</h2>
            <Link href="/editor" className="inline-block border border-background text-background px-16 py-4 font-label uppercase tracking-widest text-[0.8rem] hover:bg-background hover:text-foreground transition-all">
              Get started
            </Link>
          </div>
        </section>
      </main>

      {/* 9. Footer */}
      <footer className="w-full border-t border-border mt-24 bg-background">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-12 py-12 w-full max-w-[1440px] mx-auto gap-12">
          <div className="space-y-4">
            <div className="text-xl font-headline text-foreground font-black">THE MANUSCRIPT</div>
            <p className="font-body text-[0.75rem] max-w-xs text-muted-foreground">The editorial standard for modern career documentation.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-16">
            <div className="flex flex-col space-y-2">
              <span className="font-label text-[0.75rem] font-bold uppercase mb-2">Product</span>
              <Link className="font-label text-[0.75rem] uppercase tracking-[0.05em] text-muted-foreground hover:text-foreground transition-all" href="#">Templates</Link>
              <Link className="font-label text-[0.75rem] uppercase tracking-[0.05em] text-muted-foreground hover:text-foreground transition-all" href="#">Features</Link>
              <Link className="font-label text-[0.75rem] uppercase tracking-[0.05em] text-muted-foreground hover:text-foreground transition-all" href="#">Pricing</Link>
            </div>
            <div className="flex flex-col space-y-2">
              <span className="font-label text-[0.75rem] font-bold uppercase mb-2">Legal</span>
              <Link className="font-label text-[0.75rem] uppercase tracking-[0.05em] text-muted-foreground hover:text-foreground transition-all" href="#">Privacy Policy</Link>
              <Link className="font-label text-[0.75rem] uppercase tracking-[0.05em] text-muted-foreground hover:text-foreground transition-all" href="#">Terms of Service</Link>
            </div>
            <div className="flex flex-col space-y-2">
              <span className="font-label text-[0.75rem] font-bold uppercase mb-2">Social</span>
              <Link className="font-label text-[0.75rem] uppercase tracking-[0.05em] text-muted-foreground hover:text-foreground transition-all" href="#">Instagram</Link>
              <Link className="font-label text-[0.75rem] uppercase tracking-[0.05em] text-muted-foreground hover:text-foreground transition-all" href="#">Contact</Link>
            </div>
          </div>
        </div>
        <div className="px-12 pb-12 w-full max-w-[1440px] mx-auto">
          <p className="font-label text-[0.65rem] uppercase tracking-[0.05em] text-muted-foreground">© 2024 THE MANUSCRIPT. ALL RIGHTS RESERVED.</p>
        </div>
      </footer>
    </div>
  );
}
