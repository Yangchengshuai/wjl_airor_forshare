import React, { useMemo, useState } from 'react';
import { CalculationResult, ProjectInputs, ChartDataPoint } from '../types';
import { getAIAnalysis } from '../services/geminiService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine, AreaChart, Area } from 'recharts';
import ReactMarkdown from 'react-markdown';
import { Sparkles, TrendingUp, RefreshCw, Calculator, ArrowRight } from 'lucide-react';

interface ResultsPanelProps {
  results: CalculationResult;
  inputs: ProjectInputs;
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({ results, inputs }) => {
  const [aiAdvice, setAiAdvice] = useState<string>("");
  const [loadingAi, setLoadingAi] = useState<boolean>(false);

  const chartData = useMemo<ChartDataPoint[]>(() => {
    const data: ChartDataPoint[] = [];
    // Show at least 24 months, or up to break even + 6 months, max 60 months
    const maxMonths = Math.min(60, Math.max(24, (results.breakEvenMonth || 0) + 6));

    for (let i = 0; i <= maxMonths; i++) {
      // Month 0 is just the initial investment (negative)
      // Month 1 is Initial + NetFlow * 1
      const cumulativeFlow = -results.totalInitialInvestment + (results.monthlyNetFlow * i);
      
      data.push({
        month: i,
        cumulativeCashFlow: cumulativeFlow,
        investmentLine: 0, 
      });
    }
    return data;
  }, [results]);

  const handleGenerateAdvice = async () => {
    setLoadingAi(true);
    const advice = await getAIAnalysis(inputs, results);
    setAiAdvice(advice);
    setLoadingAi(false);
  };

  const formatCurrency = (val: number) => {
    if (Math.abs(val) >= 10000) return `¥${(val / 10000).toFixed(1)}万`;
    return `¥${val.toFixed(0)}`;
  };

  return (
    <div className="flex flex-col gap-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-4 rounded-xl border-l-4 shadow-sm bg-white ${results.isPositive ? 'border-teal-600' : 'border-red-500'}`}>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">3年期 ROI</p>
          <div className={`text-2xl font-bold mt-1 ${results.isPositive ? 'text-teal-600' : 'text-red-500'}`}>
            {results.roiPercent.toFixed(1)}%
          </div>
        </div>
        <div className="p-4 rounded-xl border-l-4 border-slate-300 shadow-sm bg-white">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">3年期净利润</p>
          <div className={`text-2xl font-bold mt-1 ${results.threeYearNetProfit > 0 ? 'text-slate-800' : 'text-red-500'}`}>
            {formatCurrency(results.threeYearNetProfit)}
          </div>
        </div>
        <div className="p-4 rounded-xl border-l-4 border-slate-300 shadow-sm bg-white">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">回本周期</p>
          <div className="text-2xl font-bold mt-1 text-slate-800">
            {results.breakEvenMonth ? `${results.breakEvenMonth} 个月` : '无法回本'}
          </div>
        </div>
        <div className="p-4 rounded-xl border-l-4 border-slate-300 shadow-sm bg-white">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">初始总投入</p>
          <div className="text-2xl font-bold mt-1 text-slate-800">
            {formatCurrency(results.totalInitialInvestment)}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-teal-600" />
          现金流回收预测 (累计净值)
        </h3>
        {/* Fixed height container to ensure Recharts renders correctly */}
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 25, right: 20, left: 10, bottom: 25 }}>
              <defs>
                <linearGradient id="colorFlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00726d" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#00726d" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="month" 
                label={{ value: '月份', position: 'insideBottomRight', offset: 0 }} 
                stroke="#64748b"
                tick={{fontSize: 12}}
              />
              <YAxis 
                tickFormatter={formatCurrency} 
                stroke="#64748b"
                tick={{fontSize: 12}}
              />
              <Tooltip 
                formatter={(value: number) => formatCurrency(value)}
                labelFormatter={(label) => `第 ${label} 个月`}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <ReferenceLine y={0} stroke="#000" strokeDasharray="3 3" />
              {results.breakEvenMonth && (
                 <ReferenceLine x={results.breakEvenMonth} stroke="#ef4444" strokeDasharray="3 3" label={{ value: "回本点", position: 'top', fill: '#ef4444', fontSize: 12 }} />
              )}
              <Area 
                type="monotone" 
                dataKey="cumulativeCashFlow" 
                name="累计净现金流" 
                stroke="#00726d" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorFlow)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Calculation Transparency */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm">
        <h3 className="text-sm font-bold text-slate-600 mb-4 flex items-center gap-2 uppercase tracking-wide">
          <Calculator className="w-4 h-4" />
          财务模型计算详情
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm text-slate-700">
          
          <div className="flex flex-col gap-1">
            <span className="text-slate-500 text-xs">1. 人力成本折算</span>
            <div className="flex items-center gap-2 font-mono bg-white p-2 rounded border border-slate-100">
              <span>时薪</span>
              <span className="text-slate-400">=</span>
              <span>{inputs.hrMonthlySalary} <span className="text-xs text-slate-400">/月</span> ÷ 176小时</span>
              <span className="text-slate-400">=</span>
              <span className="font-bold text-teal-700">¥{results.hourlyRate.toFixed(1)}/时</span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-slate-500 text-xs">2. 月度总收益 (Benefit)</span>
            <div className="flex items-center gap-2 font-mono bg-white p-2 rounded border border-slate-100">
              <span>¥{results.hourlyRate.toFixed(1)}</span>
              <span className="text-slate-400">×</span>
              <span>{inputs.monthlyHours}小时</span>
              <span className="text-slate-400">=</span>
              <span className="font-bold text-teal-700">{formatCurrency(results.monthlyBenefit)}/月</span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-slate-500 text-xs">3. 初始一次性投入 (Initial Cost)</span>
            <div className="flex items-center gap-2 font-mono bg-white p-2 rounded border border-slate-100">
              <span title="产研投入">{formatCurrency(results.initialDevCost)}</span>
              <span className="text-slate-400">+</span>
              <span title="CAPEX">{formatCurrency(results.initialCapex)}</span>
              <span className="text-slate-400">=</span>
              <span className="font-bold text-red-600">{formatCurrency(results.totalInitialInvestment)}</span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-slate-500 text-xs">4. 月度净现金流 (Net Flow)</span>
            <div className="flex items-center gap-2 font-mono bg-white p-2 rounded border border-slate-100">
              <span title="月度收益">{formatCurrency(results.monthlyBenefit)}</span>
              <span className="text-slate-400">-</span>
              <span title="月度OPEX">({inputs.opexYearlyWan}万 ÷ 12)</span>
              <span className="text-slate-400">=</span>
              <span className={`font-bold ${results.monthlyNetFlow > 0 ? 'text-teal-700' : 'text-red-600'}`}>
                {formatCurrency(results.monthlyNetFlow)}/月
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Advice Section */}
      <div className="bg-teal-50 border border-teal-100 rounded-2xl p-6 shadow-sm shrink-0">
        <div className="flex flex-wrap justify-between items-center mb-4 gap-3">
          <h3 className="text-lg font-bold text-teal-800 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-600" />
            AI 投资顾问
          </h3>
          <button
            onClick={handleGenerateAdvice}
            disabled={loadingAi}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              loadingAi 
                ? 'bg-teal-200 text-teal-700 cursor-not-allowed' 
                : 'bg-teal-600 text-white hover:bg-teal-700 shadow-md hover:shadow-lg'
            }`}
          >
            {loadingAi ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                分析中...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                生成评估报告
              </>
            )}
          </button>
        </div>
        
        <div className="prose prose-sm prose-teal max-w-none text-slate-700 bg-white p-4 rounded-xl border border-teal-100 min-h-[100px] overflow-x-auto break-words">
          {aiAdvice ? (
            <ReactMarkdown>{aiAdvice}</ReactMarkdown>
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-400 h-full py-6">
              <Sparkles className="w-8 h-8 mb-2 opacity-50" />
              <p>点击“生成评估报告”以获取 AI 驱动的战略建议。</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};