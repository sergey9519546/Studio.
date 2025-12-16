/**
 * AudioAIComponent - Voice processing and transcription component
 * Provides AI-powered audio analysis with advanced capabilities
 */

import { Brain, Download, FileAudio, Mic, Pause, Play, Settings, Square, Upload, Volume2 } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AIAPI } from '../../services/api/ai';
import { Button } from '../design/Button';
import { LiquidGlassContainer } from '../design/LiquidGlassContainer';

export interface AudioAnalysisResult {
  id: string;
  filename: string;
  transcription: TranscriptionResult[];
  audioFeatures: AudioFeatures;
  speakerAnalysis?: SpeakerAnalysis;
  languageDetection?: LanguageDetection;
  emotionAnalysis?: EmotionAnalysis;
  qualityMetrics: QualityMetrics;
  processingTime: number;
  timestamp: Date;
  metadata: {
    duration: number;
    format: string;
    sampleRate: number;
    channels: number;
    size: number;
  };
}

export interface TranscriptionResult {
  id: string;
  text: string;
  confidence: number;
  startTime: number;
  endTime: number;
  speaker?: string;
  language?: string;
  words?: WordTiming[];
}

export interface WordTiming {
  word: string;
  startTime: number;
  endTime: number;
  confidence: number;
}

export interface AudioFeatures {
  tempo: number;
  key: string;
  mode: 'major' | 'minor';
  energy: number;
  valence: number;
  danceability: number;
  acousticness: number;
  instrumentalness: number;
  speechiness: number;
  loudness: number;
  spectralCentroid: number;
  mfccs: number[];
}

export interface SpeakerAnalysis {
  speakers: SpeakerInfo[];
  totalSpeakers: number;
  speakerDiarization: SpeakerSegment[];
}

export interface SpeakerInfo {
  id: string;
  confidence: number;
  characteristics: {
    age?: string;
    gender?: string;
    accent?: string;
    speakingRate: number;
  };
}

export interface SpeakerSegment {
  speakerId: string;
  startTime: number;
  endTime: number;
  confidence: number;
}

export interface LanguageDetection {
  primary: string;
  confidence: number;
  alternatives: { language: string; confidence: number }[];
}

export interface EmotionAnalysis {
  overall: string;
  confidence: number;
  emotions: { emotion: string; intensity: number; confidence: number; timeRange: [number, number] }[];
}

export interface QualityMetrics {
  clarity: number;
  noiseLevel: number;
  signalToNoise: number;
  clipping: number;
  dynamicRange: number;
}

export interface AudioAIConfig {
  enableTranscription: boolean;
  enableSpeakerDetection: boolean;
  enableLanguageDetection: boolean;
  enableEmotionAnalysis: boolean;
  enableAudioFeatures: boolean;
  enableQualityAssessment: boolean;
  confidenceThreshold: number;
  maxDuration: number; // in seconds
  supportedFormats: string[];
  realTimeProcessing: boolean;
}

export interface AudioAIProps {
  onAnalysisComplete: (result: AudioAnalysisResult) => void;
  onError: (error: string) => void;
  config?: Partial<AudioAIConfig>;
  className?: string;
  projectId?: string;
  projectContext?: string;
}

const defaultConfig: AudioAIConfig = {
  enableTranscription: true,
  enableSpeakerDetection: true,
  enableLanguageDetection: true,
  enableEmotionAnalysis: true,
  enableAudioFeatures: true,
  enableQualityAssessment: true,
  confidenceThreshold: 0.7,
  maxDuration: 3600, // 1 hour
  supportedFormats: ['mp3', 'wav', 'm4a', 'ogg', 'flac', 'aac', 'wma'],
  realTimeProcessing: false
};

