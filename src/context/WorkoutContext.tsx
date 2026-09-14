import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Exercise, 
  Routine, 
  WorkoutSession, 
  UserStats, 
  ExerciseSessionLog, 
  SetLog,
  UserProfile 
} from '../types';
import { storageService } from '../services/storageService';
import { calculateOverloadScore, calculateStreak } from '../services/progressiveOverloadAI';

interface WorkoutContextType {
  exercises: Exercise[];
  routines: Routine[];
  workoutHistory: WorkoutSession[];
  stats: UserStats;
  activeWorkout: WorkoutSession | null;
  restTimer: { active: boolean; remainingSeconds: number; totalSeconds: number };
  
  // Perfiles de usuario (Nico, Mi Novia, etc.)
  profiles: UserProfile[];
  activeProfile: UserProfile;
  switchProfile: (profileId: string) => void;
  createNewProfile: (name: string, avatarEmoji?: string, color?: string) => void;
  updateProfileName: (name: string, emoji?: string) => void;
  
  // Acciones
  addExercise: (exercise: Omit<Exercise, 'id'>) => void;
  addRoutine: (routine: Omit<Routine, 'id' | 'createdAt'>) => void;
  updateRoutine: (routine: Routine) => void;
  deleteRoutine: (id: string) => void;
  
  startWorkout: (routine?: Routine) => void;
  updateActiveWorkout: (session: WorkoutSession) => void;
  addSetToExercise: (exerciseIndex: number) => void;
  updateSet: (exerciseIndex: number, setIndex: number, fields: Partial<SetLog>) => void;
  removeSet: (exerciseIndex: number, setIndex: number) => void;
  addExerciseToActiveWorkout: (exercise: Exercise) => void;
  finishWorkout: () => { pointsEarned: number; prsAchieved: number; feedback: string };
  cancelWorkout: () => void;

  startRestTimer: (seconds: number) => void;
  stopRestTimer: () => void;
  adjustRestTimer: (deltaSeconds: number) => void;

  triggerConfetti: () => void;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [activeProfile, setActiveProfile] = useState<UserProfile>({
    id: 'profile-nico',
    name: 'Nico',
    avatarEmoji: '⚡',
    color: '#00F0FF',
    createdAt: new Date().toISOString()
  });

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutSession[]>([]);
  const [stats, setStats] = useState<UserStats>({
    streakDays: 1,
    totalWorkouts: 0,
    totalVolumeKg: 0,
    weeklyGoal: 4,
    weeklyCompleted: 0,
    points: 50
  });
  const [activeWorkout, setActiveWorkout] = useState<WorkoutSession | null>(null);

  // Timer de descanso
  const [restTimer, setRestTimer] = useState<{ active: boolean; remainingSeconds: number; totalSeconds: number }>({
    active: false,
    remainingSeconds: 0,
    totalSeconds: 0
  });

  // Cargar datos iniciales
  useEffect(() => {
    const loadedProfiles = storageService.getProfiles();
    const currentActiveProfile = storageService.getActiveProfile();
    const pid = currentActiveProfile.id;

    setProfiles(loadedProfiles);
    setActiveProfile(currentActiveProfile);

    setExercises(storageService.getExercises());
    setRoutines(storageService.getRoutines(pid));
    setWorkoutHistory(storageService.getWorkoutHistory(pid));
    setStats(storageService.getUserStats(pid));
    setActiveWorkout(storageService.getActiveWorkout(pid));
  }, []);

  const switchProfile = (profileId: string) => {
    storageService.setActiveProfileId(profileId);
    const target = storageService.getActiveProfile();
    setActiveProfile(target);

    // Cargar datos aislados del perfil seleccionado
    setRoutines(storageService.getRoutines(profileId));
    setWorkoutHistory(storageService.getWorkoutHistory(profileId));
    setStats(storageService.getUserStats(profileId));
    setActiveWorkout(storageService.getActiveWorkout(profileId));
  };

  const createNewProfile = (name: string, avatarEmoji: string = '✨', color: string = '#FF2D55') => {
    const created = storageService.createProfile(name, avatarEmoji, color);
    const all = storageService.getProfiles();
    setProfiles(all);
    switchProfile(created.id);
  };

  const updateProfileName = (name: string, emoji: string = '⚡') => {
    const updated: UserProfile = { ...activeProfile, name, avatarEmoji: emoji };
    const all = profiles.map(p => p.id === updated.id ? updated : p);
    setProfiles(all);
    setActiveProfile(updated);
    storageService.saveProfiles(all);
  };

