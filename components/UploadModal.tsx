
import React, { useState, useRef } from 'react';
import { Button } from './Button';
import { analyzeReport } from '../services/geminiService';
import { MarketReport } from '../types';

interface UploadModalProps {
  onClose: () => void;
  onUploadSuccess: (report: MarketReport) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ onClose, onUploadSuccess }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentFileIndex, setCurrentFileIndex] = useState<number | null>(null);
  const [previews, setPreviews] = useState<MarketReport[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
      setError(null);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removePreview = (index: number) => {
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const startBatchAnalysis = async () => {
    if (files.length === 0) {
      setError("请先选择至少一个文件");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    const pendingFiles = [...files];
    setFiles([]); // Clear file list as they move to processing/preview

    try {
      for (let i = 0; i < pendingFiles.length; i++) {
        const file = pendingFiles[i];
        setCurrentFileIndex(i);
        
        const text = await file.text();
        const analysis = await analyzeReport(text);
        
        const previewReport: MarketReport = {
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

        setPreviews(prev => [...prev, previewReport]);
      }
    } catch (err: any) {
      setError(err.message || "分析过程中出错");
    } finally {
      setIsAnalyzing(false);
      setCurrentFileIndex(null);
    }
  };

  const handleConfirmUpload = () => {
    previews.forEach(report => {
      onUploadSuccess(report);
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-gray-800">
              {previews.length > 0 ? "预览并确认报告" : "批量上传报告"}
            </h2>
            <p className="text-xs text-gray-500">
              {previews.length > 0 ? `已分析 ${previews.length} 份报告，请核对信息` : "支持一次性分析多个市场文档"}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600" disabled={isAnalyzing}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-grow custom-scrollbar">
          {/* Analysis Results / Preview Section */}
          {previews.length > 0 && (
            <div className="space-y-6 mb-8">
              {previews.map((preview, idx) => (
                <div key={preview.id} className="border border-blue-100 rounded-xl bg-blue-50/30 overflow-hidden animate-in slide-in-from-bottom-2 duration-300">
                  <div className="p-4 bg-blue-50 border-b border-blue-100 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                        {preview.category}
                      </span>
                      <span className="text-xs font-medium text-blue-800 truncate max-w-[200px]">{preview.fileName}</span>
                    </div>
                    <button 
                      onClick={() => removePreview(idx)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="p-5">
                    <h4 className="font-bold text-gray-900 mb-2">{preview.title}</h4>
                    <p className="text-xs text-gray-600 mb-4 leading-relaxed">{preview.summary}</p>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">关键洞察</p>
                      <ul className="list-disc list-inside space-y-0.5">
                        {preview.keyInsights.slice(0, 3).map((insight, i) => (
                          <li key={i} className="text-xs text-gray-700 truncate">{insight}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Upload Input - Only show if not full-viewing or adding more */}
          {(!isAnalyzing && previews.length === 0) && (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center border-gray-300 hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all"
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept=".txt,.md,.doc,.docx"
                multiple
              />
              <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-sm font-medium text-gray-700">点击或选择多个文件进行上传</p>
              <p className="text-xs text-gray-400 mt-1">支持 .txt, .md 文本格式</p>
            </div>
          )}

          {/* Pending File List */}
          {files.length > 0 && !isAnalyzing && (
            <div className="mt-6 space-y-2">
              <div className="flex justify-between items-center mb-2 px-1">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">待处理文件 ({files.length})</h3>
                <button onClick={() => setFiles([])} className="text-xs text-red-500 hover:underline">清空</button>
              </div>
              <div className="space-y-2">
                {files.map((f, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50 text-sm">
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <span className="truncate font-medium text-gray-700">{f.name}</span>
                    </div>
                    <button onClick={() => removeFile(idx)} className="text-gray-400 hover:text-red-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          {isAnalyzing && currentFileIndex !== null && (
            <div className="mt-6 p-6 bg-blue-50 rounded-xl border border-blue-100 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <h3 className="font-bold text-blue-900 mb-1">AI 深度分析中...</h3>
              <p className="text-xs text-blue-600 mb-4">
                正在处理第 {currentFileIndex + 1} 份文件，共 {files.length + previews.length + (currentFileIndex)} 份
              </p>
              <div className="w-full max-w-xs bg-blue-200 rounded-full h-1.5 mb-2">
                <div 
                  className="bg-blue-600 h-1.5 rounded-full transition-all duration-500" 
                  style={{ width: `${((currentFileIndex + 1) / (files.length + currentFileIndex + 1)) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end space-x-3 shrink-0">
          <Button variant="secondary" onClick={onClose} disabled={isAnalyzing}>取消</Button>
          
          {previews.length > 0 ? (
            <>
              {!isAnalyzing && files.length > 0 && (
                <Button variant="secondary" onClick={startBatchAnalysis}>
                  分析剩余文件
                </Button>
              )}
              <Button variant="primary" onClick={handleConfirmUpload} disabled={isAnalyzing}>
                确认上传全部 ({previews.length})
              </Button>
            </>
          ) : (
            <Button variant="primary" onClick={startBatchAnalysis} isLoading={isAnalyzing} disabled={files.length === 0}>
              开始 AI 分析
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
