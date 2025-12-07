/**
 * PageEditor Component
 * 
 * Full-page Atlassian Editor with:
 * - 850px width constraint
 * - Sticky toolbar
 * - Slash commands (quickInsert)
 * - Custom S3 media integration
 * - Custom mention/emoji providers
 * - Save functionality via EditorContext
 * 
 * Architecture follows the document's AppViewport → PagePaper → EditorContext pattern
 */

import type { EditorActions } from '@atlaskit/editor-core';
import { Editor, EditorContext, WithEditorActions } from '@atlaskit/editor-core';
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
} from './PageEditor.styles';

// Custom providers
import createEmojiProvider from '../../services/providers/CustomEmojiProvider';
import { mediaConfig } from '../../services/providers/CustomMediaProvider';
import createMentionProvider from '../../services/providers/CustomMentionProvider';

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
  initialTitle = '',
  initialContent,
  status = 'draft',
  onSave,
  onPublish,
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [isSaving, setIsSaving] = useState(false);
  const [editorActions, setEditorActions] = useState<EditorActions | null>(null);

  /**
   * Handle Save Button Click
   * Extracts ADF content and calls the onSave callback
   */
  const handleSave = useCallback(async () => {
    if (!editorActions || isSaving) return;

    setIsSaving(true);
    try {
      // Extract ADF content from editor
      const content = await editorActions.getValue();
      
      // Call save callback
      if (onSave) {
        await onSave(title, content);
      }
      
      console.log('Page saved:', { title, content });
    } catch (error) {
      console.error('Failed to save page:', error);
      // TODO: Show error toast
    } finally {
      setIsSaving(false);
    }
  }, [editorActions, title, onSave, isSaving]);

  /**
   * Handle Publish Button Click
   * Similar to save but changes status to published
   */
  const handlePublish = useCallback(async () => {
    if (!editorActions || isSaving) return;

    setIsSaving(true);
    try {
      const content = await editorActions.getValue();
      
      if (onPublish) {
        await onPublish(title, content);
      }
      
      console.log('Page published:', { title, content });
    } catch (error) {
      console.error('Failed to publish page:', error);
    } finally {
      setIsSaving(false);
    }
  }, [editorActions, title, onPublish, isSaving]);

  /**
   * Keyboard shortcut for save (Cmd/Ctrl + S)
   */
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 's') {
      e.preventDefault();
      handleSave();
    }
  }, [handleSave]);

  return (
    <AppViewport onKeyDown={handleKeyDown}>
      <PagePaper>
        <EditorContext>
          <WithEditorActions
            render={(actions) => {
              // Store actions for save functionality
              if (actions && !editorActions) {
                setEditorActions(actions);
              }

              return (
                <>
                  {/* Primary Toolbar - Save/Publish buttons */}
                  <PrimaryToolbar>
                    <StatusBadge status={status}>{status}</StatusBadge>
                    <div style={{ flex: 1 }} />
                    <SaveButton 
                      onClick={handleSave} 
                      disabled={isSaving}
                    >
                      {isSaving ? 'Saving...' : 'Save'}
                    </SaveButton>
                    {status === 'draft' && (
                      <SaveButton 
                        onClick={handlePublish}
                        disabled={isSaving}
                        style={{ backgroundColor: '#00875A' }}
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
                      
                      // Quick Insert (slash commands)
                      quickInsert={true}
                      
                      // Providers
                      mentionProvider={createMentionProvider()}
                      emojiProvider={createEmojiProvider()}
                      media={mediaConfig}
                      
                      // Features
                      allowTables={{ advanced: true }}
                      allowPanel={true}
                      allowExtension={true}
                      allowExpand={{ allowInsertion: true }}
                      allowDate={true}
                      allowStatus={true}
                      allowRule={true}
                      allowLayouts={{ allowBreakout: true }}
                      allowTextAlignment={true}
                      allowIndentation={true}
                      allowTextColor={true}
                      allowBlockType={true}
                      allowHelpDialog={true}
                      
                      // Code blocks
                      codeBlock={{ allowCopyToClipboard: true }}
                      
                      // Links
                      linking={{ smartLinks: { allowBlockCards: true } }}
                      
                      // Placeholder
                      placeholder="Start typing, or press '/' for commands..."
                      
                      // Save on blur (optional)
                      // onBlur={handleSave}
                      
                      // Analytics (optional)
                      // analyticsHandler={(event) => console.log('Editor event:', event)}
                    />
                  </EditorWrapper>
                </>
              );
            }}
          />
        </EditorContext>
      </PagePaper>
    </AppViewport>
  );
};

export default PageEditor;
