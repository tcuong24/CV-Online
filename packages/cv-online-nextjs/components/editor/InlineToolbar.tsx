import React from 'react';
import { MdFormatBold, MdFormatItalic, MdFormatUnderlined, MdClose } from 'react-icons/md';

interface InlineToolbarProps {
  position: { x: number; y: number };
  onFormat: (format: string, value?: string) => void;
  onClose: () => void;
}

export const InlineToolbar: React.FC<InlineToolbarProps> = ({ position, onFormat, onClose }) => {
  return (
    <div
      className="absolute bg-white shadow-lg rounded-md border border-gray-200 p-1 flex items-center space-x-1 z-50 text-gray-700"
      style={{
        left: position.x + 'px',
        top: position.y - 45 + 'px',
        transform: 'translateX(-50%)',
      }}
    >
      <button
        onClick={() => onFormat('bold')}
        className="p-1.5 hover:bg-gray-100 rounded text-sm hover:text-black"
        title="Bold"
      >
        <MdFormatBold size={16} />
      </button>
      <button
        onClick={() => onFormat('italic')}
        className="p-1.5 hover:bg-gray-100 rounded text-sm hover:text-black"
        title="Italic"
      >
        <MdFormatItalic size={16} />
      </button>
      <button
        onClick={() => onFormat('underline')}
        className="p-1.5 hover:bg-gray-100 rounded text-sm hover:text-black"
        title="Underline"
      >
        <MdFormatUnderlined size={16} />
      </button>
      <div className="w-px h-4 bg-gray-300 mx-1 border-r border-gray-300" />
      <button
        onClick={onClose}
        className="p-1.5 hover:bg-red-50 text-red-500 rounded text-sm hover:text-red-600"
        title="Close"
      >
        <MdClose size={16} />
      </button>
    </div>
  );
};
