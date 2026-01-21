
import React, { useState, useRef } from 'react';
import { Button } from './Button';
import { analyzeReport } from '../services/geminiService';
import { MarketReport } from '../types';

interface UploadModalProps {
  onClose: () => void;
  onUploadSuccess: (report: MarketReport) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ onClose, onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("请先选择一个文件");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const text = await file.text();
      const analysis = await analyzeReport(text);
      
      const newReport: MarketReport = {
        id: crypto.randomUUID(),
        title: analysis.title,
        uploadDate: new Date().toISOString(),
        reportDate: analysis.reportDate,
        fileName: file.name,
        summary: analysis.summary,
        keyInsights: analysis.keyInsights,
        sentiment: analysis.sentiment,
        category: analysis.category,
        content: text
      };

      onUploadSuccess(newReport);
      onClose();
    } catch (err: any) {
      setError(err.message || "上传或分析过程中出错");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">上传报告</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-8">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all ${
              file ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
            }`}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept=".txt,.md,.doc,.docx"
            />
            
            <svg className={`w-12 h-12 mb-4 ${file ? 'text-blue-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            
            <p className="text-sm font-medium text-gray-700">
              {file ? file.name : "点击或拖拽文件到此处上传"}
            </p>
            <p className="text-xs text-gray-400 mt-2">支持 .txt, .md 格式 (最大 10MB)</p>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          {isAnalyzing && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm font-medium text-blue-700">正在使用人工智能进行深度分析...</span>
              </div>
              <p className="text-xs text-blue-600 ml-8">我们将提取报告关键摘要、情绪分析和关键洞察。</p>
            </div>
          )}
        </div>

        <div className="p-6 bg-gray-50 flex justify-end space-x-3">
          <Button variant="secondary" onClick={onClose} disabled={isAnalyzing}>取消</Button>
          <Button variant="primary" onClick={handleUpload} isLoading={isAnalyzing} disabled={!file}>
            开始分析并上传
          </Button>
        </div>
      </div>
    </div>
  );
};
