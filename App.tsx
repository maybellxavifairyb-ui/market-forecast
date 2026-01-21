
import React, { useState, useEffect, useMemo } from 'react';
import { MarketReport } from './types';
import { ReportCard } from './components/ReportCard';
import { UploadModal } from './components/UploadModal';
import { ReportDetail } from './components/ReportDetail';
import { Button } from './components/Button';

const App: React.FC = () => {
  const [reports, setReports] = useState<MarketReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<MarketReport | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('全部');

  // Load from localStorage on mount with basic validation
  useEffect(() => {
    const saved = localStorage.getItem('market_reports');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setReports(parsed as MarketReport[]);
        }
      } catch (e) {
        console.error("Failed to restore reports from localStorage", e);
      }
    }
  }, []);

  // Save to localStorage when reports change
  useEffect(() => {
    localStorage.setItem('market_reports', JSON.stringify(reports));
  }, [reports]);

  const handleUploadSuccess = (newReport: MarketReport) => {
    setReports(prev => [newReport, ...prev]);
  };

  // Explicitly typing categories to prevent 'unknown' inference and fix potential .map() errors.
  const categories = useMemo<string[]>(() => {
    const cats = ['全部', ...Array.from(new Set(reports.map(r => r.category)))];
    return cats;
  }, [reports]);

  // Explicitly typing sortedAndFilteredReports to maintain correct flow in downstream computations.
  const sortedAndFilteredReports = useMemo<MarketReport[]>(() => {
    let result = [...reports];
    
    // Sort by reportDate desc
    result.sort((a, b) => new Date(b.reportDate).getTime() - new Date(a.reportDate).getTime());
    
    // Filter by search
    if (searchQuery) {
      result = result.filter(r => 
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        r.summary.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (activeCategory !== '全部') {
      result = result.filter(r => r.category === activeCategory);
    }
    
    return result;
  }, [reports, searchQuery, activeCategory]);

  // Explicitly typing the return value of reportsByYearMonth to ensure Object.entries results are typed.
  const reportsByYearMonth = useMemo<Record<string, MarketReport[]>>(() => {
    const groups: Record<string, MarketReport[]> = {};
    sortedAndFilteredReports.forEach(report => {
      const date = new Date(report.reportDate);
      const key = `${date.getFullYear()}年 ${date.getMonth() + 1}月`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(report);
    });
    return groups;
  }, [sortedAndFilteredReports]);

  if (selectedReport) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ReportDetail 
          report={selectedReport} 
          onBack={() => setSelectedReport(null)} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">每周市场报告智能分析</h1>
              <p className="text-xs text-gray-500 font-medium">Windows 专业版 | AI 驱动</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 flex-grow max-w-xl">
            <div className="relative flex-grow">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input 
                type="text"
                placeholder="搜索报告标题或摘要..."
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={() => setIsUploadModalOpen(true)} className="whitespace-nowrap">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              上传新报告
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto p-6 md:p-10">
        {/* Category Filters */}
        <div className="mb-8 flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                activeCategory === cat 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Reports List */}
        {reports.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-gray-100 p-8 rounded-full mb-6">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">暂无报告</h2>
            <p className="text-gray-500 max-w-md mx-auto mb-8">
              目前还没有上传任何市场报告。点击上方“上传新报告”按钮开始使用 AI 进行市场趋势分析。
            </p>
            <Button variant="primary" onClick={() => setIsUploadModalOpen(true)} className="px-8">
              立即开始上传
            </Button>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(reportsByYearMonth).map(([month, reportsInMonth]) => (
              <section key={month} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800 mr-4">{month}</h2>
                  <div className="h-px bg-gray-200 flex-grow"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {reportsInMonth.map(report => (
                    <ReportCard 
                      key={report.id} 
                      report={report} 
                      onClick={(r) => setSelectedReport(r)} 
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 px-6 mt-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>© 2024 每周市场报告智能分析系统 - 您的智能投资助手</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-blue-500 transition-colors">隐私政策</a>
            <a href="#" className="hover:text-blue-500 transition-colors">使用条款</a>
            <a href="#" className="hover:text-blue-500 transition-colors">联系支持</a>
          </div>
        </div>
      </footer>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <UploadModal 
          onClose={() => setIsUploadModalOpen(false)} 
          onUploadSuccess={handleUploadSuccess} 
        />
      )}
    </div>
  );
};

export default App;
