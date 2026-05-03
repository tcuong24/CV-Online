import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import BubbleMenuExtension from '@tiptap/extension-bubble-menu';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  Link as LinkIcon, 
  X, 
  Check,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered
} from 'lucide-react';

interface EditableTextProps {
  value: string;
  onChange?: (val: string) => void;
  placeholder?: string;
  multiline?: boolean;
  className?: string;
  scale?: number;
  style?: React.CSSProperties;
}

export function EditableText({
  value,
  onChange = () => {},
  placeholder = 'Nhập...',
  multiline = false,
  className = '',
  scale = 1,
  style = {},
}: EditableTextProps) {
  const [isFocused, setIsFocused] = useState(false);
  
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: multiline ? {} : false,
        bulletList: multiline ? {} : false,
        orderedList: multiline ? {} : false,
      }),
      Underline,
      BubbleMenuExtension.configure({
        element: null,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 underline cursor-pointer',
        },
      }),
      Placeholder.configure({
        placeholder: placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: `outline-none focus:outline-none ${className} ${multiline ? 'is-multiline' : 'is-single-line'}`,
        spellcheck: 'false',
      },
      handleKeyDown: (view, event) => {
        if (!multiline && event.key === 'Enter') {
          event.preventDefault();
          return true;
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      const content = multiline ? editor.getHTML() : editor.getText();
      const cleanContent = editor.isEmpty ? '' : content;
      onChange(cleanContent);
    },
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML() && !editor.isFocused) {
      editor.commands.setContent(value || '', { emitUpdate: false });
    }
  }, [value, editor]);

  const [isLinkInputOpen, setIsLinkInputOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  const setLink = useCallback(() => {
    if (!editor) return;
    if (linkUrl === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
    }
    setIsLinkInputOpen(false);
    setLinkUrl('');
  }, [editor, linkUrl]);

  if (!editor) return null;

  return (
    <div 
      className={`editable-wrapper ${className}`}
      style={{
        display: multiline ? 'block' : 'inline-block',
        position: 'relative',
        width: multiline ? '100%' : 'auto',
        verticalAlign: 'top',
        lineHeight: 'inherit',
        ...style,
      }}
    >
      <div 
        className="editable-container"
        style={{
          borderBottom: isFocused ? '1px dashed #3b82f6' : '1px dashed transparent',
          transition: 'border-color 0.2s',
          minHeight: '1.2em',
          textAlign: 'inherit',
        }}
        onMouseEnter={(e) => {
          if (!isFocused) e.currentTarget.style.borderBottomColor = '#e5e7eb';
        }}
        onMouseLeave={(e) => {
          if (!isFocused) e.currentTarget.style.borderBottomColor = 'transparent';
        }}
      >
        {multiline && (
          <BubbleMenu 
            editor={editor} 
            options={{ placement: 'top' }}
          >
            <div className="flex items-center gap-1 bg-[#1e293b] text-white p-1.5 rounded-xl shadow-2xl border border-white/20 backdrop-blur-md" style={{ transform: `scale(${0.9 / scale})`, transformOrigin: 'bottom' }}>
              {!isLinkInputOpen ? (
                <>
                  <button onClick={() => editor.chain().focus().toggleBold().run()} className={`p-1.5 rounded-lg hover:bg-white/10 transition-all ${editor.isActive('bold') ? 'text-blue-400 bg-white/15' : ''}`}><Bold size={15} /></button>
                  <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-1.5 rounded-lg hover:bg-white/10 transition-all ${editor.isActive('italic') ? 'text-blue-400 bg-white/15' : ''}`}><Italic size={15} /></button>
                  <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={`p-1.5 rounded-lg hover:bg-white/10 transition-all ${editor.isActive('underline') ? 'text-blue-400 bg-white/15' : ''}`}><UnderlineIcon size={15} /></button>
                  
                  <div className="w-[1px] h-4 bg-white/20 mx-1" />
                  
                  <button onClick={() => editor.chain().focus().setTextAlign('left').run()} className={`p-1.5 rounded-lg hover:bg-white/10 transition-all ${editor.isActive({ textAlign: 'left' }) ? 'text-blue-400 bg-white/15' : ''}`}><AlignLeft size={15} /></button>
                  <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className={`p-1.5 rounded-lg hover:bg-white/10 transition-all ${editor.isActive({ textAlign: 'center' }) ? 'text-blue-400 bg-white/15' : ''}`}><AlignCenter size={15} /></button>
                  <button onClick={() => editor.chain().focus().setTextAlign('right').run()} className={`p-1.5 rounded-lg hover:bg-white/10 transition-all ${editor.isActive({ textAlign: 'right' }) ? 'text-blue-400 bg-white/15' : ''}`}><AlignRight size={15} /></button>
                  
                  <div className="w-[1px] h-4 bg-white/20 mx-1" />
                  
                  <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-1.5 rounded-lg hover:bg-white/10 transition-all ${editor.isActive('bulletList') ? 'text-blue-400 bg-white/15' : ''}`}><List size={15} /></button>
                  <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`p-1.5 rounded-lg hover:bg-white/10 transition-all ${editor.isActive('orderedList') ? 'text-blue-400 bg-white/15' : ''}`}><ListOrdered size={15} /></button>
                  
                  <div className="w-[1px] h-4 bg-white/20 mx-1" />
                  
                  <button onClick={() => { setLinkUrl(editor.getAttributes('link').href || ''); setIsLinkInputOpen(true); }} className={`p-1.5 rounded-lg hover:bg-white/10 transition-all ${editor.isActive('link') ? 'text-blue-400 bg-white/15' : ''}`}><LinkIcon size={15} /></button>
                </>
              ) : (
                <div className="flex items-center gap-1 px-2 py-0.5">
                  <input autoFocus type="text" placeholder="https://..." value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && setLink()} className="bg-transparent border-none outline-none text-xs w-40 text-white placeholder-white/30" />
                  <button onClick={setLink} className="p-1 hover:text-blue-400 transition-colors"><Check size={14} /></button>
                  <button onClick={() => setIsLinkInputOpen(false)} className="p-1 hover:text-red-400 transition-colors"><X size={14} /></button>
                </div>
              )}
            </div>
          </BubbleMenu>
        )}

        <EditorContent editor={editor} style={{ textAlign: 'inherit' }} />
      </div>
      
      <style jsx global>{`
        .ProseMirror { 
          outline: none; 
          text-align: inherit;
          min-width: 1px;
          line-height: inherit;
          white-space: pre-wrap;
          word-wrap: break-word;
        }
        
        .ProseMirror.is-single-line, 
        .ProseMirror.is-single-line p {
          display: inline !important;
        }

        .ProseMirror.is-multiline p {
          margin: 0;
          display: block;
          min-height: 1.2em;
          line-height: 1.6;
        }

        .ProseMirror.is-editor-empty:before {
          content: attr(data-placeholder);
          position: absolute;
          left: 0;
          top: 0;
          color: #a8a29e;
          opacity: 0.6;
          font-style: italic;
          pointer-events: none;
          white-space: nowrap;
          line-height: inherit;
        }

        .ProseMirror ul { list-style-type: disc; padding-left: 1.5rem; margin: 0.5rem 0; }
        .ProseMirror ol { list-style-type: decimal; padding-left: 1.5rem; margin: 0.5rem 0; }
        .ProseMirror li p { display: block !important; }
      `}</style>
    </div>
  );
}
