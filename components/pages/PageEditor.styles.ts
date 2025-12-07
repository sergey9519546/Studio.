import styled from 'styled-components';

/**
 * AppViewport: The main scrollable area with gray background
 * This is the primary scroll context for the entire page editor
 */
export const AppViewport = styled.div`
  background-color: #F4F5F7; /* N20 Neutral Gray */
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: scroll;
  padding: 40px 20px;
`;

/**
 * PagePaper: White paper-like container, strictly 850px
 * Establishes the stacking context for sticky toolbar
 */
export const PagePaper = styled.div`
  width: 100%;
  max-width: 850px;
  background-color: #FFFFFF;
  min-height: 100vh;
  margin: 0 auto;
  box-shadow: 0 0 0 1px rgba(9, 30, 66, 0.08), 0 2px 4px 1px rgba(9, 30, 66, 0.08);
  position: relative;
  border-radius: 3px;
  
  /* Internal Editor Overrides - constrain content area */
  .ak-editor-content-area {
    padding: 0 40px;
    max-width: 850px;
  }
  
  /* Ensure ProseMirror content respects width */
  .ProseMirror {
    max-width: 100%;
    padding: 20px 40px;
  }
`;

/**
 * EditorWrapper: Wrapper for the editor with sticky toolbar overrides
 * Forces sticky positioning relative to the PagePaper
 */
export const EditorWrapper = styled.div`
  width: 100%;
  
  /* Override Atlaskit toolbar to make it sticky within PagePaper */
  .ak-editor-toolbar,
  [data-editor-toolbar='true'] {
    position: sticky;
    top: 0;
    z-index: 100;
    width: 100%;
    max-width: 850px;
    background-color: #FFFFFF;
    border-radius: 3px 3px 0 0;
    box-shadow: 0 1px 1px rgba(9, 30, 66, 0.08);
  }
  
  /* Ensure content area doesn't overlap with toolbar */
  .ak-editor-content-area {
    margin-top: 0;
  }
`;

/**
 * PageHeader: Container for page title and metadata
 */
export const PageHeader = styled.div`
  padding: 40px 40px 20px;
  border-bottom: 2px solid #F4F5F7;
`;

/**
 * PageTitleInput: Large input for page title
 */
export const PageTitleInput = styled.input`
  width: 100%;
  font-size: 32px;
  font-weight: 600;
  line-height: 1.2;
  border: none;
  outline: none;
  padding: 8px 0;
  color: #172B4D;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 
    'Ubuntu', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  
  &::placeholder {
    color: #A5ADBA;
  }
  
  &:focus {
    outline: none;
  }
`;

/**
 * PrimaryToolbar: Container for custom actions (Save, Publish, etc.)
 */
export const PrimaryToolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 12px 40px;
  gap: 8px;
  border-bottom: 1px solid #EBECF0;
  background-color: #FAFBFC;
`;

/**
 * SaveButton: Primary action button for saving page content
 */
export const SaveButton = styled.button<{ disabled?: boolean }>`
  background-color: ${props => props.disabled ? '#F4F5F7' : '#0052CC'};
  color: ${props => props.disabled ? '#A5ADBA' : '#FFFFFF'};
  border: none;
  border-radius: 3px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${props => props.disabled ? '#F4F5F7' : '#0065FF'};
  }
  
  &:active {
    background-color: ${props => props.disabled ? '#F4F5F7' : '#0747A6'};
  }
`;

/**
 * StatusBadge: Visual indicator of page status (draft, published, etc.)
 */
export const StatusBadge = styled.span<{ status: 'draft' | 'published' | 'archived' }>`
  padding: 4px 8px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  background-color: ${props => {
    switch (props.status) {
      case 'published': return '#E3FCEF';
      case 'archived': return '#FFEBE6';
      default: return '#F4F5F7';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'published': return '#006644';
      case 'archived': return '#DE350B';
      default: return '#5E6C84';
    }
  }};
`;
