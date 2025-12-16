import { Injectable } from '@nestjs/common';

export interface VisionAnalysisResult {
  id: string;
  type: 'image' | 'video';
  filename: string;
  analysis: {
    objects: Array<{
      name: string;
      confidence: number;
      boundingBox: { x: number; y: number; width: number; height: number };
      attributes?: string[];
    }>;
    scenes: Array<{
      environment: string;
      lighting: string;
      setting: string;
      timeOfDay?: string;
      weather?: string;
      season?: string;
    }>;
    text?: Array<{
      text: string;
      confidence: number;
      boundingBox: { x: number; y: number; width: number; height: number };
      language?: string;
    }>;
    faces?: Array<{
      count: number;
      emotions: Array<{
        emotion: string;
        confidence: number;
        boundingBox: { x: number; y: number; width: number; height: number };
      }>;
      demographics?: {
        age: { range: string; confidence: number };
        gender: { value: string; confidence: number };
        ethnicity?: { value: string; confidence: number };
      };
    }>;
    colors?: {
      dominant: string[];
      palette: Array<{ color: string; percentage: number }>;
      mood: string;
      harmony: number;
    };
    emotions?: {
      overall: string;
      confidence: number;
      emotions: Array<{ emotion: string; intensity: number; confidence: number }>;
    };
    composition?: {
      ruleOfThirds: number;
      symmetry: number;
      leadingLines: string[];
      balance: number;
      focalPoints: Array<{ x: number; y: number; strength: number }>;
    };
    style?: {
      artistic: string;
      photography: string;
      design: string;
      period?: string;
      movements?: string[];
    };
    quality?: {
      sharpness: number;
      exposure: number;
      noise: number;
      clarity: number;
      overall: number;
    };
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
    duration?: number;
  };
}

