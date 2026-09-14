export type MuscleGroup = 
  | 'Pecho' 
  | 'Espalda' 
  | 'Cuádriceps' 
  | 'Isquios y Glúteo' 
  | 'Hombros' 
  | 'Bíceps' 
  | 'Tríceps' 
  | 'Core y Abdomen';

export type EquipmentType = 
  | 'Mancuerna' 
  | 'Barra' 
  | 'Máquina' 
  | 'Polea' 
  | 'Peso Corporal' 
  | 'Kettlebell';

export interface Exercise {
  id: string;
  name: string;
  category: MuscleGroup;
  equipment: EquipmentType;
  targetMuscle: string;
  secondaryMuscles?: string[];
  tips: string;
  defaultRepsMin: number;
  defaultRepsMax: number;
  isCustom?: boolean;
}

export interface RoutineExerciseConfig {
  exerciseId: string;
  targetSets: number;
  targetRepsMin: number;
  targetRepsMax: number;
  targetRPE?: number;
  restSeconds: number;
}

export interface Routine {
  id: string;
  name: string;
  description: string;
  iconName: string;
  color: string;
  exercises: RoutineExerciseConfig[];
  createdAt: string;
}

export interface SetLog {
  id: string;
  setNumber: number;
  weightKg: number;
  reps: number;
  completed: boolean;
  rpe?: number;
  targetReps?: number;
  targetWeightKg?: number;
  isPR?: boolean;
}

export interface ExerciseSessionLog {
  exerciseId: string;
  exerciseName: string;
  category: MuscleGroup;
  sets: SetLog[];
  notes?: string;
}

export interface WorkoutSession {
  id: string;
  routineId?: string;
  routineName: string;
  startTime: string;
  endTime?: string;
  durationSeconds: number;
  exercises: ExerciseSessionLog[];
  totalVolumeKg: number;
  completed: boolean;
  aiFeedbackSummary?: string;
}

export interface UserStats {
  streakDays: number;
  lastWorkoutDate?: string;
  totalWorkouts: number;
  totalVolumeKg: number;
  weeklyGoal: number;
  weeklyCompleted: number;
  points: number;
}

export interface AIAdvice {
  exerciseId: string;
  exerciseName: string;
  recommendedWeight: number;
  recommendedReps: number;
  type: 'increase_reps' | 'increase_weight' | 'consolidate' | 'deload' | 'first_time';
  badgeText: string;
  headline: string;
  coachAdvice: string;
  previousRecord?: {
    weightKg: number;
    reps: number;
    date: string;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  avatarEmoji: string;
  color: string;
  createdAt: string;
}
