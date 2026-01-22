
import React from 'react';
import { MarketReport } from '../types';

interface ReportCardProps {
  report: MarketReport;
  onClick: (report: MarketReport) => void;
  isSelected?: boolean;
  onToggleSelect?: () => void;
}

export const ReportCard: React.FC<ReportCardProps> = ({ report, onClick, isSelected, onToggleSelect }) => {
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

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleSelect?.();
  };

  return (
    <div 
      onClick={() => onClick(report)}
      className={`relative bg-white border rounded-xl p-5 hover:shadow-lg transition-all cursor-pointer group flex flex-col h-full ${
        isSelected ? 'border-blue-500 ring-1 ring-blue-500 bg-blue-50/10' : 'border-gray-200'
      }`}
    >
      {/* Checkbox */}
      <div 
        onClick={handleCheckboxClick}
        className={`absolute top-4 right-4 w-5 h-5 rounded border flex items-center justify-center transition-colors z-10 ${
          isSelected ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300 group-hover:border-blue-400'
        }`}
      >
        {isSelected && (
          <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
      </div>

      <div className="flex justify-between items-start mb-3 pr-8">
        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
          {report.category}
        </span>
      </div>
      
      <div className="mb-2">
        <span className={`text-[10px] px-1.5 py-0.5 rounded border inline-block mb-2 font-medium ${getSentimentColor(report.sentiment)}`}>
          市场情绪: {getSentimentText(report.sentiment)}
        </span>
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
          {report.title}
        </h3>
      </div>
      
      <p className="text-sm text-gray-500 mb-4 line-clamp-3 flex-grow leading-relaxed">
        {report.summary}
      </p>
      
      <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center text-gray-400">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-xs font-medium">{report.reportDate}</span>
        </div>
        <div className="text-[10px] text-gray-400 italic">
          {report.fileName}
        </div>
      </div>
    </div>
  );
};
