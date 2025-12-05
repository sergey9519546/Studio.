/**
 * Atlassian Editor Integration - ProseMirror Powerhouse
 * Computational Design Compendium Implementation
 * ==============================================
 *
 * ATLASSIAN DESIGN SYSTEM INTEGRATION
 * Professional editing experience for creative professionals
 */

import React, { useState, useEffect, useRef } from 'react';
import { Editor, EditorContext, WithEditorActions, } from '@atlaskit/editor-core';
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
import { mentionResourceProvider } from '@atlaskit/util-data-test'; // For mentions
import { cardProvider } from '@atlaskit/editor-core/test-utils'; // For links

import { Button } from '@atlaskit/button';
import { akEditorBreakoutPadding, akEditorDefaultLayoutWidth, akEditorFullWidthLayoutWidth, akEditorGutterPadding } from '@atlaskit/editor-shared-styles';
import styled from '@emotion/styled';
import { token } from '@atlaskit/tokens';
import SaveIcon from '@atlaskit/icon/glyph/check';
import SparklesIcon from '@atlaskit/icon/glyph/star';
import MediaIcon from '@atlaskit/icon/glyph/camera';
import { G300 } from '@atlaskit/theme/colors';

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
    médiasPlugin({
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
        action(insert, state): void {
          return insert(createBrandHeadingNode());
        }
      },
      {
        title: 'Strategic statement',
        description: 'Insert brand-focused paragraph',
        keywords: ['paragraph', 'brand'],
        action(insert, state): void {
          return insert(createStrategicStatementNode());
        }
      }
    ];

    return [...brandAwareInserts, ...defaultQuickInserts];
  };

  return (
    <EditorContainer>
      {/* BRAND CONTEXT INDICATOR */}
      {brandValidationEnabled && brandValidationErrors.length > 0 && (
        <BrandValidationAlert>
          <Status count={brandValidationErrors.length} />
          Brand voice optimization available
          {brandValidationErrors.slice(0, 2).map((error, i) => (
            <ValidationItem key={i}>{error}</ValidationItem>
          ))}
        </BrandValidationAlert>
      )}

      {/* ENHANCED TOOLBAR (Computational Design: Intuitive Organism) */}
      <CreativeToolbar>
        <ToolbarActions>
          <Button appearance="primary" onClick={handleSave} isLoading={isSaving}>
            <SaveIcon label="Save" />
            Save Draft
          </Button>

          <Button
            appearance="subtle"
            onClick={handleEnhance}
            isLoading={isEnhancing}
          >
            <SparklesIcon label="Enhance" />
            AI Enhance
          </Button>

          {assetDraggingEnabled && (
            <Button
              appearance="subtle"
              onClick={() => setShowAssetInserter(!showAssetInserter)}
            >
              <MediaIcon label="Assets" />
              Insert Asset
            </Button>
          )}
        </ToolbarActions>
      </CreativeToolbar>

      {/* ATLASSIAN EDITOR CORE */}
      <EditorWrapper>
        <ComposableEditor appearance="full-page">
          <Editor
            ref={editorRef}
            placeholder={placeholder}
            defaultValue={currentContent}
            onChange={(editorView) => {
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
            {({ renderToolbar, renderEditor }) => (
              <>
                {renderToolbar()}
                <EditorSurface onDrop={handleAssetDrop} onDragOver={handleDragOver}>
                  {renderEditor({})}
                </EditorSurface>
              </>
            )}
          </Editor>
        </ComposableEditor>
      </EditorWrapper>

      {/* REAL-TIME COLLABORATION INDICATOR */}
      <CollaborationStatus>
        <LiveIndicator />
        Creative intelligence active
      </CollaborationStatus>
    </EditorContainer>
  );
};

// STYLED COMPONENTS (Emotion - Styled Components Applied)
const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${token('elevation.surface')};
  border-radius: ${token('border.radius')};
  border: 1px solid ${token('color.border')};
  overflow: hidden;
`;

const CreativeToolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${token('space.2')} ${token('space.3')};
  border-bottom: 1px solid ${token('color.border')};
  background: ${token('elevation.surface.overlay')};
`;

const ToolbarActions = styled.div`
  display: flex;
  gap: ${token('space.2')};
  align-items: center;
`;

const BrandValidationAlert = styled.div`
  background: ${token('color.background.warning')};
  border: 1px solid ${token('color.border.warning')};
  border-radius: ${token('border.radius')};
  padding: ${token('space.2')} ${token('space.3')};
  margin: ${token('space.2')} ${token('space.2')} 0;
  font-size: 14px;
  color: ${token('color.text.warning')};
`;

const ValidationItem = styled.div`
  margin-top: ${token('space.1')};
  font-size: 12px;
  opacity: 0.8;
`;

const EditorWrapper = styled.div`
  flex: 1;
  overflow: hidden;
`;

const EditorSurface = styled.div`
  height: 100%;
  padding: ${token('space.3')};
  overflow-y: auto;

  &:focus-within {
    outline: 2px solid ${token('color.border.focused')};
    outline-offset: -2px;
  }
`;

const CollaborationStatus = styled.div`
  display: flex;
  align-items: center;
  gap: ${token('space.2')};
  padding: ${token('space.2')} ${token('space.3')};
  border-top: 1px solid ${token('color.border')};
  background: ${token('elevation.surface.overlay')};
  font-size: 12px;
  color: ${token('color.text.subtle')};
`;

const LiveIndicator = styled.div`
  width: 8px;
  height: 8px;
  background: ${token('color.icon.success')};
  border-radius: 50%;
  animation: pulse 2s infinite;

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

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
const defaultQuickInserts = []; // Default Atlassian inserts
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
