
import React from 'react';
import { MarketReport } from '../types';

interface ReportCardProps {
  report: MarketReport;
  onClick: (report: MarketReport) => void;
}

export const ReportCard: React.FC<ReportCardProps> = ({ report, onClick }) => {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-700 border-green-200';
      case 'negative': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getSentimentText = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return '乐观';
      case 'negative': return '悲观';
      default: return '中性';
    }
  };

  return (
    <div 
      onClick={() => onClick(report)}
      className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all cursor-pointer group flex flex-col h-full"
    >
      <div className="flex justify-between items-start mb-3">
        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
          {report.category}
        </span>
        <span className={`text-xs px-2 py-1 rounded border ${getSentimentColor(report.sentiment)}`}>
          市场情绪: {getSentimentText(report.sentiment)}
        </span>
      </div>
      
      <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2">
        {report.title}
      </h3>
      
      <p className="text-sm text-gray-500 mb-4 line-clamp-3 flex-grow">
        {report.summary}
      </p>
      
      <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center text-gray-400">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-xs font-medium">{report.reportDate}</span>
        </div>
        <div className="text-xs text-gray-400">
          上传: {new Date(report.uploadDate).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};
