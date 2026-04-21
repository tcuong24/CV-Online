'use client';

import React from 'react';
import { MdEmail, MdLink, MdLocationOn, MdPhone } from 'react-icons/md';
import { EditableText } from '../../shared/EditableText';
import { RenderCtx } from '../CVTemplate';
import { CvData } from '@/types/cvEditor';

interface HeaderProps {
  data: CvData;
  ctx: RenderCtx;
  theme: { primary: string; dark: string; light: string };
  fontFamily: string;
  align: string;
  fs: number;
}

/** Standalone Default Header */
export function DefaultHeader({ data, ctx, theme, fontFamily, align, fs }: HeaderProps) {
  const justifyContact = align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start';
  
  return (
    <div
      style={{
        padding: '36px 44px 28px',
        background: theme.dark,
        color: '#fff',
        textAlign: align as React.CSSProperties['textAlign'],
      }}
    >
      <div style={{ fontFamily, fontSize: fs * 2.2, fontWeight: 700, letterSpacing: '-0.5px', marginBottom: 4, lineHeight: 1.2 }}>
        <EditableText value={data.personal.name || ''} onChange={(v) => ctx.updatePersonalInfo({ name: v })} placeholder="Họ và tên của bạn" />
      </div>
      <div style={{ fontSize: fs, color: 'rgba(255,255,255,0.65)', marginBottom: 14 }}>
        <EditableText value={data.personal.role || ''} onChange={(v) => ctx.updatePersonalInfo({ role: v })} placeholder="Vị trí ứng tuyển" />
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 18px', justifyContent: justifyContact }}>
        <ContactItem icon={<MdEmail size={11} />} value={data.personal.email} onChange={(v) => ctx.updatePersonalInfo({ email: v })} placeholder="Email" />
        <ContactItem icon={<MdPhone size={11} />} value={data.personal.phone} onChange={(v) => ctx.updatePersonalInfo({ phone: v })} placeholder="Số điện thoại" />
        <ContactItem icon={<MdLocationOn size={11} />} value={data.personal.location} onChange={(v) => ctx.updatePersonalInfo({ location: v })} placeholder="Địa chỉ" />
        <ContactItem icon={<MdLink size={11} />} value={data.personal.website} onChange={(v) => ctx.updatePersonalInfo({ website: v })} placeholder="Website / Link" />
      </div>
    </div>
  );
}

