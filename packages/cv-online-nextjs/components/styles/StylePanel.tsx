import { useState, useRef } from 'react';
import { 
  Undo2, 
  Redo2, 
  Loader2, 
  ExternalLink, 
  Save, 
  Palette, 
  Type, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Sparkles,
  ChevronDown,
  UploadCloud,
  Columns,
  Minus,
  Plus,
  RefreshCcw,
  ArrowLeft
} from 'lucide-react';
import { COLOR_THEMES, FONT_OPTIONS } from '@/constants/cvEditor';
import { StyleConfig } from '@/types/cvEditor';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from '../ui/button';
import { useStore } from 'zustand';
import { useCvEditorStore } from '@/stores/useCvEditor';
import axiosInstance from '@/lib/axios';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { resolveTheme } from '@/lib/mappers/templateMapper';

const LINE_HEIGHT_OPTIONS = [
  { id: 'tight', label: 'Chặt', val: 1.4 },
  { id: 'normal', label: 'Vừa (1.6)', val: 1.6 },
  { id: 'loose', label: 'Rộng', val: 1.9 },
];

interface StylePanelProps {
  style: StyleConfig;
  onChange: (v: StyleConfig) => void;
  sidebarOpen?: boolean;
  onToggleSidebar?: () => void;
  aiPanelOpen?: boolean;
  onToggleAiPanel?: () => void;
  onSave?: (opts?: { captureThumbnail?: boolean }) => Promise<string | null>;
  isSaving?: boolean;
  isDirty?: boolean;
  lastSavedAt?: number | null;
  onBackClick?: () => void;
}

