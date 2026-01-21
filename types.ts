
export interface MarketReport {
  id: string;
  title: string;
  uploadDate: string;
  reportDate: string;
  fileName: string;
  summary: string;
  keyInsights: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  category: string;
  content: string;
}

export interface GeminiAnalysisResponse {
  title: string;
  reportDate: string;
  summary: string;
  keyInsights: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  category: string;
}
