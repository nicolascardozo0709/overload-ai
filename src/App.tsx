import React, { useState } from 'react';
import { WorkoutProvider, useWorkout } from './context/WorkoutContext';
import { BottomNavBar, TabType } from './components/BottomNavBar';
import { RestTimerModal } from './components/RestTimerModal';
import { AICoachChatModal } from './components/AICoachChatModal';
import { Sparkles } from 'lucide-react';

import { HomeScreen } from './screens/HomeScreen';
import { RoutinesScreen } from './screens/RoutinesScreen';
import { ActiveWorkoutScreen } from './screens/ActiveWorkoutScreen';
import { ExerciseLibraryScreen } from './screens/ExerciseLibraryScreen';
import { AnalyticsScreen } from './screens/AnalyticsScreen';

const MainAppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isCoachOpen, setIsCoachOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans antialiased selection:bg-cyan-500 selection:text-black">
      {/* Viewport Content with iOS top safe area */}
      <main className="flex-1 overflow-x-hidden pt-[env(safe-area-inset-top,12px)] pb-28">
        {activeTab === 'home' && (
          <HomeScreen onNavigateTab={setActiveTab} />
        )}

        {activeTab === 'routines' && (
          <RoutinesScreen onStartWorkout={() => setActiveTab('workout')} />
        )}

        {activeTab === 'workout' && (
          <ActiveWorkoutScreen 
            onFinishWorkout={() => setActiveTab('analytics')}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'exercises' && (
          <ExerciseLibraryScreen />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsScreen />
        )}
      </main>

      {/* Floating AI Coach Trigger Button */}
      <button
        onClick={() => setIsCoachOpen(true)}
        className="fixed bottom-24 right-4 z-40 flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-black text-xs shadow-xl shadow-cyan-500/30 hover:scale-105 active:scale-95 transition-all group border border-white/20"
        title="Abrir Coach Virtual IA"
      >
        <Sparkles className="w-4 h-4 fill-black group-hover:rotate-12 transition-transform" />
        <span>Coach IA</span>
      </button>

      {/* Virtual AI Coach Modal */}
      <AICoachChatModal isOpen={isCoachOpen} onClose={() => setIsCoachOpen(false)} />

      {/* Floating Rest Timer Modal */}
      <RestTimerModal />

      {/* iOS Bottom Tab Bar */}
      <BottomNavBar activeTab={activeTab} onSelectTab={setActiveTab} />
    </div>
  );
};

export function App() {
  return (
    <WorkoutProvider>
      <MainAppContent />
    </WorkoutProvider>
  );
}

export default App;