  // Intervalo del timer de descanso
  useEffect(() => {
    let interval: any = null;
    if (restTimer.active && restTimer.remainingSeconds > 0) {
      interval = setInterval(() => {
        setRestTimer(prev => {
          if (prev.remainingSeconds <= 1) {
            // Sonido o vibración suave al terminar descanso
            if (navigator.vibrate) navigator.vibrate([150, 100, 150]);
            return { ...prev, active: false, remainingSeconds: 0 };
          }
          return { ...prev, remainingSeconds: prev.remainingSeconds - 1 };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [restTimer.active, restTimer.remainingSeconds]);

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const addExercise = (newEx: Omit<Exercise, 'id'>) => {
    const created: Exercise = {
      ...newEx,
      id: `custom-ex-${Date.now()}`,
      isCustom: true
    };
    const updated = [created, ...exercises];
    setExercises(updated);
    storageService.saveExercises(updated);
  };

  const addRoutine = (newRoutine: Omit<Routine, 'id' | 'createdAt'>) => {
    const created: Routine = {
      ...newRoutine,
      id: `routine-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    const updated = [created, ...routines];
    setRoutines(updated);
    storageService.saveRoutines(updated);
  };

  const updateRoutine = (updatedRoutine: Routine) => {
    const updated = routines.map(r => r.id === updatedRoutine.id ? updatedRoutine : r);
    setRoutines(updated);
    storageService.saveRoutines(updated);
  };

  const deleteRoutine = (id: string) => {
    const updated = routines.filter(r => r.id !== id);
    setRoutines(updated);
    storageService.saveRoutines(updated);
  };

  const startWorkout = (routine?: Routine) => {
    let sessionExercises: ExerciseSessionLog[] = [];

    if (routine) {
      sessionExercises = routine.exercises.map(config => {
        const exerciseData = exercises.find(e => e.id === config.exerciseId);
        const name = exerciseData?.name || 'Ejercicio';
        const category = exerciseData?.category || 'Pecho';

        const sets: SetLog[] = Array.from({ length: config.targetSets }, (_, i) => ({
          id: `set-${Date.now()}-${i}`,
          setNumber: i + 1,
          weightKg: 0,
          reps: 0,
          completed: false,
          targetReps: config.targetRepsMin
        }));

        return {
          exerciseId: config.exerciseId,
          exerciseName: name,
          category,
          sets
        };
      });
    }

    const newSession: WorkoutSession = {
      id: `workout-${Date.now()}`,
      routineId: routine?.id,
      routineName: routine ? routine.name : 'Entrenamiento Libre',
      startTime: new Date().toISOString(),
      durationSeconds: 0,
      exercises: sessionExercises,
      totalVolumeKg: 0,
      completed: false
    };

    setActiveWorkout(newSession);
    storageService.saveActiveWorkout(newSession);
  };

  const updateActiveWorkout = (session: WorkoutSession) => {
    setActiveWorkout(session);
    storageService.saveActiveWorkout(session);
  };

  const addSetToExercise = (exerciseIndex: number) => {
    if (!activeWorkout) return;
    const updated = { ...activeWorkout };
    const ex = updated.exercises[exerciseIndex];
    if (!ex) return;

    const lastSet = ex.sets[ex.sets.length - 1];
    const nextSetNumber = ex.sets.length + 1;
    const newSet: SetLog = {
      id: `set-${Date.now()}-${nextSetNumber}`,
      setNumber: nextSetNumber,
      weightKg: lastSet ? lastSet.weightKg : 20,
      reps: lastSet ? lastSet.reps : 8,
      completed: false,
      targetReps: lastSet?.targetReps || 8
    };

    ex.sets.push(newSet);
    updateActiveWorkout(updated);
  };

  const updateSet = (exerciseIndex: number, setIndex: number, fields: Partial<SetLog>) => {
    if (!activeWorkout) return;
    const updated = { ...activeWorkout };
    const ex = updated.exercises[exerciseIndex];
    if (!ex || !ex.sets[setIndex]) return;

    const oldSet = ex.sets[setIndex];
    ex.sets[setIndex] = { ...oldSet, ...fields };

    // Si se acaba de marcar como completado, iniciar timer de descanso automático
    if (fields.completed === true && !oldSet.completed) {
      if (navigator.vibrate) navigator.vibrate(60);
      startRestTimer(90); // 90 segundos por defecto
    }

    // Recalcular volumen total
    let totalVol = 0;
    updated.exercises.forEach(e => {
      e.sets.forEach(s => {
        if (s.completed && s.weightKg > 0 && s.reps > 0) {
          totalVol += s.weightKg * s.reps;
        }
      });
    });
    updated.totalVolumeKg = totalVol;

    updateActiveWorkout(updated);
  };

  const removeSet = (exerciseIndex: number, setIndex: number) => {
    if (!activeWorkout) return;
    const updated = { ...activeWorkout };
    const ex = updated.exercises[exerciseIndex];
    if (!ex) return;

    ex.sets.splice(setIndex, 1);
    // Renumerar series
    ex.sets.forEach((s, idx) => {
      s.setNumber = idx + 1;
    });

    updateActiveWorkout(updated);
  };

  const addExerciseToActiveWorkout = (exercise: Exercise) => {
    if (!activeWorkout) return;
    const updated = { ...activeWorkout };

    const newExLog: ExerciseSessionLog = {
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      category: exercise.category,
      sets: [
        { id: `set-${Date.now()}-1`, setNumber: 1, weightKg: 20, reps: exercise.defaultRepsMin, completed: false, targetReps: exercise.defaultRepsMin },
        { id: `set-${Date.now()}-2`, setNumber: 2, weightKg: 20, reps: exercise.defaultRepsMin, completed: false, targetReps: exercise.defaultRepsMin },
        { id: `set-${Date.now()}-3`, setNumber: 3, weightKg: 20, reps: exercise.defaultRepsMin, completed: false, targetReps: exercise.defaultRepsMin }
      ]
    };

    updated.exercises.push(newExLog);
    updateActiveWorkout(updated);
  };

  const finishWorkout = () => {
    if (!activeWorkout) return { pointsEarned: 0, prsAchieved: 0, feedback: '' };

    const finishedSession: WorkoutSession = {
      ...activeWorkout,
      endTime: new Date().toISOString(),
      completed: true
    };

    // Calcular análisis de sobrecarga de IA y puntos
    const overloadResult = calculateOverloadScore(finishedSession.exercises, workoutHistory);
    finishedSession.aiFeedbackSummary = overloadResult.summaryFeedback;

    const newHistory = [finishedSession, ...workoutHistory];
    setWorkoutHistory(newHistory);
    storageService.saveWorkoutHistory(newHistory);

    // Calcular nueva racha y actualizar estadísticas
    const streakInfo = calculateStreak(newHistory);
    const updatedStats: UserStats = {
      ...stats,
      streakDays: streakInfo.streakDays,
      totalWorkouts: stats.totalWorkouts + 1,
      totalVolumeKg: stats.totalVolumeKg + finishedSession.totalVolumeKg,
      weeklyCompleted: stats.weeklyCompleted + 1,
      points: stats.points + overloadResult.pointsEarned,
      lastWorkoutDate: finishedSession.endTime
    };

    setStats(updatedStats);
    storageService.saveUserStats(updatedStats);

    // Limpiar sesión activa
    setActiveWorkout(null);
    storageService.saveActiveWorkout(null);
    stopRestTimer();

    triggerConfetti();

    return {
      pointsEarned: overloadResult.pointsEarned,
      prsAchieved: overloadResult.prsAchieved,
      feedback: overloadResult.summaryFeedback
    };
  };

  const cancelWorkout = () => {
    setActiveWorkout(null);
    storageService.saveActiveWorkout(null);
    stopRestTimer();
  };

  const startRestTimer = (seconds: number) => {
    setRestTimer({
      active: true,
      remainingSeconds: seconds,
      totalSeconds: seconds
    });
  };

  const stopRestTimer = () => {
    setRestTimer({ active: false, remainingSeconds: 0, totalSeconds: 0 });
  };

  const adjustRestTimer = (deltaSeconds: number) => {
    setRestTimer(prev => {
      const nextRemaining = Math.max(0, prev.remainingSeconds + deltaSeconds);
      return {
        ...prev,
        remainingSeconds: nextRemaining,
        totalSeconds: Math.max(prev.totalSeconds, nextRemaining)
      };
    });
  };

  return (
    <WorkoutContext.Provider value={{
      exercises,
      routines,
      workoutHistory,
      stats,
      activeWorkout,
      restTimer,
      profiles,
      activeProfile,
      switchProfile,
      createNewProfile,
      updateProfileName,
      addExercise,
      addRoutine,
      updateRoutine,
      deleteRoutine,
      startWorkout,
      updateActiveWorkout,
      addSetToExercise,
      updateSet,
      removeSet,
      addExerciseToActiveWorkout,
      finishWorkout,
      cancelWorkout,
      startRestTimer,
      stopRestTimer,
      adjustRestTimer,
      triggerConfetti
    }}>
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
};
