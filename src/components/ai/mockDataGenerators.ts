/**
 * Mock Data Generators for DocumentAIComponent
 * Real implementations that replace incomplete mock functions
 */

import {
  DocumentContent,
  DocumentStructure,
  DocumentSummary,
  EntityExtraction,
  ExtractedImage,
  ExtractedTable,
  Heading,
  LanguageDetection,
  Paragraph,
  ReadabilityMetrics,
  Section,
  SentimentAnalysis,
  TableOfContentsEntry
} from './DocumentAIComponent_Complete';

// Complete implementation of generateMockDocumentStructure
export function generateMockDocumentStructure(): DocumentStructure {
  const headings: Heading[] = [
    {
      level: 1,
      text: 'Executive Summary',
      page: 1,
      position: { x: 100, y: 200 }
    },
    {
      level: 2,
      text: 'Introduction',
      page: 2,
      position: { x: 100, y: 300 }
    },
    {
      level: 2,
      text: 'Methodology',
      page: 5,
      position: { x: 100, y: 250 }
    },
    {
      level: 3,
      text: 'Data Collection',
      page: 5,
      position: { x: 120, y: 280 }
    },
    {
      level: 2,
      text: 'Results and Analysis',
      page: 8,
      position: { x: 100, y: 200 }
    },
    {
      level: 1,
      text: 'Conclusions',
      page: 15,
      position: { x: 100, y: 200 }
    },
    {
      level: 1,
      text: 'Recommendations',
      page: 16,
      position: { x: 100, y: 250 }
    }
  ];

  const paragraphs: Paragraph[] = [
    {
      text: 'This document provides a comprehensive analysis of the current market trends and their implications for business strategy.',
      page: 1,
      position: { x: 100, y: 280 },
      style: {
        fontSize: 12,
        fontFamily: 'Times New Roman',
        isBold: false,
        isItalic: false,
        alignment: 'justify'
      }
    },
    {
      text: 'The methodology employed in this study follows industry best practices and ensures reliable results.',
      page: 5,
      position: { x: 100, y: 320 },
      style: {
        fontSize: 12,
        fontFamily: 'Arial',
        isBold: false,
        isItalic: false,
        alignment: 'left'
      }
    },
    {
      text: 'Our analysis reveals significant patterns that require immediate attention from stakeholders.',
      page: 8,
      position: { x: 100, y: 250 },
      style: {
        fontSize: 12,
        fontFamily: 'Calibri',
        isBold: true,
        isItalic: false,
        alignment: 'left'
      }
    }
  ];

  const sections: Section[] = [
    {
      title: 'Executive Summary',
      startPage: 1,
      endPage: 2,
      content: 'This section provides a high-level overview of the key findings and recommendations from the analysis.'
    },
    {
      title: 'Introduction and Background',
      startPage: 2,
      endPage: 5,
      content: 'This section establishes the context and purpose of the study, including background information and objectives.'
    },
    {
      title: 'Methodology',
      startPage: 5,
      endPage: 7,
      content: 'This section details the research methods and approaches used to collect and analyze data.'
    },
    {
      title: 'Results and Analysis',
      startPage: 8,
      endPage: 14,
      content: 'This section presents the findings from the analysis, including charts, graphs, and detailed interpretations.'
    },
    {
      title: 'Conclusions and Recommendations',
      startPage: 15,
      endPage: 18,
      content: 'This section summarizes the key conclusions and provides actionable recommendations based on the analysis.'
    }
  ];

  const tableOfContents: TableOfContentsEntry[] = [
    { title: 'Executive Summary', page: 1, level: 1 },
    { title: 'Introduction', page: 2, level: 2 },
    { title: 'Methodology', page: 5, level: 2 },
    { title: 'Data Collection', page: 5, level: 3 },
    { title: 'Results and Analysis', page: 8, level: 2 },
    { title: 'Conclusions', page: 15, level: 1 },
    { title: 'Recommendations', page: 16, level: 1 },
    { title: 'Appendices', page: 19, level: 1 }
  ];

  return {
    headings,
    paragraphs,
    sections,
    tableOfContents,
    metadata: {
      hasTableOfContents: true,
      hasBibliography: true,
      hasFootnotes: false,
      hasEndnotes: true
    }
  };
}

