
import React, { useState, useEffect, useMemo } from 'react';
import { InputSection } from './InputSection';
import { ResultsPanel } from './ResultsPanel';
import { ProjectInputs, CalculationResult, Assessment } from '../types';
import { Calculator, ArrowLeft, Save, Loader2, Check, WifiOff } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

interface CalculatorViewProps {
  initialAssessment: Assessment | null;
  onBack: () => void;
}

export const CalculatorView: React.FC<CalculatorViewProps> = ({ initialAssessment, onBack }) => {
  const [currentId, setCurrentId] = useState<string | null>(initialAssessment?.id || null);
  const [name, setName] = useState(initialAssessment?.name || '未命名评估项目');
  
  // Default Inputs
  const defaultInputs: ProjectInputs = {
    background: '',
    monthlyHours: 160,
    hrMonthlySalary: 6000,
    devManMonths: 10,
    devManMonthCostWan: 5.7,
    opexYearlyWan: 2,
    capexWan: 5,
  };

  const [inputs, setInputs] = useState<ProjectInputs>(
    initialAssessment?.inputs || defaultInputs
  );

  // Lifted state for AI Analysis to allow persistence
  const [aiAnalysis, setAiAnalysis] = useState<string>(initialAssessment?.ai_analysis || '');

  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Calculate Logic (Same as original App.tsx)
  const results = useMemo<CalculationResult>(() => {
    const STANDARD_MONTHLY_HOURS = 176;
    const hourlyRate = inputs.hrMonthlySalary / STANDARD_MONTHLY_HOURS;
    const monthlyBenefit = hourlyRate * inputs.monthlyHours;

    const initialDevCost = inputs.devManMonths * (inputs.devManMonthCostWan * 10000);
    const initialCapex = inputs.capexWan * 10000;
    const totalInitialInvestment = initialDevCost + initialCapex;

    const monthlyOpex = (inputs.opexYearlyWan * 10000) / 12;
    const monthlyNetFlow = monthlyBenefit - monthlyOpex;

    let breakEvenMonth = null;
    if (monthlyNetFlow > 0) {
      breakEvenMonth = Math.ceil(totalInitialInvestment / monthlyNetFlow);
    }

    const PROJECTION_MONTHS = 36;
    const totalBenefit3Years = monthlyBenefit * PROJECTION_MONTHS;
    const totalOpex3Years = monthlyOpex * PROJECTION_MONTHS;
    const threeYearNetProfit = totalBenefit3Years - totalOpex3Years - totalInitialInvestment;

    const roiPercent = totalInitialInvestment > 0 
      ? (threeYearNetProfit / totalInitialInvestment) * 100 
      : 0;

    return {
      hourlyRate,
      monthlyBenefit,
      monthlyOpex,
      monthlyNetFlow,
      initialDevCost,
      initialCapex,
      totalInitialInvestment,
      breakEvenMonth,
      roiPercent,
      threeYearNetProfit,
      isPositive: threeYearNetProfit > 0,
    };
  }, [inputs]);

  const handleSave = async () => {
    if (!isSupabaseConfigured) return;

    setSaving(true);
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("Not authenticated");

      const payload = {
        name,
        inputs,
        ai_analysis: aiAnalysis, // Save the AI text
        user_id: user.id,
        updated_at: new Date().toISOString(),
      };

      let error;
      if (currentId) {
        // Update existing record
        const res = await supabase
          .from('assessments')
          .update(payload)
          .eq('id', currentId);
        error = res.error;
      } else {
        // Create new record
        const res = await supabase
          .from('assessments')
          .insert(payload)
          .select()
          .single();
        
        if (res.data) {
          setCurrentId(res.data.id); // Update ID so subsequent saves are updates
        }
        error = res.error;
      }

      if (error) throw error;
      setLastSaved(new Date());
    } catch (e) {
      console.error("Save failed", e);
      alert("保存失败，请重试");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-teal-100 selection:text-teal-800">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            {isSupabaseConfigured && (
              <button 
                onClick={onBack}
                className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div className="flex items-center gap-3">
              <div className="bg-teal-600 p-2 rounded-lg hidden sm:block">
                <Calculator className="w-5 h-5 text-white" />
              </div>
              <input 
                value={name}
                onChange={(e) => setName(e.target.value)}
                readOnly={!isSupabaseConfigured}
                className={`text-lg font-bold text-slate-800 bg-transparent rounded px-2 py-1 outline-none w-full max-w-md transition-all ${isSupabaseConfigured ? 'hover:bg-slate-50 border border-transparent hover:border-slate-200 focus:ring-2 focus:ring-teal-500' : 'cursor-default'}`}
                placeholder="输入项目名称..."
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {lastSaved && (
              <span className="text-xs text-slate-400 hidden sm:block">
                已保存 {lastSaved.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
            )}
            
            {isSupabaseConfigured ? (
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-all shadow-sm disabled:opacity-70"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    保存中
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    保存
                  </>
                )}
              </button>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-500 rounded-lg text-xs font-medium border border-slate-200">
                <WifiOff className="w-3 h-3" />
                离线模式 (未连接数据库)
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Inputs */}
          <div className="lg:col-span-4 h-auto lg:h-[calc(100vh-8rem)] lg:sticky lg:top-24 overflow-y-auto custom-scrollbar">
            <InputSection inputs={inputs} setInputs={setInputs} />
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-8">
            <ResultsPanel 
              results={results} 
              inputs={inputs} 
              aiAdvice={aiAnalysis}
              onUpdateAdvice={setAiAnalysis}
            />
          </div>
        </div>
      </main>
    </div>
  );
};
