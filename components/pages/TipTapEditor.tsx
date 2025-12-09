/**
 * TipTapEditor Component
 *
 * Modern replacement for Atlaskit Editor using TipTap
 * Features:
 * - Rich text editing with TipTap
 * - Mention support
 * - Image uploads
 * - Table support
 * - Customizable toolbar
 * - Keyboard shortcuts
 */

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Mention from '@tiptap/extension-mention';
import Image from '@tiptap/extension-image';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Picker } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';

// Styled components
import {
  AppViewport,
  EditorWrapper,
  PageHeader,
  PagePaper,
  PageTitleInput,
  PrimaryToolbar,
  SaveButton,
  StatusBadge,
} from "./PageEditor.styles";

// Custom providers
import createMentionProvider from "../../services/providers/CustomMentionProvider";
import { mediaConfig } from "../../services/providers/CustomMediaProvider";

export interface TipTapEditorProps {
  pageId?: string;
  initialTitle?: string;
  initialContent?: any;
  status?: 'draft' | 'published' | 'archived';
  onSave?: (title: string, content: any) => Promise<void>;
  onPublish?: (title: string, content: any) => Promise<void>;
}

export const TipTapEditor: React.FC<TipTapEditorProps> = ({
  pageId,
  initialTitle = "",
  initialContent,
  status = "draft",
  onSave,
  onPublish,
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [isSaving, setIsSaving] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [editorContent, setEditorContent] = useState(initialContent || '');
  const [mentionQuery, setMentionQuery] = useState('');
  const [mentionItems, setMentionItems] = useState<any[]>([]);

  // Initialize TipTap editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Mention.configure({
        HTMLAttributes: {
          class: 'mention',
        },
        suggestion: {
          items: ({ query }) => {
            // Handle mention suggestions
            if (query) {
              // In a real implementation, you would fetch users from your API
              // For now, return mock data
              return [
                { id: '1', label: 'John Doe' },
                { id: '2', label: 'Jane Smith' },
                { id: '3', label: 'Bob Johnson' },
              ];
            }
            return [];
          },
          render: () => {
            // Custom render for mention suggestions
            let component: HTMLDivElement | null = null;
            let popup: any | null = null;

            return {
              onStart: (props) => {
                component = document.createElement('div');
                component.className = 'mention-suggestion-popup';

                // Position the popup
                const rect = props.clientRect();
                component.style.position = 'absolute';
                component.style.left = `${rect.left}px`;
                component.style.top = `${rect.top}px`;
                component.style.zIndex = '1000';
                component.style.background = 'white';
                component.style.border = '1px solid #ccc';
                component.style.borderRadius = '4px';
                component.style.padding = '8px';
                component.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';

                // Add items to popup
                props.items.forEach((item: any) => {
                  const itemElement = document.createElement('div');
                  itemElement.textContent = item.label;
                  itemElement.style.padding = '4px 8px';
                  itemElement.style.cursor = 'pointer';
                  itemElement.onclick = () => {
                    props.command({ id: item.id, label: item.label });
                  };
                  component?.appendChild(itemElement);
                });

                document.body.appendChild(component);
              },
              onUpdate: (props) => {
                if (!component) return;

                // Update position
                const rect = props.clientRect();
                component.style.left = `${rect.left}px`;
                component.style.top = `${rect.top}px`;

                // Update items
                while (component.firstChild) {
                  component.removeChild(component.firstChild);
                }

                props.items.forEach((item: any) => {
                  const itemElement = document.createElement('div');
                  itemElement.textContent = item.label;
                  itemElement.style.padding = '4px 8px';
                  itemElement.style.cursor = 'pointer';
                  itemElement.onclick = () => {
                    props.command({ id: item.id, label: item.label });
                  };
                  component?.appendChild(itemElement);
                });
              },
              onExit: () => {
                if (component) {
                  document.body.removeChild(component);
                  component = null;
                }
              },
            };
          },
        },
      }),
      Image.configure({
        // Allow base64 images and external URLs
        allowBase64: true,
        HTMLAttributes: {
          class: 'tiptap-image',
        },
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    content: editorContent,
    onUpdate: ({ editor }) => {
      setEditorContent(editor.getHTML());
    },
  });

  // Handle image uploads
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
    },
    onDrop: async (acceptedFiles) => {
      if (editor && acceptedFiles.length > 0) {
        const file = acceptedFiles[0];

        // Read file as base64
        const reader = new FileReader();
        reader.onload = () => {
          const base64String = reader.result as string;
          editor.chain().focus().setImage({ src: base64String }).run();
        };
        reader.readAsDataURL(file);
      }
    },
    noClick: true,
    noKeyboard: true,
  });

  // Handle save
  const handleSave = useCallback(async () => {
    if (!editor || isSaving) return;

    setIsSaving(true);
    try {
      const content = editor.getHTML();

      if (onSave) {
        await onSave(title, content);
      }

      console.log("Page saved:", { title, pageId });
    } catch (error) {
      console.error("Failed to save page:", error);
    } finally {
      setIsSaving(false);
    }
  }, [editor, title, pageId, onSave, isSaving]);

  // Handle publish
  const handlePublish = useCallback(async () => {
    if (!editor || isSaving) return;

    setIsSaving(true);
    try {
      const content = editor.getHTML();

      if (onPublish) {
        await onPublish(title, content);
      }

      console.log("Page published:", { title, pageId });
    } catch (error) {
      console.error("Failed to publish page:", error);
    } finally {
      setIsSaving(false);
    }
  }, [editor, title, pageId, onPublish, isSaving]);

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      } else if ((e.metaKey || e.ctrlKey) && e.key === "e") {
        e.preventDefault();
        setShowEmojiPicker(!showEmojiPicker);
      }
    },
    [handleSave, showEmojiPicker]
  );

  // Insert emoji
  const handleEmojiSelect = (emoji: any) => {
    if (editor) {
      editor.chain().focus().insertContent(emoji.native).run();
    }
    setShowEmojiPicker(false);
  };

  // Add image from URL
  const addImageFromUrl = () => {
    const url = prompt('Enter image URL:');
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  // Editor toolbar buttons
  const toolbarButtons = [
    { name: 'bold', icon: 'B', action: () => editor?.chain().focus().toggleBold().run() },
    { name: 'italic', icon: 'I', action: () => editor?.chain().focus().toggleItalic().run() },
    { name: 'heading', icon: 'H', action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run() },
    { name: 'bulletList', icon: '•', action: () => editor?.chain().focus().toggleBulletList().run() },
    { name: 'orderedList', icon: '1.', action: () => editor?.chain().focus().toggleOrderedList().run() },
    { name: 'image', icon: '🖼️', action: addImageFromUrl },
    { name: 'table', icon: '□', action: () => editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run() },
    { name: 'emoji', icon: '😀', action: () => setShowEmojiPicker(!showEmojiPicker) },
  ];

  return (
    <AppViewport onKeyDown={handleKeyDown}>
      <PagePaper>
        {/* Primary Toolbar - Save/Publish buttons */}
        <PrimaryToolbar>
          <StatusBadge status={status}>{status}</StatusBadge>
          {/* eslint-disable-next-line react/forbid-component-props -- flex spacer */}
          <div style={{ flex: 1 }}></div>
          <SaveButton onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save"}
          </SaveButton>
          {status === "draft" && (
            <SaveButton
              onClick={handlePublish}
              disabled={isSaving}
              style={{ backgroundColor: "#00875A" }}
            >
              Publish
            </SaveButton>
          )}
        </PrimaryToolbar>

        {/* Page Title */}
        <PageHeader>
          <PageTitleInput
            type="text"
            placeholder="Untitled page..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus={!initialTitle}
          />
        </PageHeader>

        {/* Emoji Picker (floating) */}
        {showEmojiPicker && (
          <div style={{
            position: 'absolute',
            right: '20px',
            top: '150px',
            zIndex: 1000,
            background: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            overflow: 'hidden'
          }}>
            <Picker
              onSelect={handleEmojiSelect}
              style={{ width: '320px', height: '400px' }}
              theme="light"
            />
          </div>
        )}

        {/* Editor Toolbar */}
        <div style={{
          display: 'flex',
          gap: '8px',
          padding: '8px',
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb',
          borderRadius: '8px 8px 0 0',
          marginBottom: '8px'
        }}>
          {toolbarButtons.map((button) => (
            <button
              key={button.name}
              onClick={(e) => {
                e.preventDefault();
                button.action();
              }}
              style={{
                padding: '6px 10px',
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '32px'
              }}
              title={button.name}
            >
              {button.icon}
            </button>
          ))}
        </div>

        {/* The TipTap Editor */}
        <EditorWrapper>
          <div {...getRootProps()} style={{ outline: 'none' }}>
            <input {...getInputProps()} />
            <EditorContent
              editor={editor}
              style={{
                outline: 'none',
                minHeight: '500px',
                padding: '16px',
                borderRadius: '8px',
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb'
              }}
            />
          </div>
        </EditorWrapper>
      </PagePaper>
    </AppViewport>
  );
};

export default TipTapEditor;
