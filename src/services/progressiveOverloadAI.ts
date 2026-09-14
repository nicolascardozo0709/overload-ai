import { WorkoutSession, AIAdvice, ExerciseSessionLog } from '../types';

/**
 * Calcula el 1RM estimado usando la fórmula de Epley
 * 1RM = Peso * (1 + Reps / 30)
 */
export function calculate1RM(weightKg: number, reps: number): number {
  if (reps <= 0 || weightKg <= 0) return 0;
  if (reps === 1) return weightKg;
  return Math.round(weightKg * (1 + reps / 30) * 10) / 10;
}

/**
 * Encuentra el historial previo de un ejercicio específico en las sesiones anteriores
 */
export function getPreviousExerciseHistory(
  exerciseId: string,
  workoutHistory: WorkoutSession[]
): ExerciseSessionLog | null {
  // Ordenar de más reciente a más antiguo
  const completedWorkouts = [...workoutHistory]
    .filter(w => w.completed)
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

  for (const session of completedWorkouts) {
    const found = session.exercises.find(e => e.exerciseId === exerciseId);
    if (found && found.sets.some(s => s.completed && s.reps > 0)) {
      return found;
    }
  }
  return null;
}

/**
 * Motor de Inteligencia Artificial para Sobrecarga Progresiva (Doble Progresión)
 * Analiza la sesión anterior y genera la meta exacta para hoy.
 */
export function getAIAdviceForExercise(
  exerciseId: string,
  exerciseName: string,
  targetRepsMin: number = 6,
  targetRepsMax: number = 8,
  workoutHistory: WorkoutSession[]
): AIAdvice {
  const prevLog = getPreviousExerciseHistory(exerciseId, workoutHistory);

  if (!prevLog) {
    return {
      exerciseId,
      exerciseName,
      recommendedWeight: 20,
      recommendedReps: targetRepsMin,
      type: 'first_time',
      badgeText: 'Primer Registro 🌱',
      headline: `Establece tu marca base (${targetRepsMin}-${targetRepsMax} reps)`,
      coachAdvice: `¡Bienvenido a ${exerciseName}! Elige un peso con el que puedas hacer entre ${targetRepsMin} y ${targetRepsMax} repeticiones sintiendo que te quedan 1 o 2 en reserva (RPE 8). Esta sesión servirá como punto de partida para que la IA programe tu sobrecarga.`
    };
  }

  // Filtrar series completadas válidas
  const validSets = prevLog.sets.filter(s => s.completed && s.reps > 0);
  if (validSets.length === 0) {
    return {
      exerciseId,
      exerciseName,
      recommendedWeight: 20,
      recommendedReps: targetRepsMin,
      type: 'first_time',
      badgeText: 'Primer Registro 🌱',
      headline: `Establece tu marca base (${targetRepsMin}-${targetRepsMax} reps)`,
      coachAdvice: `Completa tu primera serie efectiva para que la IA empiece a calcular tu progreso.`
    };
  }

  // Encontrar la mejor serie por 1RM estimado en la sesión pasada
  const bestSet = [...validSets].sort((a, b) => {
    const oneRmA = calculate1RM(a.weightKg, a.reps);
    const oneRmB = calculate1RM(b.weightKg, b.reps);
    return oneRmB - oneRmA;
  })[0];

  const prevWeight = bestSet.weightKg;
  const prevReps = bestSet.reps;

  // CASO 1: Ya superó o igualó el tope del rango de repeticiones (ej. hizo 8 o más de 8)
  // -> Toca subir peso (Sobrecarga de Peso) y reiniciar al piso de reps
  if (prevReps >= targetRepsMax) {
    // Si es mancuerna sumamos 2kg (1kg por lado) o 2.5kg en barra/máquina
    const increment = prevWeight >= 50 ? 5 : 2.5;
    const nextWeight = prevWeight + increment;
    const nextReps = targetRepsMin;

    return {
      exerciseId,
      exerciseName,
      recommendedWeight: nextWeight,
      recommendedReps: nextReps,
      type: 'increase_weight',
      badgeText: '¡Subida de Peso! 🚀',
      headline: `Meta de hoy: ${nextWeight} kg × ${nextReps} reps`,
      coachAdvice: `¡Brutal! En la sesión pasada lograste ${prevReps} repeticiones con ${prevWeight} kg, completando el rango máximo. Hoy la IA te indica dar el salto de sobrecarga a ${nextWeight} kg y buscar entre ${targetRepsMin} y ${targetRepsMax} repeticiones con técnica limpia.`,
      previousRecord: {
        weightKg: prevWeight,
        reps: prevReps,
        date: ''
      }
    };
  }

  // CASO 2: Está dentro del rango (ej. hizo 6 reps de 6-8)
  // -> Mantenemos el peso y buscamos exactamente +1 repetición (ej. 6 -> 7 reps)
  if (prevReps >= targetRepsMin && prevReps < targetRepsMax) {
    const nextReps = prevReps + 1;

    return {
      exerciseId,
      exerciseName,
      recommendedWeight: prevWeight,
      recommendedReps: nextReps,
      type: 'increase_reps',
      badgeText: '+1 Rep Objetivo 🔥',
      headline: `Meta de hoy: ${prevWeight} kg × ${nextReps} reps`,
      coachAdvice: `En la sesión pasada hiciste ${prevReps} reps con ${prevWeight} kg. Hoy tu objetivo de sobrecarga progresiva es sacar exactamente ${nextReps} repeticiones (+1 rep). ¡Descansa bien antes de la serie y ve por esa repetición extra!`,
      previousRecord: {
        weightKg: prevWeight,
        reps: prevReps,
        date: ''
      }
    };
  }

  // CASO 3: Quedó por debajo del rango mínimo (ej. hizo 4 o 5 reps de 6-8)
  // -> Consolidar con el mismo peso hasta alcanzar el mínimo
  return {
    exerciseId,
    exerciseName,
    recommendedWeight: prevWeight,
    recommendedReps: targetRepsMin,
    type: 'consolidate',
    badgeText: 'Consolidar Técnica 💪',
    headline: `Meta de hoy: ${prevWeight} kg × ${targetRepsMin} reps`,
    coachAdvice: `En la última sesión te costó alcanzar el mínimo (${prevReps} reps con ${prevWeight} kg). Mantén el peso, enfócate en la respiración y controla la bajada en 2 segundos para llegar a ${targetRepsMin} reps limpias.`,
    previousRecord: {
      weightKg: prevWeight,
      reps: prevReps,
      date: ''
    }
  };
}