export function StylePanel({ style, onChange, sidebarOpen, onToggleSidebar, aiPanelOpen, onToggleAiPanel, onSave, isSaving, isDirty, lastSavedAt, onBackClick }: StylePanelProps) {
  const set = (k: keyof StyleConfig, v: string | number) =>
    onChange({ ...style, [k]: v });

  const theme = resolveTheme(style);
  const font = FONT_OPTIONS.find((f) => f.id === style.fontId) ?? FONT_OPTIONS[0];
  const { undo, redo, pastStates, futureStates } = useStore(useCvEditorStore.temporal, (state) => state);
  const [savedThemeId, setSavedThemeId] = useState(style.themeId);
  const [savedFontId, setSavedFontId] = useState(style.fontId);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const router = useRouter();

  const handleBack = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      router.push('/dashboard');
    }
  };
  
  const setData = useCvEditorStore((s) => s.setData);
  const setOrder = useCvEditorStore((s) => s.setOrder);

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    setIsImporting(true);
    const toastId = toast.loading('Đang xử lý...');
    try {
      const res = await axiosInstance.post('/cvs/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setData(res.data);
      toast.success('Xong!', { id: toastId });
    } catch {
      toast.error('Lỗi!', { id: toastId });
    } finally {
      setIsImporting(false);
      e.target.value = ''; // Reset file input so selecting the same file again triggers onChange
    }
  };

  const ToolGroup = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-center gap-0.5 px-1.5 border-r border-slate-200 last:border-r-0">
      {children}
    </div>
  );

  return (
    <div className="style-toolbar" style={{
      display: 'flex',
      alignItems: 'center',
      height: '48px',
      padding: '0 12px',
      background: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      width: '100%',
      position: 'relative',
      zIndex: 30,
      userSelect: 'none',
      overflowX: 'auto',
      scrollbarWidth: 'none',
    }}>
      {/* Quay lại Dashboard */}
      <ToolGroup>
        <Button
          variant="ghost" size="icon"
          onClick={handleBack}
          className="w-9 h-9 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-md"
          title="Quay lại Dashboard"
        >
          <ArrowLeft size={18} />
        </Button>
      </ToolGroup>

      {/* Group 1: Navigation & Structure */}
      <ToolGroup>
        <Button
          variant="ghost" size="icon"
          onClick={onToggleSidebar}
          className={`w-9 h-9 rounded-md ${sidebarOpen ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
          title="Bố cục CV"
        >
          <Columns size={18} />
        </Button>
        <Button
          variant="ghost" size="icon"
          onClick={onToggleAiPanel}
          className={`w-9 h-9 rounded-md ${aiPanelOpen ? 'bg-violet-50 text-violet-600' : 'text-slate-400 hover:text-slate-600'}`}
          title="AI Co-pilot"
        >
          <Sparkles size={18} />
        </Button>
      </ToolGroup>

      {/* Group 2: History */}
      <ToolGroup>
        <Button
          variant="ghost" size="icon"
          onClick={() => undo()}
          disabled={pastStates.length === 0}
          className="w-9 h-9 text-slate-500 disabled:opacity-20"
        >
          <Undo2 size={18} />
        </Button>
        <Button
          variant="ghost" size="icon"
          onClick={() => redo()}
          disabled={futureStates.length === 0}
          className="w-9 h-9 text-slate-500 disabled:opacity-20"
        >
          <Redo2 size={18} />
        </Button>
      </ToolGroup>

      {/* Group 3: Style & Font */}
      <ToolGroup>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 px-2 h-9 hover:bg-slate-50 rounded-md transition-colors group">
              <div className="w-4 h-4 rounded-full border border-slate-300" style={{ background: theme.primary }} />
              <ChevronDown size={12} className="text-slate-400 group-hover:text-slate-600" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="p-3 border shadow-xl rounded-lg bg-white w-56">
            <div className="grid grid-cols-5 gap-2">
              {COLOR_THEMES.map((t) => (
                <DropdownMenuItem
                  key={t.id}
                  onClick={() => set('themeId', t.id)}
                  className="p-0 m-0 w-8 h-8 rounded-full cursor-pointer hover:ring-2 ring-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400"
                  style={{ background: t.primary, border: style.themeId === t.id ? '2px solid #000' : 'none' }}
                />
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 px-3 h-9 hover:bg-slate-50 rounded-md transition-colors group min-w-[120px] ml-1">
              <span className="text-[13px] font-medium text-slate-700 truncate" style={{ fontFamily: font.family }}>{font.label}</span>
              <ChevronDown size={12} className="text-slate-400 group-hover:text-slate-600 ml-auto" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="p-1 border shadow-xl rounded-lg bg-white w-64 max-h-[50vh] overflow-y-auto">
            {FONT_OPTIONS.map((f) => (
              <DropdownMenuItem
                key={f.id}
                onClick={() => set('fontId', f.id)}
                className={`p-2 rounded-md cursor-pointer ${style.fontId === f.id ? 'bg-slate-100' : 'hover:bg-slate-50'}`}
              >
                <div className="flex flex-col">
                  <span style={{ fontFamily: f.family }} className="text-[13px] font-semibold">{f.label}</span>
                  <span style={{ fontFamily: f.family }} className="text-[11px] text-slate-400">{f.sample}</span>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </ToolGroup>

      {/* Group 4: Typography Actions */}
      <ToolGroup>
        <div className="flex items-center gap-0.5 bg-slate-50 p-0.5 rounded-md mx-1">
          <Button
            variant="ghost" size="icon"
            onClick={() => set('nameAlign', 'left')}
            className={`w-8 h-8 rounded ${style.nameAlign === 'left' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}
          >
            <AlignLeft size={16} />
          </Button>
          <Button
            variant="ghost" size="icon"
            onClick={() => set('nameAlign', 'center')}
            className={`w-8 h-8 rounded ${style.nameAlign === 'center' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}
          >
            <AlignCenter size={16} />
          </Button>
          <Button
            variant="ghost" size="icon"
            onClick={() => set('nameAlign', 'right')}
            className={`w-8 h-8 rounded ${style.nameAlign === 'right' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}
          >
            <AlignRight size={16} />
          </Button>
        </div>

        <div className="flex items-center gap-2 px-2">
          <Button variant="ghost" size="icon" className="w-6 h-6 text-slate-400" onClick={() => set('fontSize', Math.max(10, style.fontSize - 1))}><Minus size={14} /></Button>
          <span className="text-[13px] font-bold text-slate-700 min-w-[20px] text-center">{style.fontSize}</span>
          <Button variant="ghost" size="icon" className="w-6 h-6 text-slate-400" onClick={() => set('fontSize', Math.min(20, style.fontSize + 1))}><Plus size={14} /></Button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 px-2 h-9 hover:bg-slate-50 rounded-md group">
              <span className="text-[13px] font-medium text-slate-600">Giãn dòng</span>
              <ChevronDown size={12} className="text-slate-400 group-hover:text-slate-600" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="p-1 border shadow-xl rounded-lg bg-white w-32">
            {LINE_HEIGHT_OPTIONS.map((o) => (
              <DropdownMenuItem
                key={o.id}
                onClick={() => set('lineHeight', o.id)}
                className={`p-2 rounded-md cursor-pointer text-[13px] ${style.lineHeight === o.id ? 'bg-slate-100 text-slate-900 font-bold' : 'hover:bg-slate-50 text-slate-600'}`}
              >
                {o.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </ToolGroup>

      {/* Group 5: Persistence & Actions */}
      <div className="ml-auto flex items-center gap-2">
        <input type="file" ref={fileInputRef} onChange={handleFileImport} className="hidden" accept=".pdf,.docx,.doc,image/*" />
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isImporting}
          className="h-8 px-2 text-slate-500 hover:text-slate-900 gap-1.5"
        >
          {isImporting ? <Loader2 size={14} className="animate-spin" /> : <UploadCloud size={16} />}
          <span className="text-[12px] font-medium">Nhập file</span>
        </Button>

        <a href="/preview" target="_blank" className="no-underline">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-slate-500 hover:text-slate-900 gap-1.5"
          >
            <ExternalLink size={16} />
            <span className="text-[12px] font-medium">Xem trước</span>
          </Button>
        </a>

        <div className="w-px h-4 bg-slate-200 mx-1" />

        <Button
          onClick={() => onSave?.({ captureThumbnail: true })}
          disabled={isSaving || !isDirty}
          className={`h-8 px-4 rounded-md font-bold text-[12px] gap-1.5 transition-all ${!isDirty ? 'bg-transparent text-slate-300' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'}`}
        >
          {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={16} />}
          {isSaving ? 'Lưu...' : !isDirty ? 'Đã lưu' : 'Lưu CV'}
        </Button>
      </div>

      <style jsx>{`
        .style-toolbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}