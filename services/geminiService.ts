
import { GoogleGenAI, Type } from "@google/genai";
import { GeminiAnalysisResponse } from "../types";

// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});.
// The API key must be obtained exclusively from process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeReport = async (text: string): Promise<GeminiAnalysisResponse> => {
  // Use gemini-3-flash-preview for summarization and intelligent text analysis tasks.
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `请分析以下市场报告内容，并以JSON格式返回分析结果。语言必须使用中文。
    内容如下：
    ${text.substring(0, 10000)}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "报告的简短标题" },
          reportDate: { type: Type.STRING, description: "报告所属日期 (格式: YYYY-MM-DD)" },
          summary: { type: Type.STRING, description: "报告的核心摘要 (100字以内)" },
          keyInsights: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "3-5条关键洞察"
          },
          sentiment: { 
            type: Type.STRING, 
            description: "市场情绪 (positive, neutral, negative)" 
          },
          category: { type: Type.STRING, description: "报告所属的市场分类 (如: 股市, 宏观经济, 大宗商品等)" }
        },
        required: ["title", "reportDate", "summary", "keyInsights", "sentiment", "category"]
      }
    }
  });

  // Accessing the generated text using the .text property as per @google/genai guidelines.
  const jsonStr = response.text;
  if (!jsonStr) {
    throw new Error("分析失败：未获取到有效的分析内容");
  }

  try {
    const data = JSON.parse(jsonStr.trim());
    return data;
  } catch (error) {
    console.error("Failed to parse Gemini response", error);
    throw new Error("无法解析 AI 分析结果，请稍后重试");
  }
};
