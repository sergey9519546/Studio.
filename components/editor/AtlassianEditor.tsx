/**
 * Atlassian Editor Integration - ProseMirror Powerhouse
 * Computational Design Compendium Implementation
 * ==============================================
 *
 * ATLASSIAN DESIGN SYSTEM INTEGRATION
 * Professional editing experience for creative professionals
 */

import React, { useState, useEffect, useRef } from 'react';
import { Editor, EditorContext, WithEditorActions } from '@atlaskit/editor-core';
import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { blockTypePlugin } from '@atlaskit/editor-plugin-block-type';
import { listPlugin } from '@atlaskit/editor-plugin-list';
import { textFormattingPlugin } from '@atlaskit/editor-plugin-text-formatting';
import { hyperlinkPlugin } from '@atlaskit/editor-plugin-hyperlink';
import { mediaPlugin } from '@atlaskit/editor-plugin-media';
import { codeBlockPlugin } from '@atlaskit/editor-plugin-code-block';
import { tablesPlugin } from '@atlaskit/editor-plugin-table';
import { mentionsPlugin } from '@atlaskit/editor-plugin-mentions';
import { emojiPlugin } from '@atlaskit/editor-plugin-emoji';
import { statusPlugin } from '@atlaskit/editor-plugin-status';
import { typeAheadPlugin } from '@atlaskit/editor-plugin-type-ahead';
import { gridPlugin } from '@atlaskit/editor-plugin-grid';
import { extensionHandlers, extensionPlugin } from '@atlaskit/editor-plugin-extension';
import { quickInsertPlugin } from '@atlaskit/editor-plugin-quick-insert';

import { defaultSchema } from '@atlaskit/adf-schema';
import { mentionResourceProvider } from '@atlaskit/util-data-test';
import { cardProvider } from '@atlaskit/editor-core/test-utils';

import { Button } from '@atlaskit/button';
import { token } from '@atlaskit/tokens';

/**
 * CREATIVE STUDIO EDITOR - ATLASSIAN INTEGRATION
 * Following Computational Design principles of deliberate construction
 */

interface AtlassianCreativeEditorProps {
  initialContent?: string;
  onContentChange?: (content: any) => void;
  projectId?: string;
  projectContext?: any;
  onSave?: (content: any) => Promise<void>;
  onEnhance?: (currentContent: string) => Promise<string>;
  placeholder?: string;

  // Creative enhancement features
  contextInjectionEnabled?: boolean;
  assetDraggingEnabled?: boolean;
  realTimeEnhancement?: boolean;
  brandValidationEnabled?: boolean;
}

