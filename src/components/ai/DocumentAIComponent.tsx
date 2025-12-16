/**
 * DocumentAIComponent - PDF and document processing component
 * Provides AI-powered document analysis with advanced capabilities
 */

import { BookOpen, Brain, Edit3, Eye, FileImage, FileText, Search, Settings, Upload } from 'lucide-react';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { AIAPI } from '../../services/api/ai';
import { Button } from '../design/Button';
import { LiquidGlassContainer } from '../design/LiquidGlassContainer';

export interface DocumentAnalysisResult {
  id: string;
  filename: string;
  documentType: string;
  content: DocumentContent;
  structure: DocumentStructure;
  entities?: EntityExtraction[];
  sentiment?: SentimentAnalysis;
  summary: DocumentSummary;
  keywords: string[];
  readability: ReadabilityMetrics;
  language: LanguageDetection;
  processingTime: number;
  timestamp: Date;
  metadata: {
    pages: number;
    format: string;
    size: number;
    wordCount: number;
    characterCount: number;
  };
}

export interface DocumentContent {
  text: string;
  extractedImages: ExtractedImage[];
  tables: ExtractedTable[];
  metadata: {
    title?: string;
    author?: string;
    subject?: string;
    creator?: string;
    producer?: string;
    creationDate?: Date;
    modificationDate?: Date;
  };
}

export interface DocumentStructure {
  headings: Heading[];
  paragraphs: Paragraph[];
  sections: Section[];
  tableOfContents?: TableOfContentsEntry[];
  metadata: {
    hasTableOfContents: boolean;
    hasBibliography: boolean;
    hasFootnotes: boolean;
    hasEndnotes: boolean;
  };
}

export interface Heading {
  level: number;
  text: string;
  page: number;
  position: { x: number; y: number };
}

export interface Paragraph {
  text: string;
  page: number;
  position: { x: number; y: number };
  style: {
    fontSize: number;
    fontFamily: string;
    isBold: boolean;
    isItalic: boolean;
    alignment: 'left' | 'center' | 'right' | 'justify';
  };
}

export interface Section {
  title: string;
  startPage: number;
  endPage: number;
  content: string;
}

export interface TableOfContentsEntry {
  title: string;
  page: number;
  level: number;
}

export interface ExtractedImage {
  id: string;
  filename: string;
  format: string;
  size: number;
  page: number;
  position: { x: number; y: number; width: number; height: number };
  altText?: string;
  description?: string;
}

export interface ExtractedTable {
  id: string;
  data: string[][];
  headers: string[];
  page: number;
  position: { x: number; y: number; width: number; height: number };
}

export interface EntityExtraction {
  type: 'person' | 'organization' | 'location' | 'date' | 'money' | 'percent' | 'phone' | 'email' | 'url' | 'custom';
  text: string;
  confidence: number;
  startPosition: number;
  endPosition: number;
  page: number;
  metadata?: Record<string, unknown>;
}

export interface SentimentAnalysis {
  overall: 'positive' | 'negative' | 'neutral' | 'mixed';
  confidence: number;
  emotions: { emotion: string; intensity: number; confidence: number }[];
  subjectivity: number;
  polarity: number;
}

export interface DocumentSummary {
  abstract: string;
  keyPoints: string[];
  conclusions: string[];
  recommendations: string[];
  length: 'short' | 'medium' | 'long';
  confidence: number;
}

export interface ReadabilityMetrics {
  fleschReadingEase: number;
  fleschKincaidGrade: number;
  gunningFog: number;
  smog: number;
  automatedReadabilityIndex: number;
  colemanLiauIndex: number;
  level: 'very_easy' | 'easy' | 'fairly_easy' | 'standard' | 'fairly_difficult' | 'difficult' | 'very_difficult';
}

export interface LanguageDetection {
  primary: string;
  confidence: number;
  alternatives: { language: string; confidence: number }[];
  isTranslated: boolean;
  originalLanguage?: string;
}

export interface DocumentAIConfig {
  enableTextExtraction: boolean;
  enableStructureAnalysis: boolean;
  enableEntityExtraction: boolean;
  enableSentimentAnalysis: boolean;
  enableSummarization: boolean;
  enableReadabilityAnalysis: boolean;
  enableLanguageDetection: boolean;
  enableImageExtraction: boolean;
  enableTableExtraction: boolean;
  confidenceThreshold: number;
  maxFileSize: number; // in MB
  supportedFormats: string[];
  summaryLength: 'short' | 'medium' | 'long';
  ocrEnabled: boolean;
  ocrLanguages: string[];
}

export interface DocumentAIProps {
  onAnalysisComplete: (result: DocumentAnalysisResult) => void;
  onError: (error: string) => void;
  config?: Partial<DocumentAIConfig>;
  className?: string;
  projectId?: string;
  projectContext?: string;
}

const defaultConfig: DocumentAIConfig = {
  enableTextExtraction: true,
  enableStructureAnalysis: true,
  enableEntityExtraction: true,
  enableSentimentAnalysis: true,
  enableSummarization: true,
  enableReadabilityAnalysis: true,
  enableLanguageDetection: true,
  enableImageExtraction: true,
  enableTableExtraction: true,
  confidenceThreshold: 0.7,
  maxFileSize: 50, // 50MB
  supportedFormats: ['pdf', 'docx', 'doc', 'txt', 'rtf', 'odt', 'html', 'htm', 'md'],
  summaryLength: 'medium',
  ocrEnabled: false,
  ocrLanguages: ['en', 'es', 'fr', 'de', 'it', 'pt', 'nl']
};

