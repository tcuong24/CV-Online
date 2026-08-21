import { Bot, Check, Eye, GripVertical, MousePointer2, Send, Sparkles, WandSparkles } from "lucide-react";

const sidebarItems = ["Giới thiệu", "Kinh nghiệm", "Kỹ năng", "Học vấn"];

export function EditorDemo() {
  return (
    <div className="editor-demo" aria-label="Minh họa trình chỉnh sửa CV tự động sắp xếp kỹ năng">
      <div className="editor-demo__chrome">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-foreground" />
          <span className="font-label text-[0.6rem] font-bold uppercase tracking-[0.18em]">CVision Editor</span>
        </div>
        <div className="flex items-center gap-1.5 text-[0.55rem] uppercase tracking-wider text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Đã lưu
        </div>
      </div>

      <div className="editor-demo__body">
        <aside className="editor-demo__sidebar">
          <p className="mb-3 text-[0.5rem] font-bold uppercase tracking-[0.2em] text-muted-foreground">Bố cục</p>
          <div className="space-y-1.5">
            {sidebarItems.map((item) => (
              <div key={item} className={`editor-demo__item ${item === "Kỹ năng" ? "editor-demo__item--skill" : ""}`}>
                <GripVertical className="h-3 w-3 opacity-35" />
                <span>{item}</span>
              </div>
            ))}
          </div>
          <div className="mt-auto hidden border-t border-foreground/10 pt-3 sm:block">
            <div className="flex items-center gap-2 text-[0.55rem] text-muted-foreground"><Sparkles className="h-3 w-3" /> Gợi ý bởi AI</div>
          </div>
        </aside>

        <div className="editor-demo__canvas">
          <div className="editor-demo__paper">
            <div className="mb-4 flex items-start justify-between border-b border-foreground/15 pb-3">
              <div><p className="font-headline text-sm font-black sm:text-base">NGUYỄN MINH AN</p><p className="mt-1 text-[0.5rem] uppercase tracking-[0.2em] text-muted-foreground">Product Designer</p></div>
              <div className="h-7 w-7 rounded-full bg-foreground/10" />
            </div>
            <CvBlock title="Kinh nghiệm"><p>Senior Product Designer</p><span>2022 — Hiện tại</span><i /></CvBlock>
            <div className="editor-demo__dropzone">Thả section tại đây</div>
            <div className="editor-demo__skill-block"><CvBlock title="Kỹ năng"><p>Figma · UX Research · Design System</p><i /></CvBlock></div>
            <CvBlock title="Học vấn"><p>Đại học Kiến trúc</p><span>2017 — 2021</span></CvBlock>
          </div>
          <div className="editor-demo__toast"><Check className="h-3 w-3" /> Đã cập nhật bố cục</div>
        </div>

        <aside className="editor-demo__chat" aria-label="Minh họa CV Assistant">
          <div className="editor-demo__chat-head">
            <span className="editor-demo__bot-icon"><Bot className="h-3.5 w-3.5" /></span>
            <div><p>CV Assistant</p><span><i /> Đang hoạt động</span></div>
          </div>

          <div className="editor-demo__messages">
            <div className="editor-demo__bubble editor-demo__bubble--ai">Xin chào! Bạn muốn cải thiện phần nào trong CV?</div>
            <div className="editor-demo__bubble editor-demo__bubble--user">Giúp tôi viết lại phần giới thiệu chuyên nghiệp hơn.</div>
            <div className="editor-demo__typing"><b /><b /><b /></div>
            <div className="editor-demo__bubble editor-demo__bubble--result">
              Mình đã viết lại nội dung ngắn gọn và tập trung hơn vào giá trị nghề nghiệp.
              <span><Check className="h-2.5 w-2.5" /> Đã áp dụng vào CV</span>
            </div>
          </div>

          <div className="editor-demo__quick-actions">
            <button type="button"><Eye className="h-2.5 w-2.5" /> Phân tích CV</button>
            <button type="button"><WandSparkles className="h-2.5 w-2.5" /> Cải thiện văn</button>
          </div>
          <div className="editor-demo__chat-input"><span>Nhập yêu cầu...</span><Send className="h-3 w-3" /></div>
        </aside>
      </div>

      <div className="editor-demo__drag-card"><GripVertical className="h-3 w-3" /> Kỹ năng</div>
      <MousePointer2 className="editor-demo__cursor h-5 w-5 fill-foreground text-background" aria-hidden="true" />
    </div>
  );
}

function CvBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="mb-3"><h3 className="mb-1.5 border-b border-foreground/20 pb-1 text-[0.5rem] font-bold uppercase tracking-[0.18em]">{title}</h3><div className="relative text-[0.52rem] leading-relaxed">{children}</div></section>;
}
