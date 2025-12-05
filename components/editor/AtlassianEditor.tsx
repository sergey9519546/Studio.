/**
 * Simple Text Editor - Fallback for Atlassian Editor
 * Using basic textarea instead of problematic Atlassian packages
 */

import React, { useState, useEffect } from 'react';

interface AtlassianCreativeEditorProps {
  initialContent?: string;
  onContentChange?: (content: string) => void;
  projectId?: string;
  projectContext?: any;
  onSave?: (content: string) => Promise<void>;
  onEnhance?: (currentContent: string) => Promise<string>;
  placeholder?: string;
}

export const AtlassianCreativeEditor: React.FC<AtlassianCreativeEditorProps> = ({
  initialContent = '',
  onContentChange,
  projectId,
  onSave,
  onEnhance,
  placeholder = "Start creating your masterpiece..."
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [currentContent, setCurrentContent] = useState(initialContent);

  useEffect(() => {
    setCurrentContent(initialContent);
  }, [initialContent]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    setCurrentContent(content);
    onContentChange?.(content);
  };

  const handleSave = async () => {
    if (!onSave) return;
    setIsSaving(true);
    try {
      await onSave(currentContent);
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEnhance = async () => {
    if (!onEnhance || !currentContent) return;
    setIsEnhancing(true);
    try {
      const enhancedContent = await onEnhance(currentContent);
      setCurrentContent(enhancedContent);
      onContentChange?.(enhancedContent);
    } catch (error) {
      console.error('Enhancement failed:', error);
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: 'white',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      overflow: 'hidden'
    }}>
      {/* ENHANCED TOOLBAR */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 12px',
        borderBottom: '1px solid #e2e8f0',
        background: '#f8fafc'
      }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={handleSave}
            disabled={isSaving}
            style={{
              padding: '8px 16px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isSaving ? 'not-allowed' : 'pointer'
            }}
          >
            {isSaving ? 'Saving...' : 'Save Draft'}
          </button>

          <button
            onClick={handleEnhance}
            disabled={isEnhancing || !currentContent.trim()}
            style={{
              padding: '8px 16px',
              background: 'transparent',
              color: '#64748b',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              cursor: (isEnhancing || !currentContent.trim()) ? 'not-allowed' : 'pointer'
            }}
          >
            {isEnhancing ? 'Enhancing...' : 'AI Enhance'}
          </button>
        </div>
      </div>

      {/* TEXT EDITOR */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <textarea
          value={currentContent}
          onChange={handleContentChange}
          placeholder={placeholder}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            outline: 'none',
            padding: '16px',
            fontSize: '16px',
            lineHeight: '1.6',
            background: 'white',
            resize: 'none'
          }}
        />
      </div>

      {/* STATUS INDICATOR */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 12px',
        borderTop: '1px solid #e2e8f0',
        background: '#f8fafc',
        fontSize: '12px',
        color: '#64748b'
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          background: '#22c55e',
          borderRadius: '50%',
          animation: 'pulse 2s infinite'
        }} />
        Creative intelligence active
      </div>
    </div>
  );
};

export default AtlassianCreativeEditor;