export const DocumentAIComponent: React.FC<DocumentAIProps> = ({
  onAnalysisComplete,
  onError,
  config = {},
  className = '',
  projectId,
  projectContext
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const finalConfig = useMemo(() => ({ ...defaultConfig, ...config }), [config]);

  const handleFileUpload = useCallback(async (file: File) => {
    if (!file) return;

    // Validate file
    if (file.size > finalConfig.maxFileSize * 1024 * 1024) {
      onError(`File size exceeds ${finalConfig.maxFileSize}MB limit`);
      return;
    }

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!finalConfig.supportedFormats.includes(fileExtension || '')) {
      onError(`Unsupported file format: ${fileExtension}`);
      return;
    }

    setSelectedFile(file);
    setIsProcessing(true);
    setProcessingProgress(10);

    try {
      const result = await AIAPI.analyzeDocumentFile(file, {
        ...finalConfig,
        projectId,
        projectContext
      });

      setProcessingProgress(100);
      
      onAnalysisComplete(result);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Document analysis failed');
    } finally {
      setIsProcessing(false);
      setProcessingProgress(0);
    }
  }, [finalConfig, onAnalysisComplete, onError, projectId, projectContext]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const documentFiles = files.filter(file => 
      finalConfig.supportedFormats.includes(file.name.split('.').pop()?.toLowerCase() || '')
    );
    
    if (documentFiles.length > 0) {
      handleFileUpload(documentFiles[0]);
    }
  }, [handleFileUpload, finalConfig.supportedFormats]);

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`w-full ${className}`}>
      <LiquidGlassContainer level="lg" className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FileText className="text-primary" size={24} />
            <h2 className="text-xl font-bold text-ink-primary">Document AI Analysis</h2>
          </div>
          <div className="flex items-center gap-2 text-xs text-ink-tertiary">
            <Brain size={16} />
            <span>Powered by Advanced AI Document Processing</span>
          </div>
        </div>

        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
            dragOver 
              ? 'border-primary bg-primary/5' 
              : 'border-border-subtle hover:border-primary/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {isProcessing ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3">
                <Brain className="text-primary animate-pulse" size={32} />
                <span className="text-lg font-medium text-ink-primary">Processing Document...</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${processingProgress}%` }}
                />
              </div>
              
              <p className="text-sm text-ink-secondary">
                Analyzing document structure, content, and extracting insights...
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3">
                <FileText className="text-ink-tertiary" size={32} />
                <div>
                  <p className="text-lg font-medium text-ink-primary mb-2">
                    Upload Document for AI Analysis
                  </p>
                  <p className="text-sm text-ink-secondary">
                    Drag & drop or click to upload • Supports {finalConfig.supportedFormats.join(', ').toUpperCase()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="secondary"
                  onClick={openFileDialog}
                  leftIcon={<Upload size={16} />}
                >
                  Upload Document
                </Button>
              </div>
              
              <div className="text-xs text-ink-tertiary">
                Max file size: {finalConfig.maxFileSize}MB • OCR enabled: {finalConfig.ocrEnabled ? 'Yes' : 'No'}
              </div>
            </div>
          )}
        </div>

        {/* Selected File Info */}
        {selectedFile && !isProcessing && (
          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-4">
              <FileText className="text-primary" size={24} />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-ink-primary">{selectedFile.name}</h3>
                <p className="text-xs text-ink-secondary">
                  {formatFileSize(selectedFile.size)} • {selectedFile.type || 'Unknown type'}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedFile(null)}
              >
                Remove
              </Button>
            </div>
          </div>
        )}

        {/* Analysis Features */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: FileText, label: 'Text Extraction', enabled: finalConfig.enableTextExtraction },
            { icon: BookOpen, label: 'Structure Analysis', enabled: finalConfig.enableStructureAnalysis },
            { icon: Search, label: 'Entity Extraction', enabled: finalConfig.enableEntityExtraction },
            { icon: Brain, label: 'Sentiment Analysis', enabled: finalConfig.enableSentimentAnalysis },
            { icon: Edit3, label: 'Summarization', enabled: finalConfig.enableSummarization },
            { icon: Eye, label: 'Readability', enabled: finalConfig.enableReadabilityAnalysis },
            { icon: Settings, label: 'Language Detection', enabled: finalConfig.enableLanguageDetection },
            { icon: FileImage, label: 'Image Extraction', enabled: finalConfig.enableImageExtraction },
          ].map((feature, index) => (
            <div
              key={index}
              className={`p-2 flex items-center gap-2 rounded-lg ${
                feature.enabled ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-400'
              }`}
            >
              <feature.icon size={14} />
              <span className="text-xs font-medium">{feature.label}</span>
            </div>
          ))}
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={finalConfig.supportedFormats.map(format => `.${format}`).join(',')}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileUpload(file);
          }}
          className="hidden"
        />
      </LiquidGlassContainer>
    </div>
  );
};
