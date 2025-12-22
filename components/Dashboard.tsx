import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Assessment } from '../types';
import { Plus, FileText, Calendar, ChevronRight, LogOut, Loader2 } from 'lucide-react';

interface DashboardProps {
  onSelectAssessment: (assessment: Assessment) => void;
  onNewAssessment: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onSelectAssessment, onNewAssessment }) => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      const { data, error } = await supabase
        .from('assessments')
        .select('*')
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      setAssessments(data || []);
    } catch (error) {
      console.error('Error loading assessments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800">我的评估项目</h1>
          <button 
            onClick={handleSignOut}
            className="text-sm text-slate-500 hover:text-slate-800 flex items-center gap-1"
          >
            <LogOut className="w-4 h-4" />
            退出
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-lg font-semibold text-slate-700">项目列表 ({assessments.length})</h2>
          <button
            onClick={onNewAssessment}
            className="bg-teal-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-teal-700 shadow-sm flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            新建评估
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
          </div>
        ) : assessments.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900">暂无项目</h3>
            <p className="text-slate-500 mt-1 mb-6">创建一个新的 AI 投资 ROI 评估模型。</p>
            <button
              onClick={onNewAssessment}
              className="text-teal-600 font-medium hover:underline"
            >
              立即创建 &rarr;
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assessments.map((assessment) => (
              <div 
                key={assessment.id}
                onClick={() => onSelectAssessment(assessment)}
                className="bg-white p-6 rounded-xl border border-slate-200 hover:border-teal-400 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-teal-50 p-2 rounded-lg">
                    <FileText className="w-5 h-5 text-teal-600" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-teal-500 transition-colors" />
                </div>
                <h3 className="font-bold text-slate-800 mb-2 truncate pr-2" title={assessment.name}>
                  {assessment.name}
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Calendar className="w-3 h-3" />
                  {new Date(assessment.updated_at).toLocaleDateString()}
                </div>
                {assessment.inputs && (
                    <p className="mt-4 text-xs text-slate-500 line-clamp-2 h-8">
                        {assessment.inputs.background || "无背景描述..."}
                    </p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};