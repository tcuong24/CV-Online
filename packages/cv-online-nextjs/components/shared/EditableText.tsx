import { useEffect, useRef, useState } from 'react';

interface EditableTextProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  multiline?: boolean;
  className?: string;
}

export function EditableText({
  value,
  onChange,
  placeholder = 'Nhập...',
  multiline = false,
  className = '',
}: EditableTextProps) {
  const [text, setText] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const contentEditableRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (value !== text && !isFocused) {
      setText(value);
      if (contentEditableRef.current) {
        contentEditableRef.current.innerText = value;
      }
    }
  }, [value, text, isFocused]);

  const handleBlur = (e: React.FocusEvent<HTMLSpanElement>) => {
    setIsFocused(false);
    const newText = e.currentTarget.innerText.trim();
    if (newText !== value) {
      onChange(newText);
    }
    setText(newText);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (!multiline && e.key === 'Enter') {
      e.preventDefault();
      e.currentTarget.blur();
    }
  };

  return (
    <span
      ref={contentEditableRef}
      contentEditable
      suppressContentEditableWarning
      onFocus={(e) => {
        setIsFocused(true);
      }}
      onBlur={handleBlur}
      onInput={(e) => setText(e.currentTarget.innerText)}
      onKeyDown={handleKeyDown}
      className={`editable-text ${className}`}
      style={{
        outline: 'none',
        display: multiline ? 'block' : 'inline-block',
        minWidth: '2rem',
        borderBottom: isFocused ? '1px dashed #ccc' : '1px dashed transparent',
        transition: 'border-bottom 0.2s',
        whiteSpace: multiline ? 'pre-wrap' : 'pre',
        wordBreak: 'break-word',
      }}
      data-placeholder={placeholder}
      data-empty={!text || text.trim() === '' || text === '\n' || text === '<br>' ? 'true' : undefined}
      onMouseEnter={(e) => {
        if (!isFocused) e.currentTarget.style.borderBottom = '1px dashed #e5e7eb';
      }}
      onMouseLeave={(e) => {
        if (!isFocused) e.currentTarget.style.borderBottom = '1px dashed transparent';
      }}
    >
      {value}
    </span>
  );
}