/** Standalone Centered Header — tailored for Executive templates */
export function CenteredHeader({ data, ctx, theme, fontFamily, fs }: HeaderProps) {
  return (
    <div
      style={{
        padding: '44px 44px 32px',
        textAlign: 'center',
        background: '#fff',
        borderBottom: `1px solid #eee`,
      }}
    >
      <div style={{ fontFamily, fontSize: fs * 2.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', color: '#111', marginBottom: 6 }}>
        <EditableText value={data.personal.name || ''} onChange={(v) => ctx.updatePersonalInfo({ name: v })} placeholder="HỌ VÀ TÊN" />
      </div>
      <div style={{ fontSize: fs * 1.1, color: theme.primary, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 20 }}>
        <EditableText value={data.personal.role || ''} onChange={(v) => ctx.updatePersonalInfo({ role: v })} placeholder="VỊ TRÍ ỨNG TUYỂN" />
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 20px', justifyContent: 'center', fontSize: fs * 0.9, color: '#666' }}>
        <ContactItem icon={<MdEmail size={12} />} value={data.personal.email} onChange={(v) => ctx.updatePersonalInfo({ email: v })} placeholder="Email" />
        <ContactItem icon={<MdPhone size={12} />} value={data.personal.phone} onChange={(v) => ctx.updatePersonalInfo({ phone: v })} placeholder="Phone" />
        <ContactItem icon={<MdLocationOn size={12} />} value={data.personal.location} onChange={(v) => ctx.updatePersonalInfo({ location: v })} placeholder="Địa chỉ" />
        <ContactItem icon={<MdLink size={12} />} value={data.personal.website} onChange={(v) => ctx.updatePersonalInfo({ website: v })} placeholder="Link" />
      </div>
    </div>
  );
}

/** Standalone Floating Header — detached card with shadow */
export function FloatingHeader({ data, ctx, theme, fontFamily, fs }: HeaderProps) {
  return (
    <div style={{ padding: '24px 44px 0' }}>
      <div
        style={{
          padding: '30px',
          background: '#fff',
          borderRadius: '12px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          border: `1px solid ${theme.primary}15`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '20px',
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily, fontSize: fs * 2, fontWeight: 700, color: '#111', marginBottom: 4 }}>
            <EditableText value={data.personal.name || ''} onChange={(v) => ctx.updatePersonalInfo({ name: v })} placeholder="Họ và tên" />
          </div>
          <div style={{ fontSize: fs * 1.05, color: theme.primary, fontWeight: 500 }}>
            <EditableText value={data.personal.role || ''} onChange={(v) => ctx.updatePersonalInfo({ role: v })} placeholder="Vị trí ứng tuyển" />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px', fontSize: fs * 0.88, color: '#4b5563' }}>
          <ContactItem icon={<MdEmail size={12} className="text-gray-400" />} value={data.personal.email} onChange={(v) => ctx.updatePersonalInfo({ email: v })} />
          <ContactItem icon={<MdPhone size={12} className="text-gray-400" />} value={data.personal.phone} onChange={(v) => ctx.updatePersonalInfo({ phone: v })} />
          <ContactItem icon={<MdLocationOn size={12} className="text-gray-400" />} value={data.personal.location} onChange={(v) => ctx.updatePersonalInfo({ location: v })} />
          <ContactItem icon={<MdLink size={12} className="text-gray-400" />} value={data.personal.website} onChange={(v) => ctx.updatePersonalInfo({ website: v })} />
        </div>
      </div>
    </div>
  );
}
function BlackWhiteHeader({ data, ctx, theme, fontFamily, fs, align }: HeaderProps) {
  const justifyContact = align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start';
  return (
    <div
      style={{
        padding: '36px 44px 28px',
        color: '#fff',
        textAlign: align as React.CSSProperties['textAlign'],
      }}
    >
      <div style={{ fontFamily, fontSize: fs * 2.2, fontWeight: 700, letterSpacing: '-0.5px', marginBottom: 4, lineHeight: 1.2 }}>
        <EditableText value={data.personal.name || ''} onChange={(v) => ctx.updatePersonalInfo({ name: v })} placeholder="Họ và tên của bạn" />
      </div>
      <div style={{ fontSize: fs, color: 'rgba(255,255,255,0.65)', marginBottom: 14 }}>
        <EditableText value={data.personal.role || ''} onChange={(v) => ctx.updatePersonalInfo({ role: v })} placeholder="Vị trí ứng tuyển" />
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 18px', justifyContent: justifyContact }}>
        <ContactItem icon={<MdEmail size={11} />} value={data.personal.email} onChange={(v) => ctx.updatePersonalInfo({ email: v })} placeholder="Email" />
        <ContactItem icon={<MdPhone size={11} />} value={data.personal.phone} onChange={(v) => ctx.updatePersonalInfo({ phone: v })} placeholder="Số điện thoại" />
        <ContactItem icon={<MdLocationOn size={11} />} value={data.personal.location} onChange={(v) => ctx.updatePersonalInfo({ location: v })} placeholder="Địa chỉ" />
        <ContactItem icon={<MdLink size={11} />} value={data.personal.website} onChange={(v) => ctx.updatePersonalInfo({ website: v })} placeholder="Website / Link" />
      </div>
    </div>
  );
}
function ContactItem({ icon, value, onChange, placeholder }: { icon: React.ReactNode; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
      {icon}
      <EditableText value={value || ''} onChange={onChange} placeholder={placeholder} />
    </span>
  );
}
