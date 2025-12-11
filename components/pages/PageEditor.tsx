/**
 * PageEditor Component
 *
 * Simple TipTap Editor with:
 * - Basic editing functionality
 * - Save functionality
 */

import Bold from '@tiptap/extension-bold';
import Document from '@tiptap/extension-document';
import Italic from '@tiptap/extension-italic';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import { EditorContent, useEditor } from '@tiptap/react';
import React, { useCallback, useState } from 'react';

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

export interface PageEditorProps {
  pageId?: string;
  initialTitle?: string;
  initialContent?: any;
  status?: 'draft' | 'published' | 'archived';
  onSave?: (title: string, content: any) => Promise<void>;
  onPublish?: (title: string, content: any) => Promise<void>;
}

export const PageEditor: React.FC<PageEditorProps> = ({
  pageId,
  initialTitle = "",
  initialContent,
  status = "draft",
  onSave,
  onPublish,
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [isSaving, setIsSaving] = useState(false);

  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Bold,
      Italic,
    ],
    content: initialContent || '<p>Start typing...</p>',
  });

  /**
   * Handle Save Button Click
   */
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

  /**
   * Handle Publish Button Click
   */
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

  /**
   * Keyboard shortcut for save (Cmd/Ctrl + S)
   */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    },
    [handleSave]
  );

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

        {/* The TipTap Editor */}
        <EditorWrapper>
          <EditorContent editor={editor} />
        </EditorWrapper>
      </PagePaper>
    </AppViewport>
  );
};

export default PageEditor;
