"use client";

import React, { useRef, useState, useEffect } from 'react';
import { 
  Bold, Italic, Underline, Heading1, Heading2, Heading3, 
  List, ListOrdered, Quote, Code, Image as ImageIcon, 
  Link as LinkIcon, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Undo, Redo
} from 'lucide-react';
import { blogService } from '@/services/blogService';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder = "Start writing..." }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Sync value if changed from outside (e.g. form reset or loading existing data)
  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML && document.activeElement !== editorRef.current) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const execCommand = (command: string, value: string | undefined = undefined) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    // Explicitly trigger change
    if (editorRef.current) {
        onChange(editorRef.current.innerHTML);
    }
  };

  const handleFormatBlock = (tag: string) => {
    execCommand('formatBlock', tag);
  };

  const handleInsertLink = () => {
    const url = prompt('Enter the link URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const handleInsertImage = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setIsUploading(true);
      try {
        const url = await blogService.uploadImage(file);
        execCommand('insertImage', url);
      } catch (error) {
        console.error("Failed to upload image:", error);
        alert("Failed to upload image");
      } finally {
        setIsUploading(false);
      }
    };
    input.click();
  };

  const ToolbarButton = ({ 
    icon: Icon, 
    onClick, 
    title,
    disabled = false
  }: { 
    icon: any, 
    onClick: () => void, 
    title: string,
    disabled?: boolean
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2 rounded-md hover:bg-gray-100 transition-colors text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#EC5B13]/20 disabled:opacity-50`}
    >
      <Icon size={18} />
    </button>
  );

  return (
    <div className={`border rounded-2xl overflow-hidden bg-white transition-all ${isFocused ? 'border-[#EC5B13] ring-1 ring-[#EC5B13]' : 'border-gray-200'}`}>
      
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-200 p-2 flex flex-wrap gap-1 sticky top-0 z-10">
        <div className="flex items-center space-x-1 pr-2 border-r border-gray-200">
          <ToolbarButton icon={Undo} onClick={() => execCommand('undo')} title="Undo" />
          <ToolbarButton icon={Redo} onClick={() => execCommand('redo')} title="Redo" />
        </div>

        <div className="flex items-center space-x-1 px-2 border-r border-gray-200">
          <ToolbarButton icon={Bold} onClick={() => execCommand('bold')} title="Bold" />
          <ToolbarButton icon={Italic} onClick={() => execCommand('italic')} title="Italic" />
          <ToolbarButton icon={Underline} onClick={() => execCommand('underline')} title="Underline" />
        </div>

        <div className="flex items-center space-x-1 px-2 border-r border-gray-200">
          <ToolbarButton icon={Heading1} onClick={() => handleFormatBlock('H1')} title="Heading 1" />
          <ToolbarButton icon={Heading2} onClick={() => handleFormatBlock('H2')} title="Heading 2" />
          <ToolbarButton icon={Heading3} onClick={() => handleFormatBlock('H3')} title="Heading 3" />
        </div>

        <div className="flex items-center space-x-1 px-2 border-r border-gray-200">
          <ToolbarButton icon={AlignLeft} onClick={() => execCommand('justifyLeft')} title="Align Left" />
          <ToolbarButton icon={AlignCenter} onClick={() => execCommand('justifyCenter')} title="Align Center" />
          <ToolbarButton icon={AlignRight} onClick={() => execCommand('justifyRight')} title="Align Right" />
          <ToolbarButton icon={AlignJustify} onClick={() => execCommand('justifyFull')} title="Justify" />
        </div>

        <div className="flex items-center space-x-1 px-2 border-r border-gray-200">
          <ToolbarButton icon={List} onClick={() => execCommand('insertUnorderedList')} title="Bullet List" />
          <ToolbarButton icon={ListOrdered} onClick={() => execCommand('insertOrderedList')} title="Numbered List" />
        </div>

        <div className="flex items-center space-x-1 pl-2">
          <ToolbarButton icon={Quote} onClick={() => handleFormatBlock('BLOCKQUOTE')} title="Quote" />
          <ToolbarButton icon={Code} onClick={() => handleFormatBlock('PRE')} title="Code Block" />
          <ToolbarButton icon={LinkIcon} onClick={handleInsertLink} title="Insert Link" />
          <ToolbarButton 
            icon={ImageIcon} 
            onClick={handleInsertImage} 
            title="Insert Image" 
            disabled={isUploading}
          />
          {isUploading && <span className="text-xs text-gray-500 animate-pulse ml-2">Uploading...</span>}
        </div>
      </div>

      {/* Editor Area */}
      <div 
        ref={editorRef}
        contentEditable
        className="min-h-[400px] p-6 focus:outline-none prose max-w-none text-gray-800"
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        suppressContentEditableWarning
      />
    </div>
  );
}
