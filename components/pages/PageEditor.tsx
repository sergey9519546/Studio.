/**
 * PageEditor Component
 * 
 * Full-page Atlassian Editor with:
 * - 850px width constraint
 * - Sticky toolbar
 * - Slash commands (quickInsert)
 * - Custom media proxy integration (GCS-backed via /api/v1)
 * - Custom mention/emoji providers
 * - Save functionality
 */

import type { EditorActions } from '@atlaskit/editor-core';
import { Editor } from "@atlaskit/editor-core";
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
// Providers (auth/session handled by the backend proxy)
import createEmojiProvider from "../../services/providers/CustomEmojiProvider";
import { mediaConfig } from "../../services/providers/CustomMediaProvider";
import createMentionProvider from "../../services/providers/CustomMentionProvider";

export interface PageEditorProps {
  pageId?: string;
  initialTitle?: string;
  initialContent?: any; // ADF (Atlassian Document Format)
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
  const [editorActions, setEditorActions] = useState<EditorActions | null>(
    null
  );

  /**
   * Handle Save Button Click
   */
  const handleSave = useCallback(async () => {
    if (!editorActions || isSaving) return;

    setIsSaving(true);
    try {
      const content = await editorActions.getValue();

      if (onSave) {
        await onSave(title, content);
      }

      console.log("Page saved:", { title, pageId });
    } catch (error) {
      console.error("Failed to save page:", error);
    } finally {
      setIsSaving(false);
    }
  }, [editorActions, title, pageId, onSave, isSaving]);

  /**
   * Handle Publish Button Click
   */
  const handlePublish = useCallback(async () => {
    if (!editorActions || isSaving) return;

    setIsSaving(true);
    try {
      const content = await editorActions.getValue();

      if (onPublish) {
        await onPublish(title, content);
      }

      console.log("Page published:", { title, pageId });
    } catch (error) {
      console.error("Failed to publish page:", error);
    } finally {
      setIsSaving(false);
    }
  }, [editorActions, title, pageId, onPublish, isSaving]);

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

  /**
   * Store editor actions when editor mounts
   */
  const handleEditorReady = (actions: EditorActions) => {
    setEditorActions(actions);
  };

  return (
    <AppViewport onKeyDown={handleKeyDown}>
      <PagePaper>
        {/* Primary Toolbar - Save/Publish buttons */}
        <PrimaryToolbar>
          <StatusBadge status={status}>{status}</StatusBadge>
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

        {/* The Atlassian Editor */}
        <EditorWrapper>
          <Editor
            // Appearance
            appearance="full-page"
            // Initial content (ADF format)
            defaultValue={initialContent}
            // Editor actions callback
            onEditorReady={handleEditorReady}
            // Quick Insert (slash commands)
            quickInsert={true}
            // Providers for media/mentions/emojis through our /api/v1 proxy
            mentionProvider={createMentionProvider()}
            emojiProvider={createEmojiProvider()}
            media={mediaConfig}
            // Features - using object configs to avoid type errors
            allowTables={{ advanced: true }}
            allowPanel={true}
            allowDate={true}
            allowStatus={true}
            allowRule={true}
            allowLayouts={{ allowBreakout: true }}
            allowTextAlignment={true}
            allowIndentation={true}
            allowTextColor={true}
            allowHelpDialog={true}
            // Code blocks
            codeBlock={{ allowCopyToClipboard: true }}
            // Placeholder
            placeholder="Start typing, or press '/' for commands..."
          />
        </EditorWrapper>
      </PagePaper>
    </AppViewport>
  );
};

export default PageEditor;
