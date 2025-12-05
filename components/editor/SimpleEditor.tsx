/**
 * Simple Editor - Minimal Viable Replacement for High Key Launch
 * Computational Design Compendium - Launch-Ready Solution
 *
 * CONCEPTUAL APPROACH: Clean, functional editing while preserving
 * the architectural foundation for premium editor integration later.
 */

import React, { useState, useCallback } from 'react';
import { Save, Sparkles, Image as ImageIcon, Type, Bold, Italic, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

interface SimpleEditorProps {
  initialContent?: string;
  placeholder?: string;
  onContentChange?: (content: string) => void;
  onSave?: (content: string) => Promise<void>;
  onEnhance?: (content: string) => Promise<string>;
  readOnly?: boolean;
  brandValidationEnabled?: boolean;
  assetDraggingEnabled?: boolean;
}

export const SimpleEditor: React.FC<SimpleEditorProps> = ({
  initialContent = '',
  placeholder = "Start creating your masterpiece...",
  onContentChange,
  onSave,
  onEnhance,
  readOnly = false,
  brandValidationEnabled = false,
  assetDraggingEnabled = false
}) => {
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [textSelection, setTextSelection] = useState({ start: 0, end: 0 });

  // Content update handler (preserves architectural pattern)
  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);
    onContentChange?.(newContent);
  }, [onContentChange]);

  // Save handler (maintains same API as Atlassian editor)
  const handleSave = async () => {
    if (!onSave) return;
    setIsSaving(true);
    try {
      await onSave(content);
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Enhancement handler (connects to computational intelligence)
  const handleEnhance = async () => {
    if (!onEnhance) return;
    setIsEnhancing(true);
    try {
      const enhanced = await onEnhance(content);
      setContent(enhanced);
      onContentChange?.(enhanced);
    } catch (error) {
      console.error('Enhancement failed:', error);
    } finally {
      setIsEnhancing(false);
    }
  };

  // Text formatting (minimal once Richardson functionality)
  const formatText = (command: string) => {
    const textarea = document.getElementById('simple-editor-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    let formattedText = selectedText;

    switch (command) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'heading':
        formattedText = `# ${selectedText}`;
        break;
    }

    const newContent = content.substring(0, start) + formattedText + content.substring(end);
    setContent(newContent);
    onContentChange?.(newContent);
  };

  return (
    <div className="h-full bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
      {/* Toolbar - Minimal but functional */}
      <div className="h-14 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          {brandValidationEnabled && (
            <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
              <Type size={12} />
              Brand Aware
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Basic formatting buttons */}
          <button
            onClick={() => formatText('bold')}
            className="p-2 rounded hover:bg-white transition-colors"
            title="Bold"
          >
            <Bold size={16} className="text-gray-600" />
          </button>
          <button
            onClick={() => formatText('italic')}
            className="p-2 rounded hover:bg-white transition-colors"
            title="Italic"
          >
            <Italic size={16} className="text-gray-600" />
          </button>

          <div className="w-px h-4 bg-gray-200 mx-2"></div>

          <button
            onClick={handleEnhance}
            disabled={isEnhancing}
            className="px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center gap-2 text-sm"
          >
            {isEnhancing ? (
              <>
                <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                Enhancing...
              </>
            ) : (
              <>
                <Sparkles size={14} />
                AI Enhance
              </>
            )}
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-3 py-1.5 bg-gray-900 text-white rounded hover:bg-black transition-colors disabled:opacity-50 flex items-center gap-2 text-sm"
          >
            {isSaving ? (
              <>
                <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <Save size={14} />
                Save
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor Surface */}
      <div className="flex-1 relative">
        <textarea
          id="simple-editor-textarea"
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder={placeholder}
          readOnly={readOnly}
          className="w-full h-full px-6 py-4 resize-none border-0 outline-none bg-transparent font-mono text-sm leading-8 text-gray-800 placeholder-gray-400"
          style={{ minHeight: '400px' }}
          onSelect={(e) => {
            const target = e.target as HTMLTextAreaElement;
            setTextSelection({
              start: target.selectionStart,
              end: target.selectionEnd
            });
          }}
        />

        {/* Asset Drop Zone Overlay */}
        {assetDraggingEnabled && (
          <div className="absolute inset-0 border-2 border-dashed border-gray-300 bg-gray-50/50 opacity-0 hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center pointer-events-none">
            <ImageIcon size={48} className="text-gray-400 mb-4" />
            <p className="text-gray-600 font-medium">Drop assets here to embed</p>
          </div>
        )}
      </div>

      {/* Status Bar - Computational Awareness */}
      <div className="h-8 border-t border-gray-100 bg-gray-50/30 flex items-center justify-between px-4 text-xs text-gray-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Type size={10} />
            {content.length} characters
          </span>
          <span className="flex items-center gap-1">
            <ImageIcon size={10} />
            Context injection ready
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          Computational intelligence active
        </div>
      </div>
    </div>
  );
};

export default SimpleEditor;
