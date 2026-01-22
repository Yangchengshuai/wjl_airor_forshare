
import React, { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { Calculator, Mail, Lock, Loader2, AlertCircle, WifiOff, ArrowRight, ShieldCheck } from 'lucide-react';

interface AuthProps {
  onEnterOfflineMode?: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onEnterOfflineMode }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);
  const [isLogin, setIsLogin] = useState(true); // 新增：切换登录/注册模式

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (isLogin) {
        // 登录
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        // 注册
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;

        // 检查是否需要邮件确认
        if (data.user && !data.session) {
          setMessage({
            type: 'success',
            text: '注册成功！请检查您的邮箱并点击确认链接。'
          });
        } else if (data.session) {
          setMessage({
            type: 'success',
            text: '注册成功！正在跳转...'
          });
        }
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || '认证失败，请检查账号信息' });
    } finally {
      setLoading(false);
    }
  };

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center border border-slate-100">
          <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <WifiOff className="w-8 h-8 text-slate-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">未连接数据库</h2>
          <p className="text-slate-500 mb-8">
            检测到环境变量未配置。应用将以离线演示模式运行，数据无法保存。
          </p>
          
          <button
            onClick={onEnterOfflineMode}
            className="w-full bg-slate-900 text-white p-3 rounded-xl font-semibold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 flex items-center justify-center gap-2 group"
          >
            进入演示模式
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <div className="flex flex-col items-center justify-center gap-3 mb-8">
          <div className="bg-teal-600 p-2.5 rounded-xl">
            <Calculator className="w-7 h-7 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold text-slate-800 uppercase tracking-tight">AI项目ROI 评估助手</h1>
            <p className="text-xs font-bold text-teal-600 uppercase tracking-widest mt-1">系统与数据</p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-100 p-3 rounded-lg mb-6 flex items-center gap-2 text-amber-800 text-xs">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>仅限授权访问。</span>
        </div>

        {message && (
          <div className={`p-4 rounded-lg mb-6 flex items-start gap-3 text-sm ${
            message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
          }`}>
            <AlertCircle className="w-5 h-5 shrink-0" />
            {message.text}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">邮箱</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <input
                type="email"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">密码</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <input
                type="password"
                required
                minLength={6}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                placeholder="••••••••（至少6位）"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 text-white p-3 rounded-xl font-semibold hover:bg-teal-700 transition-all shadow-lg shadow-teal-100 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {isLogin ? '正在登录...' : '正在注册...'}
              </>
            ) : (
              isLogin ? '登录' : '注册'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage(null);
            }}
            className="text-sm text-teal-600 hover:text-teal-700 font-medium transition-colors"
          >
            {isLogin ? '还没有账号？立即注册' : '已有账号？返回登录'}
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400">
            如果您无法访问，请联系SSC系统与数据团队。
          </p>
        </div>
      </div>
    </div>
  );
};
