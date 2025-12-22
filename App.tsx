import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from './services/supabaseClient';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import { CalculatorView } from './components/CalculatorView';
import { Assessment } from './types';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'dashboard' | 'calculator'>('dashboard');
  const [currentAssessment, setCurrentAssessment] = useState<Assessment | null>(null);
  const [isOfflineSession, setIsOfflineSession] = useState(false);

  useEffect(() => {
    // If Supabase is not configured, we stop loading and wait for user interaction in Auth component
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
      </div>
    );
  }

  // Show Auth if no session (and not in offline override mode)
  if (!session && !isOfflineSession) {
    return <Auth onEnterOfflineMode={() => setIsOfflineSession(true)} />;
  }

  // Router Logic
  if (currentView === 'calculator') {
    return (
      <CalculatorView 
        initialAssessment={currentAssessment} 
        onBack={() => {
          setCurrentView('dashboard');
          setCurrentAssessment(null);
        }} 
      />
    );
  }

  return (
    <Dashboard
      isOffline={isOfflineSession || !isSupabaseConfigured}
      onNewAssessment={() => {
        setCurrentAssessment(null);
        setCurrentView('calculator');
      }}
      onSelectAssessment={(assessment) => {
        setCurrentAssessment(assessment);
        setCurrentView('calculator');
      }}
    />
  );
};

export default App;