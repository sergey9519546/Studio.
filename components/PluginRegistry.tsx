import React, { useState, useCallback } from 'react';
import Card, { CardContent, CardHeader } from './ui/Card';
import Button from './ui/Button';
import Badge from './ui/Badge';
import Alert, { AlertDescription } from './ui/Alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/Tabs';
import { 
  Search, 
  Download, 
  Star, 
  Shield, 
  Zap, 
  Brain, 
  Image, 
  Mic, 
  FileText, 
  Settings, 
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  Filter,
  Grid,
  List,
  Package
} from 'lucide-react';

export interface Plugin {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  category: 'ai-processing' | 'data-analysis' | 'integration' | 'utility' | 'visualization';
  tags: string[];
  rating: number;
  downloads: number;
  price: 'free' | 'premium' | 'enterprise';
  status: 'installed' | 'available' | 'update-available' | 'disabled';
  icon: string;
  lastUpdated: Date;
  supportedFormats: string[];
  dependencies?: string[];
  isOfficial?: boolean;
  verified?: boolean;
}

export interface PluginInstallResult {
  success: boolean;
  pluginId: string;
  message: string;
  installedVersion?: string;
  error?: string;
}

const PluginRegistry: React.FC = () => {
  const [plugins, setPlugins] = useState<Plugin[]>([
    {
      id: 'vision-ai-processor',
      name: 'Vision AI Processor',
      description: 'Advanced computer vision capabilities for image analysis, object detection, and visual content understanding.',
      version: '2.1.0',
      author: 'AI Vision Labs',
      category: 'ai-processing',
      tags: ['vision', 'image-analysis', 'object-detection', 'ai'],
      rating: 4.8,
      downloads: 12500,
      price: 'premium',
      status: 'installed',
      icon: 'brain',
      lastUpdated: new Date('2024-11-15'),
      supportedFormats: ['jpg', 'png', 'gif', 'webp', 'bmp'],
      isOfficial: true,
      verified: true
    },
    {
      id: 'audio-transcriber',
      name: 'Audio Transcriber',
      description: 'Convert audio files to text with high accuracy transcription and speaker identification.',
      version: '1.5.2',
      author: 'SpeechTech Inc',
      category: 'ai-processing',
      tags: ['audio', 'transcription', 'speech-to-text', 'speaker-id'],
      rating: 4.6,
      downloads: 8900,
      price: 'free',
      status: 'available',
      icon: 'mic',
      lastUpdated: new Date('2024-11-20'),
      supportedFormats: ['mp3', 'wav', 'm4a', 'ogg', 'flac'],
      isOfficial: false,
      verified: true
    },
    {
      id: 'document-analyzer',
      name: 'Document Analyzer',
      description: 'Intelligent document processing with OCR, content extraction, and semantic analysis.',
      version: '3.0.1',
      author: 'DocuMind',
      category: 'ai-processing',
      tags: ['document', 'ocr', 'extraction', 'semantic-analysis'],
      rating: 4.9,
      downloads: 15600,
      price: 'enterprise',
      status: 'update-available',
      icon: 'file-text',
      lastUpdated: new Date('2024-11-25'),
      supportedFormats: ['pdf', 'docx', 'txt', 'rtf', 'odt'],
      isOfficial: true,
      verified: true
    },
    {
      id: 'data-visualizer',
      name: 'Data Visualizer',
      description: 'Create interactive charts and graphs from processed data with customizable templates.',
      version: '1.2.0',
      author: 'ChartMaster',
      category: 'visualization',
      tags: ['charts', 'graphs', 'data-viz', 'interactive'],
      rating: 4.4,
      downloads: 6700,
      price: 'premium',
      status: 'available',
      icon: 'image',
      lastUpdated: new Date('2024-11-10'),
      supportedFormats: ['json', 'csv', 'xml'],
      isOfficial: false,
      verified: false
    },
    {
      id: 'api-connector',
      name: 'API Connector',
      description: 'Connect to external APIs and services for extended functionality and data sources.',
      version: '2.3.1',
      author: 'ConnectHub',
      category: 'integration',
      tags: ['api', 'integration', 'external-services', 'rest'],
      rating: 4.3,
      downloads: 4300,
      price: 'free',
      status: 'disabled',
      icon: 'settings',
      lastUpdated: new Date('2024-10-28'),
      supportedFormats: ['json', 'xml'],
      isOfficial: false,
      verified: false
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [installingPlugin, setInstallingPlugin] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  const categories = [
    { id: 'all', label: 'All Categories', count: plugins.length },
    { id: 'ai-processing', label: 'AI Processing', count: plugins.filter(p => p.category === 'ai-processing').length },
    { id: 'data-analysis', label: 'Data Analysis', count: plugins.filter(p => p.category === 'data-analysis').length },
    { id: 'integration', label: 'Integration', count: plugins.filter(p => p.category === 'integration').length },
    { id: 'utility', label: 'Utility', count: plugins.filter(p => p.category === 'utility').length },
    { id: 'visualization', label: 'Visualization', count: plugins.filter(p => p.category === 'visualization').length }
  ];

  const filteredPlugins = plugins.filter(plugin => {
    const matchesSearch = plugin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plugin.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plugin.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || plugin.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || plugin.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const showAlert = useCallback((type: 'success' | 'error' | 'info', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  }, []);

  const installPlugin = useCallback(async (pluginId: string): Promise<PluginInstallResult> => {
    setInstallingPlugin(pluginId);
    
    // Simulate installation process
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
    
    const plugin = plugins.find(p => p.id === pluginId);
    if (!plugin) {
      return { success: false, pluginId, message: 'Plugin not found', error: 'Plugin not found' };
    }

    // Update plugin status
    setPlugins(prev => prev.map(p => 
      p.id === pluginId 
        ? { ...p, status: 'installed', version: p.version }
        : p
    ));

    setInstallingPlugin(null);
    
    const result: PluginInstallResult = {
      success: true,
      pluginId,
      message: `${plugin.name} installed successfully`,
      installedVersion: plugin.version
    };

    showAlert('success', result.message);
    return result;
  }, [plugins, showAlert]);

  const uninstallPlugin = useCallback(async (pluginId: string) => {
    const plugin = plugins.find(p => p.id === pluginId);
    if (!plugin) return;

    setPlugins(prev => prev.map(p => 
      p.id === pluginId ? { ...p, status: 'available' } : p
    ));

    showAlert('info', `${plugin.name} uninstalled successfully`);
  }, [plugins, showAlert]);

  const enablePlugin = useCallback((pluginId: string) => {
    setPlugins(prev => prev.map(p => 
      p.id === pluginId ? { ...p, status: 'installed' } : p
    ));
    
    const plugin = plugins.find(p => p.id === pluginId);
    if (plugin) {
      showAlert('success', `${plugin.name} enabled successfully`);
    }
  }, [plugins, showAlert]);

  const disablePlugin = useCallback((pluginId: string) => {
    setPlugins(prev => prev.map(p => 
      p.id === pluginId ? { ...p, status: 'disabled' } : p
    ));
    
    const plugin = plugins.find(p => p.id === pluginId);
    if (plugin) {
      showAlert('info', `${plugin.name} disabled successfully`);
    }
  }, [plugins, showAlert]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'ai-processing': return <Brain className="w-4 h-4" />;
      case 'data-analysis': return <FileText className="w-4 h-4" />;
      case 'integration': return <Settings className="w-4 h-4" />;
      case 'utility': return <Zap className="w-4 h-4" />;
      case 'visualization': return <Image className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getPriceColor = (price: string) => {
    switch (price) {
      case 'free': return 'success';
      case 'premium': return 'warning';
      case 'enterprise': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'installed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'update-available': return <Download className="w-4 h-4 text-blue-500" />;
      case 'disabled': return <XCircle className="w-4 h-4 text-gray-500" />;
      case 'available': return <Download className="w-4 h-4 text-gray-400" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Package className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Plugin Registry</h1>
            <p className="text-gray-600">Discover and manage AI processing plugins</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">
            {plugins.filter(p => p.status === 'installed').length} Installed
          </Badge>
          <Badge variant="outline">
            {plugins.filter(p => p.status === 'available').length} Available
          </Badge>
        </div>
      </div>

      {/* Alert */}
      {alert && (
        <Alert variant={alert.type === 'error' ? 'destructive' : alert.type}>
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search plugins..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.label} ({category.count})
                  </option>
                ))}
              </select>
              
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="installed">Installed</option>
                <option value="available">Available</option>
                <option value="update-available">Update Available</option>
                <option value="disabled">Disabled</option>
              </select>

              <div className="flex border rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plugin Grid/List */}
      <div className={viewMode === 'grid' 
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
        : "space-y-4"
      }>
        {filteredPlugins.map((plugin) => (
          <Card key={plugin.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    {getCategoryIcon(plugin.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{plugin.name}</h3>
                    <p className="text-sm text-gray-500">v{plugin.version} by {plugin.author}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {plugin.verified && <Shield className="w-4 h-4 text-green-500" />}
                  {plugin.isOfficial && <Star className="w-4 h-4 text-yellow-500" />}
                  {getStatusIcon(plugin.status)}
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{plugin.description}</p>
              
              <div className="flex flex-wrap gap-1 mb-4">
                {plugin.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" size="sm">
                    {tag}
                  </Badge>
                ))}
                {plugin.tags.length > 3 && (
                  <Badge variant="outline" size="sm">
                    +{plugin.tags.length - 3}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>{plugin.rating}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Download className="w-4 h-4" />
                    <span>{plugin.downloads.toLocaleString()}</span>
                  </div>
                </div>
                <Badge variant={getPriceColor(plugin.price)} size="sm">
                  {plugin.price}
                </Badge