/**
 * Calcula puntos de sobrecarga progresiva obtenidos en la sesión actual
 */
export function calculateOverloadScore(
  currentExercises: ExerciseSessionLog[],
  workoutHistory: WorkoutSession[]
): {
  pointsEarned: number;
  exercisesProgressed: number;
  prsAchieved: number;
  summaryFeedback: string;
} {
  let points = 50; // Base por entrenar
  let progressedCount = 0;
  let prCount = 0;

  for (const ex of currentExercises) {
    const prevHistory = getPreviousExerciseHistory(ex.exerciseId, workoutHistory);
    if (!prevHistory) continue;

    const currentBestSet = ex.sets
      .filter(s => s.completed && s.reps > 0)
      .sort((a, b) => calculate1RM(b.weightKg, b.reps) - calculate1RM(a.weightKg, a.reps))[0];

    const prevBestSet = prevHistory.sets
      .filter(s => s.completed && s.reps > 0)
      .sort((a, b) => calculate1RM(b.weightKg, b.reps) - calculate1RM(a.weightKg, a.reps))[0];

    if (currentBestSet && prevBestSet) {
      const current1RM = calculate1RM(currentBestSet.weightKg, currentBestSet.reps);
      const prev1RM = calculate1RM(prevBestSet.weightKg, prevBestSet.reps);

      if (current1RM > prev1RM) {
        progressedCount++;
        points += 35; // Puntos por mejora
        if (currentBestSet.weightKg > prevBestSet.weightKg || currentBestSet.reps > prevBestSet.reps + 1) {
          prCount++;
          points += 50; // Bono de Récord Personal (PR)
        }
      }
    }
  }

  let feedback = '¡Excelente sesión de entrenamiento!';
  if (prCount > 0) {
    feedback = `¡Sesión legendaria! Superaste ${prCount} récords personales (PR) y aplicaste sobrecarga en ${progressedCount} ejercicios.`;
  } else if (progressedCount > 0) {
    feedback = `¡Gran trabajo! Lograste sobrecarga progresiva en ${progressedCount} ejercicio(s). Tu fuerza va en aumento constante.`;
  } else {
    feedback = `¡Consistencia ante todo! Acumulaste volumen valioso para consolidar tus marcas.`;
  }

  return {
    pointsEarned: points,
    exercisesProgressed: progressedCount,
    prsAchieved: prCount,
    summaryFeedback: feedback
  };
}

/**
 * Calcula la racha actual de días / semanas
 */
export function calculateStreak(history: WorkoutSession[]): {
  streakDays: number;
  weeklyWorkouts: number;
  isStreakActiveToday: boolean;
} {
  const completed = [...history]
    .filter(w => w.completed)
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

  if (completed.length === 0) {
    return { streakDays: 0, weeklyWorkouts: 0, isStreakActiveToday: false };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Calcular entrenamientos en los últimos 7 días
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);

  const weeklyWorkouts = completed.filter(w => {
    const d = new Date(w.startTime);
    return d >= sevenDaysAgo;
  }).length;

  // Días únicos de entrenamiento
  const trainedDays = new Set(
    completed.map(w => {
      const d = new Date(w.startTime);
      return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    })
  );

  const todayKey = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  const isStreakActiveToday = trainedDays.has(todayKey);

  // Contar días consecutivos hacia atrás (tolerando 1 día de descanso para mantener la racha semanal)
  let streak = isStreakActiveToday ? 1 : 0;
  let checkDate = new Date(today);
  if (!isStreakActiveToday) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (true) {
    checkDate.setDate(checkDate.getDate() - 1);
    const key = `${checkDate.getFullYear()}-${checkDate.getMonth() + 1}-${checkDate.getDate()}`;
    if (trainedDays.has(key)) {
      streak++;
    } else {
      break;
    }
  }

  // Garantizar un mínimo estimulante si entrena frecuentemente en la semana
  if (streak === 0 && weeklyWorkouts > 0) {
    streak = 1;
  }

  return {
    streakDays: Math.max(streak, isStreakActiveToday ? 1 : (weeklyWorkouts > 0 ? weeklyWorkouts : 0)),
    weeklyWorkouts,
    isStreakActiveToday
  };
}
