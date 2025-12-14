import React, { useState, useCallback, useRef } from 'react';
import Card, { CardContent, CardHeader } from './ui/Card';
import Button from './ui/Button';
import Progress from './ui/Progress';
import Badge from './ui/Badge';
import Alert, { AlertDescription } from './ui/Alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/Tabs';
import { 
  Play, 
  Square, 
  Upload, 
  Download, 
  FileText, 
  Image, 
  Mic, 
  Settings, 
  Brain, 
  Zap,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

export interface AIProcessingTask {
  id: string;
  type: 'audio' | 'document' | 'image' | 'multimodal';
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  inputFile?: File;
  results?: any;
  error?: string;
  startedAt?: Date;
  completedAt?: Date;
  duration?: number;
}

export interface OrchestrationResult {
  taskId: string;
  summary: string;
  insights: string[];
  metadata: Record<string, any>;
  recommendations: string[];
  exportFormats: string[];
}

export interface OrchestratorConfig {
  maxConcurrentTasks: number;
  enableAutoProcessing: boolean;
  exportFormat: 'json' | 'csv' | 'pdf' | 'html';
  enableNotifications: boolean;
  timeoutMs: number;
}

const EnhancedAIOrchestrator: React.FC = () => {
  const [tasks, setTasks] = useState<AIProcessingTask[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [config] = useState<OrchestratorConfig>({
    maxConcurrentTasks: 3,
    enableAutoProcessing: true,
    exportFormat: 'json',
    enableNotifications: true,
    timeoutMs: 300000
  });
  const [results, setResults] = useState<Record<string, OrchestrationResult>>({});
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async (file: File, taskId: string): Promise<any> => {
    const fileType = file.type.startsWith('image/') ? 'image' : 
                    file.type.startsWith('audio/') ? 'audio' : 
                    file.type.startsWith('text/') || file.type.includes('document') ? 'document' : 
                    'unknown';

    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));

    switch (fileType) {
      case 'image':
        return {
          type: 'image',
          analysis: {
            objects: ['person', 'laptop', 'desk'],
            colors: ['blue', 'white', 'gray'],
            mood: 'professional',
            quality: 'high'
          },
          metadata: {
            dimensions: '1920x1080',
            format: file.type,
            size: file.size
          }
        };
      case 'audio':
        return {
          type: 'audio',
          transcription: 'This is a mock transcription of the audio content...',
          sentiment: 'positive',
          duration: 180,
          language: 'en-US',
          metadata: {
            format: file.type,
            bitrate: '128kbps',
            sampleRate: '44.1kHz'
          }
        };
      case 'document':
        return {
          type: 'document',
          content: 'This is the extracted text content from the document...',
          summary: 'Document summary based on AI analysis',
          keywords: ['important', 'relevant', 'key'],
          sentiment: 'neutral',
          metadata: {
            wordCount: 1250,
            pages: 5,
            format: file.type
          }
        };
      default:
        return {
          type: 'unknown',
          error: 'Unsupported file type'
        };
    }
  }, []);

  const addTask = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const newTasks: AIProcessingTask[] = fileArray.map((file, index) => ({
      id: `task-${Date.now()}-${index}`,
      type: file.type.startsWith('image/') ? 'image' : 
            file.type.startsWith('audio/') ? 'audio' : 
            file.type.startsWith('text/') || file.type.includes('document') ? 'document' : 
            'multimodal',
      status: 'pending',
      progress: 0,
      inputFile: file
    }));

    setTasks(prev => [...prev, ...newTasks]);

    if (config.enableAutoProcessing) {
      processTasks(newTasks);
    }
  }, [config.enableAutoProcessing]);

  const processTasks = useCallback(async (taskList: AIProcessingTask[]) => {
    if (isProcessing) return;

    setIsProcessing(true);
    setError(null);

    const batches: AIProcessingTask[][] = [];
    for (let i = 0; i < taskList.length; i += config.maxConcurrentTasks) {
      batches.push(taskList.slice(i, i + config.maxConcurrentTasks));
    }

    for (const batch of batches) {
      const batchPromises = batch.map(async (task) => {
        try {
          setTasks(prev => prev.map(t => 
            t.id === task.id ? { ...t, status: 'processing', startedAt: new Date() } : t
          ));
          setCurrentTaskId(task.id);

          const progressInterval = setInterval(() => {
            setTasks(prev => prev.map(t => {
              if (t.id === task.id && t.status === 'processing') {
                const newProgress = Math.min(t.progress + Math.random() * 15, 95);
                return { ...t, progress: newProgress };
              }
              return t;
            }));
          }, 500);

          const result = await processFile(task.inputFile!, task.id);

          clearInterval(progressInterval);

          setTasks(prev => prev.map(t => 
            t.id === task.id ? { 
              ...t, 
              status: 'completed', 
              progress: 100, 
              results: result,
              completedAt: new Date()
            } : t
          ));

          const orchestrationResult: OrchestrationResult = {
            taskId: task.id,
            summary: `Successfully processed ${task.type} file: ${task.inputFile?.name}`,
            insights: [
              `File type detected: ${task.type}`,
              `Processing completed successfully`,
              `Results ready for export`
            ],
            metadata: {
              fileName: task.inputFile?.name,
              fileType: task.inputFile?.type,
              fileSize: task.inputFile?.size,
              processingTime: new Date().getTime() - (task.startedAt?.getTime() || 0),
              ...result.metadata
            },
            recommendations: [
              'Review processed results',
              'Consider additional analysis if needed',
              'Export results for external use'
            ],
            exportFormats: ['json', 'csv', 'pdf']
          };

          setResults(prev => ({
            ...prev,
            [task.id]: orchestrationResult
          }));

          return result;
        } catch (error) {
          setTasks(prev => prev.map(t => 
            t.id === task.id ? { 
              ...t, 
              status: 'error', 
              error: error instanceof Error ? error.message : 'Processing failed'
            } : t
          ));
          throw error;
        }
      });

      try {
        await Promise.all(batchPromises);
      } catch (error) {
        setError(`Batch processing error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    setIsProcessing(false);
    setCurrentTaskId(null);
  }, [isProcessing, config.maxConcurrentTasks, processFile]);

  const exportResults = useCallback((taskId: string, format: 'json' | 'csv' | 'pdf' | 'html') => {
    const result = results[taskId];
    if (!result) {
      setError(`No results found for task ${taskId}`);
      return;
    }

    let content: string;
    let mimeType: string;
    let filename: string;

    switch (format) {
      case 'json':
        content = JSON.stringify(result, null, 2);
        mimeType = 'application/json';
        filename = `ai-results-${taskId}.json`;
        break;
      case 'csv':
        content = `Task ID,${result.taskId}\nSummary,"${result.summary}"\nInsights,"${result.insights.join('; ')}"\nRecommendations,"${result.recommendations.join('; ')}"`;
        mimeType = 'text/csv';
        filename = `ai-results-${taskId}.csv`;
        break;
      case 'pdf':
        content = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj

2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<< /Length 200 >>
stream
BT
/F1 12 Tf
50 700 Td
(AI Processing Results) Tj
0 -20 Td
(Task ID: ${result.taskId}) Tj
0 -20 Td
(Summary: ${result.summary}) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000010 00000 n 
0000000053 00000 n 
0000000100 00000 n 
0000000179 00000 n 
trailer
<< /Size 5 /Root 1 0 R >>
startxref
400
%%EOF`;
        mimeType = 'application/pdf';
        filename = `ai-results-${taskId}.pdf`;
        break;
      case 'html':
        content = `<!DOCTYPE html>
<html>
<head>
    <title>AI Processing Results</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
        .section { margin-bottom: 30px; }
        .insights, .recommendations { background: #f5f5f5; padding: 15px; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>AI Processing Results</h1>
        <p><strong>Task ID:</strong> ${result.taskId}</p>
    </div>
    
    <div class="section">
        <h2>Summary</h2>
        <p>${result.summary}</p>
    </div>
    
    <div class="section">
        <h2>Insights</h2>
        <ul class="insights">
            ${result.insights.map(insight => `<li>${insight}</li>`).join('')}
        </ul>
    </div>
    
    <div class="section">
        <h2>Recommendations</h2>
        <ul class="recommendations">
            ${result.recommendations.map(rec => `<li>${rec}</li>`).join('')}
        </ul>
    </div>
</body>
</html>`;
        mimeType = 'text/html';
        filename = `ai-results-${taskId}.html`;
        break;
      default:
        setError(`Unsupported export format: ${format}`);
        return;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [results]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      addTask(files);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [addTask]);

  const startProcessing = useCallback(() => {
    const pendingTasks = tasks.filter(t => t.status === 'pending');
    if (pendingTasks.length > 0) {
      processTasks(pendingTasks);
    }
  }, [tasks, processTasks]);

  const stopProcessing = useCallback(() => {
    setIsProcessing(false);
    setCurrentTaskId(null);
    setTasks(prev => prev.map(t => 
      t.status === 'processing' ? { ...t, status: 'pending' } : t
    ));
  }, []);

  const clearCompleted = useCallback(() => {
    setTasks(prev => prev.filter(t => t.status !== 'completed'));
  }, []);

  const getTaskStatusIcon = (status: AIProcessingTask['status']) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-gray-500" />;
      case 'processing': return <Zap className="w-4 h-4 text-blue-500 animate-pulse" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getFileTypeIcon = (type: AIProcessingTask['type']) => {
    switch (type) {
      case 'image': return <Image className="w-4 h-4" />;
      case 'audio': return <Mic className="w-4 h-4" />;
      case 'document': return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Brain className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Orchestrator</h1>
            <p className="text-gray-600">Process and analyze files with AI</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={isProcessing ? "destructive" : "secondary"}>
            {isProcessing ? "Processing" : "Idle"}
          </Badge>
          {currentTaskId && (
            <Badge variant="outline">
              Current: {currentTaskId}
            </Badge>
          )}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Control Panel */}
      <Card>
        <CardHeader>
          <h3 className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Control Panel</span>
          </h3>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                accept="image/*,audio/*,.pdf,.doc,.docx,.txt"
              />
              <Button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                leftIcon={<Upload className="w-4 h-4" />}
              >
                Upload Files
              </Button>
              
              <Button 
                onClick={startProcessing}
                disabled={isProcessing || tasks.filter(t => t.status === 'pending').length === 0}
                variant="default"
                leftIcon={<Play className="w-4 h-4" />}
              >
                Start Processing
              </Button>
              
              <Button 
                onClick={stopProcessing}
                disabled={!isProcessing}
                variant="destructive"
                leftIcon={<Square className="w-4 h-4" />}
              >
                Stop Processing
              </Button>
              
              <Button 
                onClick={clearCompleted}
                variant="outline"
                disabled={tasks.filter(t => t.status === 'completed').length === 0}
              >
                Clear Completed
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tasks Panel */}
      {tasks.length > 0 && (
        <Card>
          <CardHeader>
            <h3 className="flex items-center space-x-2">
              <Brain className="w-5 h-5" />
              <span>Processing Tasks ({tasks.length})</span>
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getFileTypeIcon(task.type)}
                      <div>
                        <p className="font-medium">{task.inputFile?.name}</p>
                        <p className="text-sm text-gray-500">
                          {task.inputFile?.type} • {((task.inputFile?.size || 0) / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <div className
