import { GoogleGenAI } from "@google/genai";
import { ProjectInputs, CalculationResult } from "../types";

// Helper to safely get environment variables without crashing in browser
const getApiKey = () => {
  try {
    // Check for Vite environment variables (VITE_ prefix is standard for exposed vars)
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_KEY) {
      // @ts-ignore
      return import.meta.env.VITE_API_KEY;
    }
  } catch (e) {
    // Ignore errors
  }

  try {
    // Check for standard process.env (Node.js or polyfilled environments)
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      return process.env.API_KEY;
    }
  } catch (e) {
    // Ignore errors
  }

  return '';
};

// Initialize with a safe key (empty string if missing) to prevent startup crash.
// Calls will fail gracefully inside the function if key is invalid.
const ai = new GoogleGenAI({ apiKey: getApiKey() });

export const getAIAnalysis = async (inputs: ProjectInputs, results: CalculationResult): Promise<string> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    return "API Key 未配置。请在 Vercel 环境变量中设置 VITE_API_KEY (推荐) 或 API_KEY。";
  }

  const prompt = `
    你是一位高级 AI 投资顾问兼业务线“CFO”（当前支持公司的HR业务线）。今天，公司的HR+AI创新业务团队，承报了如下项目规划数据，请基于以下最新的财务模型分析该 AI 项目提案：

    **1. 业务价值估算：**
    - 项目背景：${inputs.background || "未提供描述"}
    - 目标岗位（HR运营）月薪：¥${inputs.hrMonthlySalary.toLocaleString()}
    - 每月节省工时：${inputs.monthlyHours} 小时
    - **折算月度收益：¥${results.monthlyBenefit.toLocaleString()}** (基于时薪折算)

    **2. 成本结构分析：**
    - **初始投入 (一次性)：¥${results.totalInitialInvestment.toLocaleString()}**
      - 其中产研投入：${inputs.devManMonths} 人月 × ¥${(inputs.devManMonthCostWan * 10000).toLocaleString()}/月
      - 其中 CAPEX (外部采购)：¥${(inputs.capexWan * 10000).toLocaleString()}
    - **运营支出 (OPEX)：¥${(inputs.opexYearlyWan * 10000).toLocaleString()}/年** (即 ¥${results.monthlyOpex.toLocaleString()}/月)

    **3. 财务指标预测 (3年期)：**
    - **月度净现金流：¥${results.monthlyNetFlow.toLocaleString()}**
    - **回本周期：${results.breakEvenMonth ? `${results.breakEvenMonth} 个月` : '3年内无法回本'}**
    - 3年期 ROI：${results.roiPercent.toFixed(1)}%
    - 3年期净利润：¥${results.threeYearNetProfit.toLocaleString()}

    **任务：**
    请提供一份简明扼要、专业的评估意见（请使用中文回答）。
    1. **投资结论：** 这是一个值得投入的项目吗？（强烈推荐/推荐/谨慎/不推荐）
    2. **风险提示：** 重点关注 OPEX 占比和研发人月投入是否合理。
    3. **优化建议：** 给出 3 条具体的改进 ROI 的建议（例如：通过 SOP 标准化降低研发人月，或谈判降低外部采购 CAPEX）。
    4. **what-if：** 给出3~4个**使得项目三年ROI为正/或进一步增加ROI的what-if条件，可以是多条件组合。（例如：如果你将产研人数从12人月降低至6人月，你将获得3年期ROI为64.7%，那么我将可以通过该项目）
    **输出要求：**
    1. 请使用 Markdown格式输出，不要使用表格等复杂结构。风格要直接、客观、数据驱动。
    2. 给出报告正文内容即可，无需输出日期、评估人、致信XXX等内容。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 } 
      }
    });

    return response.text || "暂时无法生成分析。";
  } catch (error) {
    console.error("Error fetching AI analysis:", error);
    return "生成 AI 分析时出错。请检查您的 API 密钥配置。";
  }
};