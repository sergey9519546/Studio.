import React, { useState, useCallback } from 'react';
import { FileSpreadsheet, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

interface ImportZoneProps {
  onImportComplete?: () => void;
}

export const ImportZone: React.FC<ImportZoneProps> = ({ onImportComplete }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length === 0) return;

    const file = files[0];
    // Simple validation
    if (!file.name.match(/\.(xlsx|csv)$/i)) {
      setUploadStatus('error');
      setMessage('Please upload an Excel (.xlsx) or CSV file.');
      return;
    }

    uploadFile(file);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFile(e.target.files[0]);
    }
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setUploadStatus('idle');
    setMessage('AI is analyzing structure...');

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Assuming API URL is relative or proxied if not set
      // Use configured env or default to /api/v1 (proxy)
      const apiUrl = import.meta.env.VITE_API_URL || '/api/v1';

      // If apiUrl already contains /api/v1, don't append /projects/import directly if it duplicates
      // But typically apiUrl is base.
      // If apiUrl is /api/v1, then url is /api/v1/projects/import

      const endpoint = apiUrl.endsWith('/projects/import') ? apiUrl : `${apiUrl}/projects/import`;

      await axios.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadStatus('success');
      setMessage('Projects imported successfully.');
      if (onImportComplete) onImportComplete();

      setTimeout(() => {
        setUploadStatus('idle');
        setMessage('');
      }, 3000);
    } catch (error) {
      console.error(error);
      setUploadStatus('error');
      if (axios.isAxiosError(error) && error.response) {
         setMessage(`Import failed: ${error.response.data.message || error.message}`);
      } else {
         setMessage('Import failed. Please check file format.');
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-8">
      <motion.div
        layout
        className={`
          relative overflow-hidden rounded-2xl border-2 border-dashed transition-colors duration-200 ease-in-out
          ${isDragging ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200 hover:border-slate-300 bg-white/50'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".xlsx,.csv"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          onChange={handleFileSelect}
          disabled={isUploading}
        />

        <div className="p-12 flex flex-col items-center justify-center text-center space-y-4">
          <AnimatePresence mode="wait">
            {isUploading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center"
              >
                <div className="relative">
                    <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin relative z-10" />
                </div>
                <p className="mt-4 text-sm font-medium text-slate-600">{message}</p>
              </motion.div>
            ) : uploadStatus === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center"
              >
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Import Complete</h3>
                <p className="text-sm text-slate-500">{message}</p>
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center"
              >
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                   <FileSpreadsheet className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Drop project schedule
                </h3>
                <p className="text-sm text-slate-500 max-w-xs">
                  Drag and drop your Excel or CSV file here.
                  <br />
                  <span className="text-xs text-slate-400">AI will automatically map columns.</span>
                </p>
                {uploadStatus === 'error' && (
                  <div className="mt-4 flex items-center gap-2 text-red-500 text-sm bg-red-50 px-3 py-1.5 rounded-full">
                    <AlertCircle className="w-4 h-4" />
                    <span>{message}</span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