// Complete implementation of generateMockEntityExtraction
export function generateMockEntityExtraction(): EntityExtraction[] {
  return [
    {
      type: 'person',
      text: 'John Smith',
      confidence: 0.95,
      startPosition: 245,
      endPosition: 255,
      page: 3,
      metadata: { context: 'author', frequency: 1 }
    },
    {
      type: 'organization',
      text: 'Microsoft Corporation',
      confidence: 0.98,
      startPosition: 1023,
      endPosition: 1042,
      page: 7,
      metadata: { context: 'mentioned', frequency: 3 }
    },
    {
      type: 'location',
      text: 'San Francisco',
      confidence: 0.92,
      startPosition: 567,
      endPosition: 580,
      page: 4,
      metadata: { context: 'location', frequency: 1 }
    },
    {
      type: 'date',
      text: 'March 2024',
      confidence: 0.99,
      startPosition: 89,
      endPosition: 101,
      page: 1,
      metadata: { context: 'date_mentioned', format: 'MMMM YYYY' }
    },
    {
      type: 'money',
      text: '$2.5 million',
      confidence: 0.97,
      startPosition: 1834,
      endPosition: 1845,
      page: 12,
      metadata: { context: 'budget', currency: 'USD' }
    },
    {
      type: 'percent',
      text: '15%',
      confidence: 0.99,
      startPosition: 2156,
      endPosition: 2159,
      page: 14,
      metadata: { context: 'percentage', decimal: false }
    },
    {
      type: 'phone',
      text: '+1-555-0123',
      confidence: 0.88,
      startPosition: 3245,
      endPosition: 3255,
      page: 18,
      metadata: { context: 'contact', format: 'international' }
    },
    {
      type: 'email',
      text: 'contact@company.com',
      confidence: 0.94,
      startPosition: 3257,
      endPosition: 3274,
      page: 18,
      metadata: { context: 'contact', domain: 'company.com' }
    },
    {
      type: 'url',
      text: 'https://www.example.com/report',
      confidence: 0.91,
      startPosition: 3421,
      endPosition: 3446,
      page: 19,
      metadata: { context: 'reference', protocol: 'https' }
    },
    {
      type: 'custom',
      text: 'API_V2_ENDPOINT',
      confidence: 0.85,
      startPosition: 4567,
      endPosition: 4583,
      page: 22,
      metadata: { context: 'technical', category: 'identifier' }
    }
  ];
}

// Complete implementation of generateMockSentimentAnalysis
export function generateMockSentimentAnalysis(): SentimentAnalysis {
  return {
    overall: 'positive' as const,
    confidence: 0.87,
    emotions: [
      { emotion: 'joy', intensity: 0.72, confidence: 0.84 },
      { emotion: 'optimism', intensity: 0.68, confidence: 0.79 },
      { emotion: 'confidence', intensity: 0.61, confidence: 0.76 },
      { emotion: 'satisfaction', intensity: 0.55, confidence: 0.82 },
      { emotion: 'enthusiasm', intensity: 0.49, confidence: 0.71 }
    ],
    subjectivity: 0.34,
    polarity: 0.23
  };
}

