'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Bot, Send, X, Wand2, CheckCircle2, AlertCircle,
  ArrowRight, Check, Zap, Eye, Sparkles,
} from 'lucide-react';
import { useCvEditorStore } from '@/stores/useCvEditor';
import axiosInstance from '@/lib/axios';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Skeleton } from '../ui/skeleton';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface SuggestionItem {
  field: string;   // "summary" | "experience.0.desc" | "projects.0.desc" | "skills"
  label: string;   // display name
  oldText: string; // original text from CV (empty string if none)
  newText: string; // replacement text
}

interface BaseResponse {
  intent: string;
  suggestions: SuggestionItem[];
  score: { before: number; after: number };
}

interface CollectInfoResponse extends BaseResponse {
  intent: 'collect_info';
  message: string;
  missingFields: string[];
  nextQuestion: string;
}

interface AnalyzeCvResponse extends BaseResponse {
  intent: 'analyze_cv';
  analysis: string;
  issues: string[];
  criteriaScores: { name: string; score: number; max: number; note: string }[];
}

interface ImproveWritingResponse extends BaseResponse {
  intent: 'improve_writing';
  analysis: string;
  issues: string[];
}

interface MatchJdResponse extends BaseResponse {
  intent: 'match_jd';
  analysis: string;
  matchScore: number;
  matched: string[];
  gaps: string[];
}

interface SuggestKeywordsResponse extends BaseResponse {
  intent: 'suggest_keywords';
  analysis: string;
  currentKeywords: string[];
  missingKeywords: { keyword: string; reason: string; priority: 'high' | 'medium' | 'low' }[];
}

interface WriteContentResponse extends BaseResponse {
  intent: 'write_content';
  contentType: 'summary' | 'cover_letter' | 'bullet_points';
  analysis: string;
  generated: string;
}

interface GeneralQaResponse extends BaseResponse {
  intent: 'general_qa';
  message: string;
  tips: string[];
}

export interface ClarificationQuestion {
  id: string;
  question: string;
  required: boolean;
  options: string[];
}

export interface NeedClarificationResponse {
  intent: 'need_clarification';
  message: string;
  questions: ClarificationQuestion[];
  pendingIntent: string;
}

type AiResponse =
  | CollectInfoResponse
  | AnalyzeCvResponse
  | ImproveWritingResponse
  | MatchJdResponse
  | SuggestKeywordsResponse
  | WriteContentResponse
  | NeedClarificationResponse
  | GeneralQaResponse;

interface Message {
  role: 'user' | 'assistant';
  content: string | AiResponse;
  isJson?: boolean;
}

// ─── Shared sub-components ────────────────────────────────────────────────────

function ScoreHeader({ score }: { score: { before: number; after: number } }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-[#7c7cf1] font-bold text-[12px] tracking-tight uppercase">
        <Zap size={14} fill="#7c7cf1" /> Phân tích AI
      </div>
      <div className="flex items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-1">
        <span className="text-[11px] font-bold text-slate-300 line-through">{score.before}</span>
        <ArrowRight size={10} className="text-slate-200" />
        <span className="text-[11px] font-bold text-green-500">{score.after}/10</span>
      </div>
    </div>
  );
}

function IssuesList({ issues }: { issues: string[] }) {
  if (!issues.length) return null;
  return (
    <div className="space-y-2 rounded-xl bg-amber-50/50 p-4 border border-amber-100/50">
      {issues.map((issue, i) => (
        <div key={i} className="flex items-start gap-2.5 text-[13px] text-amber-800/80 leading-snug">
          <AlertCircle size={14} className="mt-0.5 shrink-0 text-amber-500/70" />{issue}
        </div>
      ))}
    </div>
  );
}

function SuggestionsList({
  suggestions,
  onApply,
}: {
  suggestions: SuggestionItem[];
  onApply: (field: string, value: string) => void;
}) {
  const [applied, setApplied] = useState<Set<string>>(new Set());
  if (!suggestions.length) return null;
  return (
    <div className="space-y-3">
      {suggestions.map((item, i) => {
        const key = `${item.field}-${i}`;
        const isApplied = applied.has(key);
        return (
          <div key={key} className="rounded-xl border border-slate-100 bg-[#FFFFFF] p-4 space-y-2">
            <span className="inline-block rounded-md bg-white border border-slate-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              {item.label}
            </span>
            {item.oldText && (
              <p className="text-[12px] text-slate-400 line-through leading-relaxed">"{item.oldText}"</p>
            )}
            <p className="text-[13px] text-slate-700 font-medium leading-relaxed italic">"{item.newText}"</p>
            <button
              onClick={() => { onApply(item.field, item.newText); setApplied(p => new Set(p).add(key)); }}
              disabled={isApplied}
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-bold transition-all active:scale-95',
                isApplied
                  ? 'bg-green-50 text-green-600 border border-green-200 cursor-default'
                  : 'bg-slate-900 text-white hover:bg-slate-700',
              )}
            >
              {isApplied ? <><CheckCircle2 size={12} /> Đã áp dụng</> : <><Check size={12} /> Áp dụng</>}
            </button>
          </div>
        );
      })}
    </div>
  );
}



