
import React from 'react';
import { MarketReport } from '../types';
import { Button } from './Button';

interface ReportDetailProps {
  report: MarketReport;
  onBack: () => void;
}

export const ReportDetail: React.FC<ReportDetailProps> = ({ report, onBack }) => {
  const getSentimentText = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return { label: '乐观 (Positive)', color: 'text-green-600 bg-green-50' };
      case 'negative': return { label: '悲观 (Negative)', color: 'text-red-600 bg-red-50' };
      default: return { label: '中性 (Neutral)', color: 'text-gray-600 bg-gray-50' };
    }
  };

  const sentiment = getSentimentText(report.sentiment);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 animate-in slide-in-from-right duration-300">
      <div className="mb-6 flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center text-gray-500 hover:text-blue-600 font-medium transition-colors"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回列表
        </button>
        <div className="flex space-x-2">
          <Button variant="secondary" className="text-sm">下载报告</Button>
          <Button variant="ghost" className="text-sm text-red-500 hover:bg-red-50">删除</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center space-x-3 mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full uppercase">
                {report.category}
              </span>
              <span className="text-gray-400 text-sm">{report.reportDate}</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">{report.title}</h1>
            
            <div className="prose max-w-none text-gray-700 leading-relaxed">
              <h3 className="text-lg font-bold text-gray-800 mb-3 border-l-4 border-blue-600 pl-3">AI 核心摘要</h3>
              <p className="bg-blue-50/30 p-4 rounded-xl mb-8 italic">
                "{report.summary}"
              </p>

              <h3 className="text-lg font-bold text-gray-800 mb-4 border-l-4 border-blue-600 pl-3">原始报告内容</h3>
              <div className="whitespace-pre-wrap font-sans bg-gray-50 p-6 rounded-xl border border-gray-100 text-sm">
                {report.content}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">AI 关键洞察</h3>
            <ul className="space-y-4">
              {report.keyInsights.map((insight, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="bg-blue-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center shrink-0 mr-3 mt-1">
                    {idx + 1}
                  </span>
                  <span className="text-sm text-gray-700 font-medium leading-snug">{insight}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">分析维度</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-400 mb-1">市场情绪</p>
                <div className={`text-sm font-bold px-3 py-2 rounded-lg inline-block ${sentiment.color}`}>
                  {sentiment.label}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">文件名</p>
                <p className="text-sm font-medium text-gray-700 truncate">{report.fileName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">处理时间</p>
                <p className="text-sm font-medium text-gray-700">
                  {new Date(report.uploadDate).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