// Complete implementation of generateMockDocumentSummary
export function generateMockDocumentSummary(length: 'short' | 'medium' | 'long'): DocumentSummary {
  const summaries = {
    short: {
      abstract: 'This document analyzes current market trends and provides strategic recommendations for business growth.',
      keyPoints: [
        'Market growth of 15% projected over next quarter',
        'Digital transformation initiatives show promising results',
        'Customer satisfaction ratings improved significantly'
      ],
      conclusions: [
        'The organization is well-positioned for continued growth',
        'Investment in technology infrastructure is yielding positive returns',
        'Strategic partnerships are critical for future success'
      ],
      recommendations: [
        'Continue investment in digital transformation',
        'Expand market presence in emerging segments',
        'Strengthen customer engagement programs'
      ]
    },
    medium: {
      abstract: 'This comprehensive analysis examines current market dynamics, competitive landscape, and organizational performance metrics. The study evaluates key performance indicators, customer satisfaction metrics, and strategic initiatives implemented over the past year. Based on quantitative data analysis and stakeholder feedback, this document provides evidence-based insights and actionable recommendations for organizational improvement.',
      keyPoints: [
        'Market analysis reveals 15% growth potential in target segments',
        'Customer satisfaction scores increased from 72% to 89%',
        'Digital transformation initiatives generated 23% efficiency gains',
        'Competitive positioning improved across 4 key market categories',
        'Revenue diversification strategy reduced dependency risks by 31%',
        'Technology infrastructure investments show 18-month ROI',
        'Employee engagement metrics improved by 12 percentage points',
        'Sustainability initiatives align with regulatory requirements'
      ],
      conclusions: [
        'The organization demonstrates strong fundamentals for sustained growth',
        'Digital transformation investments are delivering measurable value',
        'Customer-centric approach has strengthened market position significantly',
        'Operational efficiency improvements provide competitive advantage',
        'Strategic partnerships and collaborations enhance market reach',
        'Technology adoption trends support future innovation initiatives'
      ],
      recommendations: [
        'Accelerate digital transformation across all business units',
        'Expand customer engagement programs based on success metrics',
        'Invest in advanced analytics capabilities for competitive advantage',
        'Strengthen strategic partnerships in emerging markets',
        'Implement comprehensive change management for technology adoption',
        'Develop talent acquisition strategy for technical skills gap',
        'Establish innovation labs for future product development',
        'Create sustainability roadmap aligned with ESG goals'
      ]
    },
    long: {
      abstract: 'This comprehensive business analysis provides a detailed examination of current organizational performance, market dynamics, and strategic positioning. The study encompasses quantitative analysis of key performance indicators, qualitative assessment of stakeholder feedback, and evaluation of strategic initiatives implemented throughout the assessment period. The findings reveal significant progress in digital transformation efforts, notable improvements in customer satisfaction metrics, and emerging opportunities for market expansion. The analysis identifies key success factors, potential challenges, and strategic recommendations to support continued organizational growth and competitive advantage in an evolving marketplace.',
      keyPoints: [
        'Market analysis demonstrates 15% growth potential in core business segments with emerging opportunities in adjacent markets',
        'Customer satisfaction metrics improved from baseline of 72% to current 89%, representing a 23.6% improvement',
        'Digital transformation initiatives delivered 23% operational efficiency gains across key business processes',
        'Competitive landscape analysis shows improved positioning in 4 of 6 critical market categories',
        'Revenue diversification strategy reduced single-market dependency from 67% to 36%, enhancing financial stability',
        'Technology infrastructure investments demonstrate 18-month average return on investment with ongoing benefits',
        'Employee engagement surveys show 12 percentage point improvement in satisfaction and commitment metrics',
        'Sustainability and ESG initiatives exceed regulatory requirements and stakeholder expectations',
        'Innovation pipeline includes 8 projects in development with projected market launch within 18 months',
        'Strategic partnerships expanded to include 12 new collaborations across technology and market development'
      ],
      conclusions: [
        'Organizational fundamentals demonstrate strong foundation for sustained competitive advantage and market growth',
        'Digital transformation investments are delivering measurable business value and operational efficiency improvements',
        'Customer-centric strategic approach has significantly strengthened market position and brand recognition',
        'Operational excellence initiatives provide sustainable competitive advantage through process optimization',
        'Strategic partnerships and collaborative relationships effectively enhance market reach and capability development',
        'Technology adoption trends and infrastructure investments support future innovation and scalability initiatives',
        'Human capital development programs improve organizational capability and prepare workforce for digital future',
        'Financial performance metrics indicate healthy growth trajectory with diversified revenue streams'
      ],
      recommendations: [
        'Accelerate digital transformation implementation across all organizational units with dedicated change management support',
        'Expand comprehensive customer engagement programs leveraging proven success metrics and feedback mechanisms',
        'Invest significantly in advanced analytics and data science capabilities to drive competitive advantage',
        'Strengthen strategic partnerships and collaborative relationships in emerging markets and technology sectors',
        'Implement enterprise-wide change management framework for technology adoption and organizational transformation',
        'Develop comprehensive talent acquisition and development strategy addressing technical skills gap and succession planning',
        'Establish dedicated innovation laboratories and research initiatives for future product development and market creation',
        'Create detailed sustainability roadmap and ESG implementation plan aligned with regulatory requirements and stakeholder expectations',
        'Implement advanced cybersecurity measures and data protection protocols supporting digital transformation initiatives',
        'Develop comprehensive performance measurement framework linking strategic initiatives to measurable business outcomes'
      ]
    }
  };

  return {
    ...summaries[length],
    length,
    confidence: 0.89
  };
}

