import React, { useState } from 'react';
import { WorkoutProvider, useWorkout } from './context/WorkoutContext';
import { BottomNavBar, TabType } from './components/BottomNavBar';
import { RestTimerModal } from './components/RestTimerModal';

import { HomeScreen } from './screens/HomeScreen';
import { RoutinesScreen } from './screens/RoutinesScreen';
import { ActiveWorkoutScreen } from './screens/ActiveWorkoutScreen';
import { ExerciseLibraryScreen } from './screens/ExerciseLibraryScreen';
import { AnalyticsScreen } from './screens/AnalyticsScreen';

const MainAppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');

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