export interface DocumentAnalysisResult {
  id: string;
  filename: string;
  documentType: string;
  content: {
    text: string;
    extractedImages: Array<{
      id: string;
      filename: string;
      format: string;
      size: number;
      page: number;
      position: { x: number; y: number; width: number; height: number };
      altText?: string;
      description?: string;
    }>;
    tables: Array<{
      id: string;
      data: string[][];
      headers: string[];
      page: number;
      position: { x: number; y: number; width: number; height: number };
    }>;
    metadata: Record<string, unknown>;
  };
  structure: {
    headings: Array<{ level: number; text: string; page: number; position: { x: number; y: number } }>;
    paragraphs: Array<{
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
    }>;
    sections: Array<{ title: string; startPage: number; endPage: number; content: string }>;
    tableOfContents?: Array<{ title: string; page: number; level: number }>;
    metadata: Record<string, unknown>;
  };
  entities?: Array<{
    type: string;
    text: string;
    confidence: number;
    startPosition: number;
    endPosition: number;
    page: number;
    metadata?: Record<string, unknown>;
  }>;
  sentiment?: {
    overall: 'positive' | 'negative' | 'neutral' | 'mixed';
    confidence: number;
    emotions: Array<{ emotion: string; intensity: number; confidence: number }>;
    subjectivity: number;
    polarity: number;
  };
  summary: {
    abstract: string;
    keyPoints: string[];
    conclusions: string[];
    recommendations: string[];
    length: 'short' | 'medium' | 'long';
    confidence: number;
  };
  keywords: string[];
  readability: {
    fleschReadingEase: number;
    fleschKincaidGrade: number;
    gunningFog: number;
    smog: number;
    automatedReadabilityIndex: number;
    colemanLiauIndex: number;
    level: string;
  };
  language: {
    primary: string;
    confidence: number;
    alternatives: Array<{ language: string; confidence: number }>;
    isTranslated: boolean;
    originalLanguage?: string;
  };
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

export interface WordTiming {
  word: string;
  startTime: number;
  endTime: number;
  confidence: number;
}

export interface AudioAnalysisResult {
  id: string;
  filename: string;
  transcription: Array<{
    id: string;
    text: string;
    confidence: number;
    startTime: number;
    endTime: number;
    speaker?: string;
    language?: string;
    words?: WordTiming[];
  }>;
  audioFeatures: {
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
  };
  speakerAnalysis?: {
    speakers: Array<{
      id: string;
      confidence: number;
      characteristics: {
        age?: string;
        gender?: string;
        accent?: string;
        speakingRate: number;
      };
    }>;
    totalSpeakers: number;
    speakerDiarization: Array<{
      speakerId: string;
      startTime: number;
      endTime: number;
      confidence: number;
    }>;
  };
  languageDetection?: {
    primary: string;
    confidence: number;
    alternatives: Array<{ language: string; confidence: number }>;
  };
  emotionAnalysis?: {
    overall: string;
    confidence: number;
    emotions: Array<{ emotion: string; intensity: number; confidence: number; timeRange: [number, number] }>;
  };
  qualityMetrics: {
    clarity: number;
    noiseLevel: number;
    signalToNoise: number;
    clipping: number;
    dynamicRange: number;
  };
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

@Injectable()
export class MockAnalysisService {
  analyzeVision(file: Express.Multer.File): VisionAnalysisResult {
    const isVideo = file.mimetype.startsWith('video/');
    const fileExtension = (file.originalname.split('.').pop() || '').toUpperCase();
    const baseConfidence = 0.8;

    return {
      id: `vision_${Date.now()}`,
      type: isVideo ? 'video' : 'image',
      filename: file.originalname,
      analysis: {
        objects: [
          {
            name: 'subject',
            confidence: baseConfidence,
            boundingBox: { x: 100, y: 80, width: 320, height: 200 },
            attributes: ['primary', 'detected'],
          },
        ],
        scenes: [
          {
            environment: 'indoor',
            lighting: 'balanced',
            setting: 'studio',
            timeOfDay: 'afternoon',
            weather: 'n/a',
          },
        ],
        text: [
          {
            text: 'Detected text sample',
            confidence: baseConfidence,
            boundingBox: { x: 50, y: 50, width: 180, height: 40 },
            language: 'en',
          },
        ],
        faces: [
          {
            count: 1,
            emotions: [
              {
                emotion: 'neutral',
                confidence: baseConfidence,
                boundingBox: { x: 120, y: 100, width: 140, height: 140 },
              },
            ],
            demographics: {
              age: { range: '25-40', confidence: 0.6 },
              gender: { value: 'unspecified', confidence: 0.5 },
            },
          },
        ],
        colors: {
          dominant: ['#4ECDC4', '#45B7D1', '#96CEB4'],
          palette: [
            { color: '#4ECDC4', percentage: 32 },
            { color: '#45B7D1', percentage: 28 },
            { color: '#96CEB4', percentage: 18 },
          ],
          mood: 'balanced',
          harmony: 0.82,
        },
        emotions: {
          overall: 'neutral',
          confidence: baseConfidence,
          emotions: [
            { emotion: 'calm', intensity: 0.6, confidence: 0.7 },
            { emotion: 'focus', intensity: 0.5, confidence: 0.65 },
          ],
        },
        composition: {
          ruleOfThirds: 0.72,
          symmetry: 0.58,
          leadingLines: ['diagonal'],
          balance: 0.75,
          focalPoints: [{ x: 160, y: 120, strength: 0.8 }],
        },
        style: {
          artistic: 'contemporary',
          photography: 'editorial',
          design: 'minimalist',
          period: 'modern',
          movements: ['realism'],
        },
        quality: {
          sharpness: 0.84,
          exposure: 0.78,
          noise: 0.12,
          clarity: 0.8,
          overall: 0.8,
        },
        tags: ['analysis', 'ai', 'vision'],
        description: `AI-generated analysis for ${file.originalname}`,
        confidence: baseConfidence,
      },
      processingTime: 1200,
      timestamp: new Date(),
      metadata: {
        dimensions: { width: 1920, height: 1080 },
        format: fileExtension || 'UNKNOWN',
        size: file.size,
        duration: isVideo ? 30 : undefined,
      },
    };
  }