// Complete implementation of generateMockKeywords
export function generateMockKeywords(): string[] {
  return [
    'digital transformation',
    'market analysis',
    'strategic planning',
    'customer satisfaction',
    'operational efficiency',
    'business growth',
    'competitive advantage',
    'technology infrastructure',
    'revenue diversification',
    'stakeholder engagement',
    'performance metrics',
    'innovation initiatives',
    'organizational development',
    'market positioning',
    'financial performance',
    'strategic partnerships',
    'sustainability',
    'risk management',
    'change management',
    'data analytics'
  ];
}

// Complete implementation of generateMockReadabilityMetrics
export function generateMockReadabilityMetrics(): ReadabilityMetrics {
  return {
    fleschReadingEase: 62.3,
    fleschKincaidGrade: 8.7,
    gunningFog: 10.2,
    smog: 9.8,
    automatedReadabilityIndex: 8.9,
    colemanLiauIndex: 11.1,
    level: 'standard' as const
  };
}

// Complete implementation of generateMockLanguageDetection
export function generateMockLanguageDetection(): LanguageDetection {
  return {
    primary: 'en',
    confidence: 0.96,
    alternatives: [
      { language: 'es', confidence: 0.03 },
      { language: 'fr', confidence: 0.01 }
    ],
    isTranslated: false
  };
}

// Complete implementation of generateMockDocumentContent
export function generateMockDocumentContent(): DocumentContent {
  const sampleText = `This comprehensive business analysis provides a detailed examination of current organizational performance, market dynamics, and strategic positioning. The study encompasses quantitative analysis of key performance indicators, qualitative assessment of stakeholder feedback, and evaluation of strategic initiatives implemented throughout the assessment period.

The analysis reveals significant progress in digital transformation efforts, notable improvements in customer satisfaction metrics, and emerging opportunities for market expansion. Key findings demonstrate strong fundamentals for sustained growth and competitive advantage.

The methodology employed follows industry best practices and ensures reliable, actionable insights for strategic decision-making. Data collection involved multiple sources including internal performance metrics, market research, and stakeholder interviews.

Results indicate that organizational investments in technology infrastructure and customer-centric initiatives are delivering measurable business value. The digital transformation program has achieved 23% operational efficiency gains across key business processes.

Conclusions support continued investment in strategic priorities while identifying specific areas for enhanced focus and resource allocation. Recommendations provide a roadmap for sustained competitive advantage and market growth.`;

  const extractedImages: ExtractedImage[] = [
    {
      id: 'img_001',
      filename: 'market_trends_chart.png',
      format: 'PNG',
      size: 245760,
      page: 7,
      position: { x: 100, y: 200, width: 400, height: 250 },
      altText: 'Market trends analysis chart',
      description: 'Quarterly market growth trends showing 15% increase'
    },
    {
      id: 'img_002',
      filename: 'customer_satisfaction_graph.jpg',
      format: 'JPG',
      size: 156890,
      page: 12,
      position: { x: 150, y: 180, width: 350, height: 220 },
      altText: 'Customer satisfaction improvement graph',
      description: 'Customer satisfaction scores from 72% to 89% over 12 months'
    }
  ];

  const extractedTables: ExtractedTable[] = [
    {
      id: 'table_001',
      data: [
        ['Metric', 'Q1 2024', 'Q2 2024', 'Q3 2024', 'Growth %'],
        ['Revenue', '$2.3M', '$2.7M', '$3.1M', '15%'],
        ['Customer Satisfaction', '72%', '81%', '89%', '23%'],
        ['Operational Efficiency', '78%', '85%', '89%', '14%'],
        ['Employee Engagement', '65%', '72%', '77%', '18%']
      ],
      headers: ['Metric', 'Q1 2024', 'Q2 2024', 'Q3 2024', 'Growth %'],
      page: 14,
      position: { x: 80, y: 300, width: 450, height: 180 }
    }
  ];

  return {
    text: sampleText,
    extractedImages,
    tables: extractedTables,
    metadata: {
      title: 'Business Analysis Report',
      author: 'Analysis Team',
      subject: 'Market Analysis',
      creationDate: new Date()
    }
  };
}
