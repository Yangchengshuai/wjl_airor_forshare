import React from 'react';
import { ProjectInputs } from '../types';
import { Clock, DollarSign, Briefcase, Database, Users, TrendingUp, Layers } from 'lucide-react';

interface InputSectionProps {
  inputs: ProjectInputs;
  setInputs: React.Dispatch<React.SetStateAction<ProjectInputs>>;
}

export const InputSection: React.FC<InputSectionProps> = ({ inputs, setInputs }) => {
  
  const handleChange = (field: keyof ProjectInputs, value: any) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 min-h-full flex flex-col gap-8">
      
      {/* Section 1: Benefit Estimation */}
      <div className="space-y-4">
        <div className="border-b border-slate-100 pb-2">
          <h2 className="text-lg font-bold text-teal-700 flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            1. 收益估算 (Benefit)
          </h2>
        </div>

        {/* Background */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">
            项目背景与痛点
          </label>
          <textarea
            className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-600 focus:border-transparent outline-none transition-all text-sm resize-none h-20 bg-slate-50"
            placeholder="例如：客服团队花费太多时间回答重复性问题..."
            value={inputs.background}
            onChange={(e) => handleChange('background', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
           {/* HR Salary */}
           <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Users className="w-4 h-4 text-teal-600" />
              HR运营人员月薪 (¥)
            </label>
            <input
              type="number"
              min="0"
              className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-600 focus:border-transparent outline-none transition-all text-sm bg-slate-50"
              value={inputs.hrMonthlySalary}
              onChange={(e) => handleChange('hrMonthlySalary', Number(e.target.value))}
            />
            <p className="text-xs text-slate-400">从事该工作的员工大概市场价格，例如 6000元/月。</p>
          </div>

          {/* Monthly Hours */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-600" />
              每月工时投入 (小时)
            </label>
            <input
              type="number"
              min="0"
              className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-600 focus:border-transparent outline-none transition-all text-sm bg-slate-50"
              value={inputs.monthlyHours}
              onChange={(e) => handleChange('monthlyHours', Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      {/* Section 2: Cost Structure */}
      <div className="space-y-4">
        <div className="border-b border-slate-100 pb-2">
          <h2 className="text-lg font-bold text-teal-700 flex items-center gap-2">
            <Database className="w-5 h-5" />
            2. 投入成本 (Cost)
          </h2>
        </div>

        {/* Dev Man Months */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Users className="w-4 h-4 text-teal-600" />
              产研人月数量
            </label>
            <input
              type="number"
              min="0"
              step="0.5"
              className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-600 focus:border-transparent outline-none transition-all text-sm bg-slate-50"
              value={inputs.devManMonths}
              onChange={(e) => handleChange('devManMonths', Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-teal-600" />
              单人月成本(万)
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
              className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-600 focus:border-transparent outline-none transition-all text-sm bg-slate-50"
              value={inputs.devManMonthCostWan}
              onChange={(e) => handleChange('devManMonthCostWan', Number(e.target.value))}
            />
          </div>
        </div>
        <div className="p-3 bg-teal-50 rounded-lg text-xs text-teal-800 flex justify-between items-center">
          <span>产研总报价估算:</span>
          <span className="font-bold text-sm">¥{(inputs.devManMonths * inputs.devManMonthCostWan).toFixed(2)}万</span>
        </div>

        {/* Advanced Settings */}
        <div className="pt-2">
          <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
            <Layers className="w-4 h-4 text-teal-600" />
            进阶设置 (其他成本)
          </label>
          
          <div className="grid grid-cols-1 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
             {/* OPEX */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-600 flex flex-wrap justify-between items-center gap-2">
                <span>年度 OPEX (运营支出)</span>
                <span className="text-xs bg-slate-200 px-2 py-0.5 rounded text-slate-500 whitespace-nowrap">每年计入</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  className="w-full p-2 pr-8 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-600 focus:border-transparent outline-none text-sm"
                  value={inputs.opexYearlyWan}
                  onChange={(e) => handleChange('opexYearlyWan', Number(e.target.value))}
                />
                <span className="absolute right-3 top-2 text-sm text-slate-400">万</span>
              </div>
              <p className="text-xs text-slate-400">如 Token 消耗、RPA 续费等。</p>
            </div>

            {/* CAPEX */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-600 flex flex-wrap justify-between items-center gap-2">
                <span>一次性 CAPEX (资本支出)</span>
                <span className="text-xs bg-slate-200 px-2 py-0.5 rounded text-slate-500 whitespace-nowrap">一次性</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  className="w-full p-2 pr-8 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-600 focus:border-transparent outline-none text-sm"
                  value={inputs.capexWan}
                  onChange={(e) => handleChange('capexWan', Number(e.target.value))}
                />
                <span className="absolute right-3 top-2 text-sm text-slate-400">万</span>
              </div>
              <p className="text-xs text-slate-400">如外部能力采购、软件买断费等。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};