export const AudioAIComponent: React.FC<AudioAIProps> = ({
  onAnalysisComplete,
  onError,
  config = {},
  className = '',
  projectId,
  projectContext
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const finalConfig = useMemo(() => ({ ...defaultConfig, ...config }), [config]);

  // Recording timer
  useEffect(() => {
    if (isRecording) {
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
      setRecordingTime(0);
    }

    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    };
  }, [isRecording]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const file = new File([blob], `recording_${Date.now()}.webm`, { type: 'audio/webm' });
        handleFileUpload(file);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    } catch {
      onError('Failed to start recording. Please check microphone permissions.');
    }
  }, [handleFileUpload, onError]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  const handleFileUpload = useCallback(async (file: File) => {
    if (!file) return;

    // Validate file
    if (file.size > 100 * 1024 * 1024) { // 100MB limit
      onError('File size exceeds 100MB limit');
      return;
    }

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!finalConfig.supportedFormats.includes(fileExtension || '')) {
      onError(`Unsupported file format: ${fileExtension}`);
      return;
    }

    // Check duration if metadata is available
    if (finalConfig.maxDuration && file.size > 0) {
      // In a real implementation, you'd get audio duration here
      // For now, we'll skip this check
    }

    setIsProcessing(true);
    setProcessingProgress(15);

    try {
      // Create audio URL for playback
      const url = URL.createObjectURL(file);
      setAudioUrl(url);

      const result = await AIAPI.analyzeAudioFile(file, {
        ...finalConfig,
        projectId,
        projectContext
      });

      setProcessingProgress(100);
      
      onAnalysisComplete(result);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Analysis failed');
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
    const audioFiles = files.filter(file => 
      finalConfig.supportedFormats.includes(file.name.split('.').pop()?.toLowerCase() || '')
    );
    
    if (audioFiles.length > 0) {
      handleFileUpload(audioFiles[0]);
    }
  }, [handleFileUpload, finalConfig.supportedFormats]);

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`w-full ${className}`}>
      <LiquidGlassContainer level="lg" className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Volume2 className="text-primary" size={24} />
            <h2 className="text-xl font-bold text-ink-primary">Audio AI Analysis</h2>
          </div>
          <div className="flex items-center gap-2 text-xs text-ink-tertiary">
            <Brain size={16} />
            <span>Powered by Advanced AI Audio</span>
          </div>
        </div>

        {/* Recording Controls */}
        <div className="mb-6 p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-ink-primary">Live Recording</h3>
            {isRecording && (
              <div className="flex items-center gap-2 text-red-600">
                <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                <span className="text-sm font-medium">Recording {formatTime(recordingTime)}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            {!isRecording ? (
              <Button
                variant="primary"
                onClick={startRecording}
                leftIcon={<Mic size={16} />}
                className="bg-red-600 hover:bg-red-700"
              >
                Start Recording
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={stopRecording}
                leftIcon={<Square size={16} />}
                className="bg-red-600 hover:bg-red-700"
              >
                Stop Recording
              </Button>
            )}
            
            <div className="text-sm text-ink-secondary">
              Max duration: {Math.floor(finalConfig.maxDuration / 60)} minutes
            </div>
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
                <span className="text-lg font-medium text-ink-primary">Processing Audio...</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${processingProgress}%` }}
                />
              </div>
              
              <p className="text-sm text-ink-secondary">
                Analyzing audio with AI transcription and features...
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3">
                <FileAudio className="text-ink-tertiary" size={32} />
                <div>
                  <p className="text-lg font-medium text-ink-primary mb-2">
                    Upload Audio File for AI Analysis
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
              </div>
              
              <div className="text-xs text-ink-tertiary">
                Max file size: 100MB • Max duration: {Math.floor(finalConfig.maxDuration / 60)} minutes
              </div>
            </div>
          )}
        </div>

        {/* Audio Playback */}
        {audioUrl && (
          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={togglePlayback}
                leftIcon={isPlaying ? <Pause size={16} /> : <Play size={16} />}
              >
                {isPlaying ? 'Pause' : 'Play'}
              </Button>
              
              <audio
                ref={audioRef}
                src={audioUrl}
                onEnded={() => setIsPlaying(false)}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                className="hidden"
              />
              
              <div className="flex-1">
                <div className="w-full bg-gray-200 rounded-full h-1">
                  <div className="bg-primary h-1 rounded-full w-0" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analysis Features */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { icon: Mic, label: 'Transcription', enabled: finalConfig.enableTranscription },
            { icon: Settings, label: 'Speaker Detection', enabled: finalConfig.enableSpeakerDetection },
            { icon: Brain, label: 'Language Detection', enabled: finalConfig.enableLanguageDetection },
            { icon: Volume2, label: 'Emotion Analysis', enabled: finalConfig.enableEmotionAnalysis },
            { icon: FileAudio, label: 'Audio Features', enabled: finalConfig.enableAudioFeatures },
            { icon: Download, label: 'Quality Assessment', enabled: finalConfig.enableQualityAssessment },
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
