"use client";

import React from "react";
import { useCvStore } from "@/stores/useCVStore";

interface SummaryProps {
  content: string;
}

export function Summary({ content }: SummaryProps) {
  const { updateSummary } = useCvStore();

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    const value = e.currentTarget.innerHTML || "";
    updateSummary(value);
  };

  return (
    <div style={{ marginBottom: '32px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: 'var(--cv-color, #2563eb)' }}>
        Professional Summary
      </h2>
      <div
        contentEditable
        suppressContentEditableWarning
        onBlur={handleBlur}
        data-placeholder="Click to add your professional summary..."
        dangerouslySetInnerHTML={{ __html: content || "" }}
        style={{
          fontSize: '16px',
          lineHeight: '1.6',
          color: '#374151',
          outline: 'none',
          minHeight: '60px',
          padding: '8px',
          borderRadius: '4px',
          cursor: 'text',
        }}
        className="editable-summary"
      />

      <style jsx>{`
        .editable-summary:hover {
          background-color: #f3f4f6;
        }
        
        .editable-summary:focus {
          background-color: #dbeafe;
          border: 1px solid #3b82f6;
        }
        
        .editable-summary:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          font-style: italic;
        }
      `}</style>
    </div>
  );
}

