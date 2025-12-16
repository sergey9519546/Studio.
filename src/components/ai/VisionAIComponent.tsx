/**
 * VisionAIComponent - Image and video analysis component
 * Provides AI-powered visual analysis with advanced capabilities
 */

import { Brain, Camera, Download, Eye, FileImage, Image, Scan, Upload, Zap } from 'lucide-react';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { AIAPI } from '../../services/api/ai';
import { Button } from '../design/Button';
import { LiquidGlassContainer } from '../design/LiquidGlassContainer';

export interface VisionAnalysisResult {
  id: string;
  type: 'image' | 'video';
  filename: string;
  analysis: {
    objects: DetectedObject[];
    scenes: SceneAnalysis[];
    text?: TextDetection[];
    faces?: FaceAnalysis[];
    colors?: ColorAnalysis;
    emotions?: EmotionAnalysis;
    composition?: CompositionAnalysis;
    style?: StyleAnalysis;
    quality?: QualityAnalysis;
    tags: string[];
    description: string;
    confidence: number;
  };
  processingTime: number;
  timestamp: Date;
  metadata: {
    dimensions: { width: number; height: number };
    format: string;
    size: number;
    duration?: number; // for videos
  };
}

export interface DetectedObject {
  name: string;
  confidence: number;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  attributes?: string[];
}

export interface SceneAnalysis {
  environment: string;
  lighting: string;
  setting: string;
  timeOfDay?: string;
  weather?: string;
  season?: string;
}

export interface TextDetection {
  text: string;
  confidence: number;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  language?: string;
}

export interface FaceAnalysis {
  count: number;
  emotions: {
    emotion: string;
    confidence: number;
    boundingBox: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  }[];
  demographics?: {
    age: { range: string; confidence: number };
    gender: { value: string; confidence: number };
    ethnicity?: { value: string; confidence: number };
  };
}

export interface ColorAnalysis {
  dominant: string[];
  palette: { color: string; percentage: number }[];
  mood: string;
  harmony: number;
}

export interface EmotionAnalysis {
  overall: string;
  confidence: number;
  emotions: { emotion: string; intensity: number; confidence: number }[];
}

export interface CompositionAnalysis {
  ruleOfThirds: number;
  symmetry: number;
  leadingLines: string[];
  balance: number;
  focalPoints: { x: number; y: number; strength: number }[];
}

export interface StyleAnalysis {
  artistic: string;
  photography: string;
  design: string;
  period?: string;
  movements?: string[];
}

export interface QualityAnalysis {
  sharpness: number;
  exposure: number;
  noise: number;
  clarity: number;
  overall: number;
}

export interface VisionAIConfig {
  enableObjectDetection: boolean;
  enableSceneAnalysis: boolean;
  enableTextRecognition: boolean;
  enableFaceAnalysis: boolean;
  enableEmotionDetection: boolean;
  enableColorAnalysis: boolean;
  enableCompositionAnalysis: boolean;
  enableStyleAnalysis: boolean;
  enableQualityAssessment: boolean;
  confidenceThreshold: number;
  maxImageSize: number; // in MB
  supportedFormats: string[];
}

export interface VisionAIProps {
  onAnalysisComplete: (result: VisionAnalysisResult) => void;
  onError: (error: string) => void;
  config?: Partial<VisionAIConfig>;
  className?: string;
  projectId?: string;
  projectContext?: string;
}

const defaultConfig: VisionAIConfig = {
  enableObjectDetection: true,
  enableSceneAnalysis: true,
  enableTextRecognition: true,
  enableFaceAnalysis: true,
  enableEmotionDetection: true,
  enableColorAnalysis: true,
  enableCompositionAnalysis: true,
  enableStyleAnalysis: true,
  enableQualityAssessment: true,
  confidenceThreshold: 0.7,
  maxImageSize: 10,
  supportedFormats: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'tiff', 'mp4', 'avi', 'mov', 'mkv']
};

export const VisionAIComponent: React.FC<VisionAIProps> = ({
  onAnalysisComplete,
  onError,
  config = {},
  className = '',
  projectId,
  projectContext
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  
  const finalConfig = useMemo(() => ({ ...defaultConfig, ...config }), [config]);

  const handleFileUpload = useCallback(async (file: File) => {
    if (!file) return;

    // Validate file
    if (file.size > finalConfig.maxImageSize * 1024 * 1024) {
      onError(`File size exceeds ${finalConfig.maxImageSize}MB limit`);
      return;
    }

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!finalConfig.supportedFormats.includes(fileExtension || '')) {
      onError(`Unsupported file format: ${fileExtension}`);
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(10);

    try {
      const result = await AIAPI.analyzeVisionFile(file, {
        ...finalConfig,
        projectId,
        projectContext
      });

      setAnalysisProgress(100);
      
      onAnalysisComplete(result);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Analysis failed');
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress(0);
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
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const openCamera = () => {
    cameraInputRef.current?.click();
  };

  return (
    <div className={`w-full ${className}`}>
      <LiquidGlassContainer level="lg" className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Eye className="text-primary" size={24} />
            <h2 className="text-xl font-bold text-ink-primary">Vision AI Analysis</h2>
          </div>
          <div className="flex items-center gap-2 text-xs text-ink-tertiary">
            <Brain size={16} />
            <span>Powered by Advanced AI Vision</span>
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
          {isAnalyzing ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3">
                <Scan className="text-primary animate-pulse" size={32} />
                <span className="text-lg font-medium text-ink-primary">Analyzing...</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${analysisProgress}%` }}
                />
              </div>
              
              <p className="text-sm text-ink-secondary">
                Processing image with AI vision analysis...
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3">
                <Image className="text-ink-tertiary" size={32} />
                <div>
                  <p className="text-lg font-medium text-ink-primary mb-2">
                    Upload Image or Video for AI Analysis
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
                  Upload File
                </Button>
                
                <Button
                  variant="ghost"
                  onClick={openCamera}
                  leftIcon={<Camera size={16} />}
                >
                  Use Camera
                </Button>
              </div>
              
              <div className="text-xs text-ink-tertiary">
                Max file size: {finalConfig.maxImageSize}MB
              </div>
            </div>
          )}
        </div>

        {/* Analysis Features */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: Scan, label: 'Object Detection', enabled: finalConfig.enableObjectDetection },
            { icon: Eye, label: 'Scene Analysis', enabled: finalConfig.enableSceneAnalysis },
            { icon: FileImage, label: 'Text Recognition', enabled: finalConfig.enableTextRecognition },
            { icon: Brain, label: 'Emotion Analysis', enabled: finalConfig.enableEmotionDetection },
            { icon: Zap, label: 'Color Analysis', enabled: finalConfig.enableColorAnalysis },
            { icon: Download, label: 'Style Detection', enabled: finalConfig.enableStyleAnalysis },
            { icon: Camera, label: 'Face Analysis', enabled: finalConfig.enableFaceAnalysis },
            { icon: Image, label: 'Quality Assessment', enabled: finalConfig.enableQualityAssessment },
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

        {/* Hidden File Inputs */}
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
        
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
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