  analyzeDocument(file: Express.Multer.File): DocumentAnalysisResult {
    const fileExtension = (file.originalname.split('.').pop() || '').toUpperCase();
    const textSample = file.buffer.toString('utf-8').substring(0, 500) || 'Document content captured for analysis.';

    return {
      id: `doc_${Date.now()}`,
      filename: file.originalname,
      documentType: fileExtension,
      content: {
        text: textSample,
        extractedImages: [
          {
            id: 'img_1',
            filename: 'embedded-graphic.png',
            format: 'PNG',
            size: 10240,
            page: 1,
            position: { x: 120, y: 220, width: 320, height: 180 },
            altText: 'Extracted graphic',
            description: 'Auto-detected document graphic',
          },
        ],
        tables: [
          {
            id: 'table_1',
            data: [['Header 1', 'Header 2'], ['Value 1', 'Value 2']],
            headers: ['Header 1', 'Header 2'],
            page: 1,
            position: { x: 80, y: 300, width: 400, height: 140 },
          },
        ],
        metadata: {
          title: file.originalname,
          producer: 'Document AI',
        },
      },
      structure: {
        headings: [
          { level: 1, text: 'Introduction', page: 1, position: { x: 40, y: 60 } },
          { level: 2, text: 'Key Points', page: 1, position: { x: 40, y: 140 } },
        ],
        paragraphs: [
          {
            text: textSample.slice(0, 180),
            page: 1,
            position: { x: 40, y: 180 },
            style: { fontSize: 12, fontFamily: 'Arial', isBold: false, isItalic: false, alignment: 'left' },
          },
        ],
        sections: [{ title: 'Summary', startPage: 1, endPage: 1, content: textSample.slice(0, 260) }],
        tableOfContents: [{ title: 'Introduction', page: 1, level: 1 }],
        metadata: {
          hasTableOfContents: true,
          hasFootnotes: false,
          hasBibliography: false,
        },
      },
      entities: [
        { type: 'organization', text: 'Acme Corp', confidence: 0.9, startPosition: 5, endPosition: 15, page: 1 },
      ],
      sentiment: {
        overall: 'neutral',
        confidence: 0.75,
        emotions: [{ emotion: 'informative', intensity: 0.6, confidence: 0.7 }],
        subjectivity: 0.4,
        polarity: 0.1,
      },
      summary: {
        abstract: `Automated summary for ${file.originalname}`,
        keyPoints: ['Key insight 1', 'Key insight 2', 'Key insight 3'],
        conclusions: ['Generated conclusion based on document content'],
        recommendations: ['Follow-up action based on the analyzed content'],
        length: 'medium',
        confidence: 0.82,
      },
      keywords: ['document', 'analysis', 'ai', 'content'],
      readability: {
        fleschReadingEase: 65,
        fleschKincaidGrade: 8,
        gunningFog: 9,
        smog: 8,
        automatedReadabilityIndex: 8.5,
        colemanLiauIndex: 9,
        level: 'standard',
      },
      language: {
        primary: 'en',
        confidence: 0.98,
        alternatives: [{ language: 'es', confidence: 0.01 }],
        isTranslated: false,
      },
      processingTime: 2200,
      timestamp: new Date(),
      metadata: {
        pages: 3,
        format: fileExtension,
        size: file.size,
        wordCount: Math.max(120, textSample.split(/\s+/).length),
        characterCount: textSample.length,
      },
    };
  }

  analyzeAudio(file: Express.Multer.File): AudioAnalysisResult {
    const baseName = file.originalname.replace(/\.[^.]+$/, '');
    const mfccs = Array.from({ length: 13 }, (_, idx) => Number((idx * 1.1).toFixed(2)));

    return {
      id: `audio_${Date.now()}`,
      filename: file.originalname,
      transcription: [
        {
          id: 'seg_001',
          text: `Automated preview for ${baseName}`,
          confidence: 0.9,
          startTime: 0,
          endTime: 4.2,
          speaker: 'Speaker 1',
          language: 'en',
        },
      ],
      audioFeatures: {
        tempo: 120,
        key: 'C',
        mode: 'major',
        energy: 0.74,
        valence: 0.62,
        danceability: 0.55,
        acousticness: 0.4,
        instrumentalness: 0.08,
        speechiness: 0.82,
        loudness: -8.0,
        spectralCentroid: 2400,
        mfccs,
      },
      speakerAnalysis: {
        speakers: [
          {
            id: 'speaker_1',
            confidence: 0.9,
            characteristics: {
              age: 'adult',
              gender: 'unspecified',
              speakingRate: 140,
            },
          },
        ],
        totalSpeakers: 1,
        speakerDiarization: [
          { speakerId: 'speaker_1', startTime: 0, endTime: 10, confidence: 0.9 },
        ],
      },
      languageDetection: {
        primary: 'en',
        confidence: 0.97,
        alternatives: [{ language: 'es', confidence: 0.02 }],
      },
      emotionAnalysis: {
        overall: 'neutral',
        confidence: 0.78,
        emotions: [
          { emotion: 'calm', intensity: 0.6, confidence: 0.75, timeRange: [0, 10] },
        ],
      },
      qualityMetrics: {
        clarity: 0.86,
        noiseLevel: 0.14,
        signalToNoise: 24,
        clipping: 0.01,
        dynamicRange: 42,
      },
      processingTime: 1800,
      timestamp: new Date(),
      metadata: {
        duration: 90,
        format: (file.originalname.split('.').pop() || '').toUpperCase(),
        sampleRate: 44100,
        channels: 2,
        size: file.size,
      },
    };
  }
}
