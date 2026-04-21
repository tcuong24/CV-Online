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
      return;
    }

    if (multiline && e.key === 'Enter') {
      e.preventDefault();
      const el = e.currentTarget;
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) {
        document.execCommand('insertText', false, '\n');
        return;
      }

      // Delete any selected text first
      if (!sel.isCollapsed) document.execCommand('delete', false);

      const range = sel.getRangeAt(0);
      // Get text from start of element to cursor
      const preRange = document.createRange();
      preRange.selectNodeContents(el);
      preRange.setEnd(range.endContainer, range.endOffset);
      const beforeCursor = preRange.toString();

      const lineStart = beforeCursor.lastIndexOf('\n') + 1;
      const currentLine = beforeCursor.slice(lineStart);

      const bulletMatch = currentLine.startsWith('\u2022 ');
      const numberedMatch = currentLine.match(/^(\d+)\. /);

      if (bulletMatch) {
        const content = currentLine.slice(2); // text after "• "
        if (!content.trim()) {
          // Empty bullet → exit list: remove "• " then add plain newline
          const delRange = sel.getRangeAt(0).cloneRange();
          try {
            delRange.setStart(delRange.startContainer, delRange.startOffset - 2);
            sel.removeAllRanges();
            sel.addRange(delRange);
          } catch { /* offset edge case, skip */ }
          document.execCommand('insertText', false, '\n');
        } else {
          document.execCommand('insertText', false, '\n\u2022 ');
        }
      } else if (numberedMatch) {
        const num = parseInt(numberedMatch[1]);
        const content = currentLine.slice(numberedMatch[0].length);
        if (!content.trim()) {
          // Empty numbered → exit list
          const len = numberedMatch[0].length;
          const delRange = sel.getRangeAt(0).cloneRange();
          try {
            delRange.setStart(delRange.startContainer, delRange.startOffset - len);
            sel.removeAllRanges();
            sel.addRange(delRange);
          } catch { /* offset edge case, skip */ }
          document.execCommand('insertText', false, '\n');
        } else {
          document.execCommand('insertText', false, `\n${num + 1}. `);
        }
      } else {
        document.execCommand('insertText', false, '\n');
      }
    }
  };

  return (
    <span
      ref={contentEditableRef}
      contentEditable
      spellCheck="false"
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