export const AtlassianCreativeEditor: React.FC<AtlassianCreativeEditorProps> = ({
  initialContent = '',
  onContentChange,
  projectId,
  projectContext,
  onSave,
  onEnhance,
  placeholder = "Start creating your masterpiece...",
  contextInjectionEnabled = true,
  assetDraggingEnabled = true,
  realTimeEnhancement = false,
  brandValidationEnabled = true
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [showAssetInserter, setShowAssetInserter] = useState(false);
  const [currentContent, setCurrentContent] = useState<any>(null);

  // Editor reference for programmatic access
  const editorRef = useRef<any>(null);

  // BRAND VOICE VALIDATION STATE
  const [brandValidationErrors, setBrandValidationErrors] = useState<string[]>([]);

  /**
   * EDITOR PLUGINS CONFIGURATION (Atlassian Composer Architecture)
   */
  const plugins = [
    blockTypePlugin({}),
    listPlugin(),
    textFormattingPlugin({
      bold: true,
      italic: true,
      underline: true,
      strike: true,
      code: true,
      superscript: false,
      subscript: false,
      mark: false
    }),
    hyperlinkPlugin({
      cardProvider
    }),
    mediaPlugin({
      provider: undefined, // Configure for asset integration
      allowMediaGroup: true,
      allowMediaSingle: true,
      allowAltTextOnImages: true
    }),
    codeBlockPlugin(),
    tablesPlugin(),
    mentionsPlugin({
      mentionInsertDisplayName: true,
      sanitizePrivateContent: true,
      insertDisplayName: true,
      useInlineTextForInsert: true,
      allowSpaces: false
    }),
    emojiPlugin(),
    statusPlugin(),
    typeAheadPlugin(),
    gridPlugin(),
    extensionPlugin,
    quickInsertPlugin()
  ];

  /**
   * BRAND CONTEXT INTEGRATION (Computational Design: Mental Simulation)
   * When user types, the editor "sees" the brand force field
   */
  useEffect(() => {
    if (brandValidationEnabled && currentContent && projectId) {
      validateBrandConsistency();
    }
  }, [currentContent, brandValidationEnabled]);

  const validateBrandConsistency = async () => {
    if (!currentContent || !projectId) return;

    // Extract text content for validation
    const textToValidate = extractTextFromContent(currentContent);

    // Apply brand voice lensing (would integrate with our context assembler)
    const validationResults = await simulateBrandVoiceValidation(textToValidate, projectId);

    setBrandValidationErrors(validationResults.issues || []);
  };

  /**
   * ENHANCEMENT SYSTEM INTEGRATION
   * Bridging Atlassian editor with our computational intelligence
   */
  const handleEnhance = async () => {
    if (!currentContent) return;

    setIsEnhancing(true);
    try {
      const textContent = extractTextFromContent(currentContent);

      // Call enhancement service (would integrate with BrandContextAssembler)
      const enhancedContent = await (onEnhance ? onEnhance(textContent) : textContent);

      // Convert back to Atlassian format and update editor
      const enhancedAdfFormat = await convertToAdfFormat(enhancedContent);
      updateEditorContent(enhancedAdfFormat);

    } catch (error) {
      console.error('Enhancement failed:', error);
    } finally {
      setIsEnhancing(false);
    }
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

  /**
   * ASSET DRAG-AND-DROP INTEGRATION
   * Computational Design: Geometric transformation between creative domains
   */
  const handleDroppedAsset = (assetData: any) => {
    if (!assetDraggingEnabled) return;

    // Convert asset to Atlassian media format
    const assetNode = createAssetMediaNode(assetData);

    // Insert into current cursor position
    insertMediaAtCursor(assetNode);
  };

  /**
   * CONTEXT-AWARE PROMPTS (Computational Intelligence Integration)
   * When user is in "creative mode", suggestions change based on brand context
   */
  const getContextAwareQuickInserts = () => {
    if (!contextInjectionEnabled || !projectContext) {
      return defaultQuickInserts;
    }

    // Generate contextual suggestions based on project brand vectors
    const brandAwareInserts = [
      {
        title: 'Brand-aligned heading',
        description: 'Insert heading using brand voice',
        keywords: ['heading', 'brand'],
        action(insert: any, state: any): void {
          return insert(createBrandHeadingNode());
        }
      },
      {
        title: 'Strategic statement',
        description: 'Insert brand-focused paragraph',
        keywords: ['paragraph', 'brand'],
        action(insert: any, state: any): void {
          return insert(createStrategicStatementNode());
        }
      }
    ];

    return [...brandAwareInserts, ...defaultQuickInserts];
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
      {/* BRAND CONTEXT INDICATOR */}
      {brandValidationEnabled && brandValidationErrors.length > 0 && (
        <div style={{
          background: '#fef3c7',
          border: '1px solid #f59e0b',
          borderRadius: '8px',
          padding: '12px',
          margin: '8px',
          fontSize: '14px',
          color: '#92400e'
        }}>
          <div>Brand voice optimization available</div>
          {brandValidationErrors.slice(0, 2).map((error, i) => (
            <div key={i} style={{ marginTop: '4px', fontSize: '12px', opacity: 0.8 }}>
              {error}
            </div>
          ))}
        </div>
      )}

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
          <Button appearance="primary" onClick={handleSave} isLoading={isSaving}>
            Save Draft
          </Button>

          <Button
            appearance="subtle"
            onClick={handleEnhance}
            isLoading={isEnhancing}
          >
            AI Enhance
          </Button>

          {assetDraggingEnabled && (
            <Button
              appearance="subtle"
              onClick={() => setShowAssetInserter(!showAssetInserter)}
            >
              Insert Asset
            </Button>
          )}
        </div>
      </div>

      {/* ATLASSIAN EDITOR CORE */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <ComposableEditor appearance="full-page">
          <Editor
            ref={editorRef}
            placeholder={placeholder}
            defaultValue={currentContent}
            onChange={(editorView: any) => {
              const content = editorView.state.doc.toJSON();
              setCurrentContent(content);
              onContentChange?.(content);
            }}
            plugins={plugins}
            quickInsert={getContextAwareQuickInserts()}
            contextIdentifierProvider={contextIdentifierProvider}
            allowTextAlignment
            allowBreakout
            allowIndentation
            allowTables
            allowNestedTasks
            allowPanel
            allowExtension
            allowRule
            allowHelpDialog
            allowNewInsertionBehaviour
            allowKeyboardAccessibleDatePicker
            allowStatus
            allowLayouts
            allowUndoRedoButtons
            allowFindReplace
            shouldFocus
            disabled={isSaving}
            collabEdit={collabEditConfig}
            performanceTracking={{}}
            featureFlags={{
              'new-editor-toolbar': true,
              'macro-interactions': true,
              'editor-toolbar-optimization': true
            }}
          >
            {({ renderToolbar, renderEditor }: any) => (
              <>
                {renderToolbar()}
                <div onDrop={handleAssetDrop} onDragOver={handleDragOver} style={{ height: '100%' }}>
                  {renderEditor({})}
                </div>
              </>
            )}
          </Editor>
        </ComposableEditor>
      </div>

      {/* REAL-TIME COLLABORATION INDICATOR */}
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

// UTILITY FUNCTIONS (Following Computational Design: Structured Logic)

const extractTextFromContent = (content: any): string => {
  // Extract plain text from Atlassian Document Format
  // Implementation would traverse ADF tree
  return 'Extracted text content'; // Placeholder
};

const simulateBrandVoiceValidation = async (text: string, projectId: string) => {
  // Integration with BrandContextAssembler
  return {
    issues: [
      'Consider using more innovative language',
      'Brand voice suggests stronger technical specificity'
    ]
  };
};

const convertToAdfFormat = async (text: string): Promise<any> => {
  // Convert plain text to Atlassian Document Format
  return {}; // Placeholder
};

const updateEditorContent = (content: any) => {
  // Update editor state programmatically
};

const createAssetMediaNode = (assetData: any): any => {
  // Convert asset to ADF media node
  return {};
};

const insertMediaAtCursor = (mediaNode: any) => {
  // Insert at current cursor position
};

const createBrandHeadingNode = (): any => {
  return {}; // Placeholder
};

const createStrategicStatementNode = (): any => {
  return {}; // Placeholder
};

// CONFIGURATIONS
const defaultQuickInserts: any[] = []; // Default Atlassian inserts
const contextIdentifierProvider = async () => 'creative-studio';
const collabEditConfig = {}; // For future real-time collaboration

const handleAssetDrop = (e: React.DragEvent) => {
  e.preventDefault();
  // Asset drop implementation
};

const handleDragOver = (e: React.DragEvent) => {
  e.preventDefault();
};

export default AtlassianCreativeEditor;
