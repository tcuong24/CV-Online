import { MdLayers, MdPalette } from 'react-icons/md';

// ─── SidebarHeader ───
export function SidebarHeader() {
  return (
    <div className="sidebar-header">
      <div className="logo">
        <div className="logo-mark">CV</div>
        <div>
          <div className="logo-text">CV Builder</div>
          <div className="logo-sub">Thiết kế CV chuyên nghiệp</div>
        </div>
      </div>
    </div>
  );
}

// ─── TabNav ───
interface TabNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function TabNav({ activeTab, onTabChange }: TabNavProps) {
  return (
    <div className="tab-nav">
      <button
        className={`tab-btn${activeTab === 'content' ? ' active' : ''}`}
        onClick={() => onTabChange('content')}
      >
        <MdLayers size={14} /> Nội dung
      </button>
      <button
        className={`tab-btn${activeTab === 'style' ? ' active' : ''}`}
        onClick={() => onTabChange('style')}
      >
        <MdPalette size={14} /> Thiết kế
      </button>
    </div>
  );
}