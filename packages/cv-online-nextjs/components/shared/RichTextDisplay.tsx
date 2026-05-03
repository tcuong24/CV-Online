import React from 'react';
import DOMPurify from 'isomorphic-dompurify';

interface RichTextDisplayProps {
  content: string;
  className?: string;
  style?: React.CSSProperties;
}

export function RichTextDisplay({ content, className = '', style }: RichTextDisplayProps) {
  const sanitizedContent = DOMPurify.sanitize(content || '');

  return (
    <div
      className={`rich-text-display ${className}`}
      style={{
        ...style,
        wordBreak: 'break-word',
      }}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
}