// ─── Intent-specific cards ────────────────────────────────────────────────────

function CollectInfoCard({ data }: { data: CollectInfoResponse }) {
  return (
    <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-5 space-y-3 w-full">
      <p className="text-[14px] text-slate-700 leading-relaxed">{data.message}</p>
      <div className="rounded-xl bg-white border border-blue-100 p-4">
        <p className="text-[12px] font-bold text-blue-600 mb-1">Câu hỏi tiếp theo</p>
        <p className="text-[13px] text-slate-700">{data.nextQuestion}</p>
      </div>
      {data.missingFields.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {data.missingFields.map((f, i) => (
            <span key={i} className="rounded-full bg-white border border-blue-200 px-2.5 py-1 text-[11px] text-blue-600">
              Thiếu: {f}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function AnalyzeCvCard({
  data,
  onApply,
}: {
  data: AnalyzeCvResponse;
  onApply: (f: string, v: string) => void;
}) {
  return (
    <div className="w-full space-y-4 rounded-2xl border border-[#7c3aed] bg-[#EDE9FE] p-5 shadow-sm ring-1 ring-slate-100">
      <ScoreHeader score={data.score} />
      <p className="text-[14px] text-slate-700">{data.analysis}</p>

      {/* Criteria breakdown */}
      {data.criteriaScores?.length > 0 && (
        <div className="space-y-2.5">
          {data.criteriaScores.map((c, i) => (
            <div key={i}>
              <div className="flex justify-between text-[12px] mb-1">
                <span className="text-slate-600">{c.name}</span>
                <span className="font-bold text-slate-700">{c.score}/{c.max}</span>
              </div>
              <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#7c7cf1] transition-all"
                  style={{ width: `${(c.score / c.max) * 100}%` }}
                />
              </div>
              {c.note && <p className="text-[11px] text-slate-400 mt-0.5">{c.note}</p>}
            </div>
          ))}
        </div>
      )}

      <IssuesList issues={data.issues} />
      <SuggestionsList suggestions={data.suggestions} onApply={onApply} />
    </div>
  );
}

function SuggestionsCard({
  data,
  onApply,
}: {
  data: ImproveWritingResponse;
  onApply: (f: string, v: string) => void;
}) {
  return (
    <div className="w-full space-y-4 rounded-2xl border border-[#7c3aed] bg-[#EDE9FE] p-5 shadow-sm ring-1 ring-slate-100">
      <ScoreHeader score={data.score} />
      <p className="text-[14px] text-slate-700">{data.analysis}</p>
      <IssuesList issues={data.issues} />
      <SuggestionsList suggestions={data.suggestions} onApply={onApply} />
    </div>
  );
}

function MatchJdCard({
  data,
  onApply,
}: {
  data: MatchJdResponse;
  onApply: (f: string, v: string) => void;
}) {
  return (
    <div className="w-full space-y-4 rounded-2xl border border-[#7c3aed] bg-[#EDE9FE] p-5 shadow-sm ring-1 ring-slate-100">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-bold uppercase tracking-tight text-[#7c7cf1]">Độ phù hợp JD</span>
        <span className="text-[20px] font-bold text-slate-800">{data.matchScore}%</span>
      </div>
      <p className="text-[14px] text-slate-700">{data.analysis}</p>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-green-50 border border-green-100 p-3 space-y-1.5">
          <p className="text-[10px] font-bold uppercase text-green-600">Đang có</p>
          {data.matched.map((m, i) => (
            <p key={i} className="text-[12px] text-green-800 flex gap-1.5"><span>✓</span>{m}</p>
          ))}
        </div>
        <div className="rounded-xl bg-red-50 border border-red-100 p-3 space-y-1.5">
          <p className="text-[10px] font-bold uppercase text-red-600">Còn thiếu</p>
          {data.gaps.map((g, i) => (
            <p key={i} className="text-[12px] text-red-800 flex gap-1.5"><span>✗</span>{g}</p>
          ))}
        </div>
      </div>

      <SuggestionsList suggestions={data.suggestions} onApply={onApply} />
    </div>
  );
}

function KeywordsCard({
  data,
  onApply,
}: {
  data: SuggestKeywordsResponse;
  onApply: (f: string, v: string) => void;
}) {
  const priorityColor: Record<string, string> = {
    high: 'text-red-600 bg-red-50 border-red-200',
    medium: 'text-amber-600 bg-amber-50 border-amber-200',
    low: 'text-slate-500 bg-slate-50 border-slate-200',
  };
  return (
    <div className="w-full space-y-4 rounded-2xl border border-[#7c3aed] bg-[#EDE9FE] p-5 shadow-sm ring-1 ring-slate-100">
      <p className="text-[14px] text-slate-700">{data.analysis}</p>
      <div className="space-y-2">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Keyword còn thiếu</p>
        {data.missingKeywords.map((k, i) => (
          <div key={i} className="flex items-start gap-3 rounded-xl bg-[#FFFFFF] border border-slate-100 p-3">
            <span className={cn('rounded-full border px-2 py-0.5 text-[10px] font-bold shrink-0', priorityColor[k.priority])}>
              {k.priority}
            </span>
            <div>
              <p className="text-[13px] font-bold text-slate-700">{k.keyword}</p>
              <p className="text-[11px] text-slate-400">{k.reason}</p>
            </div>
          </div>
        ))}
      </div>
      <SuggestionsList suggestions={data.suggestions} onApply={onApply} />
    </div>
  );
}

function WriteContentCard({
  data,
  onApply,
}: {
  data: WriteContentResponse;
  onApply: (f: string, v: string) => void;
}) {
  const contentTypeLabel = {
    summary: 'Summary mới',
    cover_letter: 'Cover Letter',
    bullet_points: 'Bullet Points',
  };
  return (
    <div className="w-full space-y-4 rounded-2xl border border-[#7c3aed] bg-[#EDE9FE] p-5 shadow-sm ring-1 ring-slate-100">
      <div className="flex items-center gap-2 text-[#7c7cf1] font-bold text-[12px] uppercase">
        <Wand2 size={14} />
        {contentTypeLabel[data.contentType] ?? 'Nội dung'}
      </div>
      <p className="text-[12px] text-slate-500">{data.analysis}</p>
      <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 text-[13px] text-slate-700 leading-relaxed whitespace-pre-line">
        {data.generated}
      </div>
      <SuggestionsList suggestions={data.suggestions} onApply={onApply} />
    </div>
  );
}

function GeneralQaCard({ data }: { data: GeneralQaResponse }) {
  return (
    <div className="space-y-3 w-full">
      <div className="rounded-2xl rounded-tl-none bg-[#EDE9FE] border border-[#7c3aed] px-4 py-3 text-[14px] text-slate-800 leading-relaxed ring-1 ring-slate-100">
        {data.message}
      </div>
      {data.tips.length > 0 && (
        <div className="space-y-1.5">
          {data.tips.map((tip, i) => (
            <div key={i} className="flex gap-2 text-[12px] text-slate-600">
              <span className="text-[#7c7cf1] font-bold shrink-0">→</span>{tip}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Dispatcher ───────────────────────────────────────────────────────────────

function AiResponseCard({
  response,
  onApply,
}: {
  response: AiResponse;
  onApply: (field: string, value: string) => void;
}) {
  switch (response.intent) {
    case 'collect_info': return <CollectInfoCard data={response} />;
    case 'analyze_cv': return <AnalyzeCvCard data={response} onApply={onApply} />;
    case 'improve_writing': return <SuggestionsCard data={response} onApply={onApply} />;
    case 'match_jd': return <MatchJdCard data={response} onApply={onApply} />;
    case 'suggest_keywords': return <KeywordsCard data={response} onApply={onApply} />;
    case 'write_content': return <WriteContentCard data={response} onApply={onApply} />;
    case 'general_qa': return <GeneralQaCard data={response} />;
    default: return null;
  }
}

// ─── Main Panel ───────────────────────────────────────────────────────────────

export function CvAiChatbox({ onClose }: { onClose?: () => void }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Xin chào! Tôi sẵn sàng phân tích CV của bạn. Muốn cải thiện phần nào nhé?' },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingIntent, setPendingIntent] = useState<string | null>(null);
  const [clarificationQuestions, setClarificationQuestions] = useState<ClarificationQuestion[]>([]);
  const [answeredQuestions, setAnsweredQuestions] = useState<{ id: string; answer: string }[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const cvData = useCvEditorStore((s) => s.data);
  const updatePersonalInfo = useCvEditorStore((s) => s.updatePersonalInfo);
  const updateEntry = useCvEditorStore((s) => s.updateEntry);
  const addSkill = useCvEditorStore((s) => s.addSkill);
  const openSections = useCvEditorStore((s) => s.openSections);

  const activeSection = Object.keys(openSections).find((key) => openSections[key]) || 'personal';

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    const clarificationContext = pendingIntent
      ? { pendingIntent, answeredQuestions }
      : undefined;

    try {
      const response = await axiosInstance.post('/cv/ai/chat', {
        history: newMessages.map((m) => ({
          role: m.role,
          content: typeof m.content === 'string' ? m.content : JSON.stringify(m.content),
        })),
        currentCv: cvData,
        message: text,
        activeSection,
        clarificationContext,
      });

      let aiResult = response.data.response;
      let isJson = false;

      try {
        aiResult = JSON.parse(aiResult);
        isJson = true;
        
        if (aiResult.intent === 'need_clarification') {
          setPendingIntent(aiResult.pendingIntent);
          setClarificationQuestions(aiResult.questions || []);
        } else {
          setPendingIntent(null);
          setClarificationQuestions([]);
          setAnsweredQuestions([]);
        }
      } catch {
        // Not JSON — render as plain string
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: aiResult, isJson }]);
    } catch (error) {
      console.error('Chat AI Error:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Rất tiếc, tôi không thể xử lý yêu cầu lúc này.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerQuestion = (questionId: string, answer: string) => {
    const updated = [
      ...answeredQuestions.filter((q) => q.id !== questionId),
      { id: questionId, answer },
    ];
    setAnsweredQuestions(updated);

    const allRequired = clarificationQuestions
      .filter((q) => q.required)
      .every((q) => updated.some((a) => a.id === q.id));

    if (allRequired) {
      // Auto-send when all required answers are collected
      handleSend('Tôi đã cung cấp đủ thông tin. Hãy tiếp tục.');
      setClarificationQuestions([]);
    }
  };

  const applySuggestion = (field: string, value: string) => {
    const parts = field.split('.');
    const [rawSection, indexStr, key = 'desc'] = parts;

    // Normalize: AI may return "experience" but store key is "experiences"
    const sectionKeyMap: Record<string, string> = {
      experience: 'experiences',
      project: 'projects',
    };
    const section = sectionKeyMap[rawSection] ?? rawSection;

    if (section === 'summary') {
      updatePersonalInfo({ summary: value });
    } else if (section === 'skills') {
      if (value.includes(':')) {
        // Grouped skills format: "Category1: skill1, skill2 | Category2: skill3"
        const groups = value.split('|').map(g => g.trim());
        groups.forEach(group => {
          const parts = group.split(':');
          if (parts.length >= 2) {
            const category = parts[0].trim();
            const skillsStr = parts[1].trim();
            const incoming = skillsStr.split(',').map(s => s.trim()).filter(Boolean);
            incoming.forEach(name => {
              const exists = ((cvData as any).skills ?? []).some((s: any) => 
                (s.name ?? '').toLowerCase() === name.toLowerCase() && 
                s.category === category
              );
              if (!exists) {
                addSkill({ id: crypto.randomUUID(), name, category, proficiencyLevel: 'Intermediate' } as any);
              }
            });
          }
        });
      } else {
        // Flat skills format
        const existingNames = new Set(
          ((cvData as any).skills ?? []).map((s: any) => (s.name ?? '').toLowerCase())
        );
        const incoming = value
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
        incoming.forEach((name) => {
          if (!existingNames.has(name.toLowerCase())) {
            addSkill({ id: crypto.randomUUID(), name, proficiencyLevel: 'Intermediate' } as any);
          }
        });
      }
    } else {
      const items = (cvData as any)[section];
      if (Array.isArray(items)) {
        const item = items[parseInt(indexStr) || 0];
        if (item) updateEntry(section, item.id, { [key]: value });
      }
    }

    setMessages((prev) => [
      ...prev,
      { role: 'assistant', content: `✓ Đã cập nhật phần "${field}"` },
    ]);
  };

  const quickActions = [
    { label: 'Phân tích CV', icon: Eye, prompt: 'Hãy phân tích và chấm điểm CV hiện tại của tôi.' },
    { label: 'Cải thiện văn', icon: Wand2, prompt: 'Tìm và viết lại các câu diễn đạt yếu trong CV.' },
    { label: 'Từ khóa ATS', icon: Sparkles, prompt: 'Gợi ý từ khóa ATS còn thiếu trong CV của tôi.' },
    { label: 'Viết Summary', icon: Bot, prompt: 'Viết lại summary/objective cho CV của tôi.' },
  ];

  return (
    <div className="flex h-full flex-col bg-white border-l border-slate-200">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between bg-[#F5F4ED] px-5! py-4! text-white">
        <div className="flex items-center gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-[15px] font-bold tracking-tight text-[#18181b]">CV Assistant</h3>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              <span className="text-[11px] font-medium text-slate-400">Đang hoạt động</span>
            </div>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="shrink-0 rounded-full p-2 hover:bg-black/5 transition-colors">
            <X size={20} className="text-[#18181b]" />
          </button>
        )}
      </div>

      {/* Messages Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto  p-4 space-y-6 no-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={cn('flex flex-col gap-2', msg.role === 'user' ? 'items-end' : 'items-start')}>
            {typeof msg.content === 'string' ? (
              <div
                className={cn(
                  'rounded-2xl px-4! py-3! text-[14px] leading-relaxed shadow-sm max-w-[90%]',
                  msg.role === 'user'
                    ? 'bg-[#DBE9FE] text-slate-800 rounded-tr-none border border-[#2563eb]'
                    : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none ring-1 ring-slate-100',
                )}
              >
                {msg.content}
              </div>
            ) : (
              <AiResponseCard response={msg.content as AiResponse} onApply={applySuggestion} />
            )}
          </div>
        ))}

        {clarificationQuestions.length > 0 && !isLoading && (
          <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-2xl p-4 shadow-sm space-y-4">
            <p className="text-[13px] text-[#1e40af] font-medium flex items-center gap-1.5">
              <AlertCircle size={14} />
              Cần thêm thông tin để hỗ trợ tốt nhất:
            </p>
            {clarificationQuestions.map(q => (
              <div key={q.id} className="space-y-2.5 bg-white p-3 rounded-xl border border-[#dbeafe]">
                <p className="text-[13px] text-slate-700 font-medium leading-relaxed">
                  {q.question} {q.required && <span className="text-red-500">*</span>}
                </p>
                {q.options && q.options.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {q.options.map(opt => {
                      const isSelected = answeredQuestions.find(a => a.id === q.id)?.answer === opt;
                      return (
                        <button
                          key={opt}
                          className={`px-3 py-1.5 text-[12px] font-medium rounded-full border transition-all ${
                            isSelected
                              ? 'bg-[#2563eb] text-white border-[#2563eb] shadow-sm' 
                              : 'bg-white text-slate-600 border-slate-200 hover:border-[#93c5fd] hover:bg-[#f8fafc]'
                          }`}
                          onClick={() => handleAnswerQuestion(q.id, opt)}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <input
                    type="text"
                    className="w-full text-[13px] px-3 py-2 text-slate-800 border border-slate-200 rounded-lg outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] placeholder:text-slate-400 transition-all"
                    placeholder="Nhập câu trả lời..."
                    onBlur={e => {
                      if (e.target.value.trim()) handleAnswerQuestion(q.id, e.target.value.trim());
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                        handleAnswerQuestion(q.id, e.currentTarget.value.trim());
                      }
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {isLoading && (
          <div className="flex items-start gap-2">
            <Skeleton className="rounded-2xl rounded-tl-none bg-white border border-slate-100 px-4! py-3!">
              <div className="flex items-center gap-2">
                <p className="inline-flex items-center justify-center w-4 h-4 animate-[spin_1.5s_linear_infinite]">
                  ✦
                </p>
                <p className="text-sm text-slate-600">
                  Đang xử lý...
                </p>
              </div>
            </Skeleton>
          </div>
        )}
      </div>

      {/* Quick Actions — 2×2 grid */}
      {!isLoading && !input.trim() && (
        <div className="grid grid-cols-2 shrink-0 gap-1.5 px-3 pb-3 pt-2 border-t border-slate-100 bg-white animate-in fade-in slide-in-from-bottom-2 duration-300">
          {quickActions.map((action, i) => (
            <button
              key={i}
              onClick={() => handleSend(action.prompt)}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] font-bold text-slate-700 hover:bg-slate-100 transition-all"
            >
              <action.icon size={12} className="text-slate-500 shrink-0" />
              {action.label}
            </button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="shrink-0 border-t border-slate-100 bg-white p-4!">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Nhập yêu cầu cải thiện CV..."
            rows={Math.min(5, input.split('\n').length || 1)}
            className="flex-1 rounded-xl border border-slate-200 bg-slate-50 py-3! px-4! text-[14px] outline-none focus:border-slate-400 focus:bg-white transition-all resize-none max-h-32"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#5b5bd6] text-white transition-all hover:bg-[#4a4ac5] disabled:opacity-30"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}