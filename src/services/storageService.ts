import { Exercise, Routine, WorkoutSession, UserStats, UserProfile } from '../types';
import { INITIAL_EXERCISES } from '../data/exercisesDatabase';

const STORAGE_KEYS = {
  PROFILES: 'overload_ai_profiles_v2',
  ACTIVE_PROFILE_ID: 'overload_ai_active_profile_id_v2',
  EXERCISES: 'overload_ai_exercises_v2',
  ROUTINES_PREFIX: 'overload_ai_routines_v2_',
  HISTORY_PREFIX: 'overload_ai_history_v2_',
  STATS_PREFIX: 'overload_ai_stats_v2_',
  ACTIVE_WORKOUT_PREFIX: 'overload_ai_active_workout_v2_'
};

const DEFAULT_PROFILES: UserProfile[] = [
  {
    id: 'profile-nico',
    name: 'Nico',
    avatarEmoji: '⚡',
    color: '#00F0FF',
    createdAt: new Date().toISOString()
  }
];

export const storageService = {
  // ================= PROFILES =================
  getProfiles(): UserProfile[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILES);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(DEFAULT_PROFILES));
        localStorage.setItem(STORAGE_KEYS.ACTIVE_PROFILE_ID, DEFAULT_PROFILES[0].id);
        return DEFAULT_PROFILES;
      }
      return JSON.parse(data);
    } catch (e) {
      return DEFAULT_PROFILES;
    }
  },

  saveProfiles(profiles: UserProfile[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
    } catch (e) {
      console.error('Error saving profiles:', e);
    }
  },

  getActiveProfileId(): string {
    const id = localStorage.getItem(STORAGE_KEYS.ACTIVE_PROFILE_ID);
    if (id) return id;
    const profiles = this.getProfiles();
    return profiles[0]?.id || 'profile-nico';
  },

  setActiveProfileId(id: string): void {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PROFILE_ID, id);
  },

  getActiveProfile(): UserProfile {
    const profiles = this.getProfiles();
    const activeId = this.getActiveProfileId();
    return profiles.find(p => p.id === activeId) || profiles[0] || DEFAULT_PROFILES[0];
  },

  createProfile(name: string, avatarEmoji: string = '✨', color: string = '#FF2D55'): UserProfile {
    const newProfile: UserProfile = {
      id: `profile-${Date.now()}`,
      name: name.trim() || 'Compañero',
      avatarEmoji,
      color,
      createdAt: new Date().toISOString()
    };
    const profiles = this.getProfiles();
    profiles.push(newProfile);
    this.saveProfiles(profiles);
    this.setActiveProfileId(newProfile.id);
    return newProfile;
  },

  // ================= EXERCISES (Shared catalog) =================
  getExercises(): Exercise[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EXERCISES);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.EXERCISES, JSON.stringify(INITIAL_EXERCISES));
        return INITIAL_EXERCISES;
      }
      return JSON.parse(data);
    } catch (e) {
      return INITIAL_EXERCISES;
    }
  },

  saveExercises(exercises: Exercise[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.EXERCISES, JSON.stringify(exercises));
    } catch (e) {
      console.error('Error saving exercises:', e);
    }
  },

  // ================= ROUTINES (Per Profile) =================
  getRoutines(profileId?: string): Routine[] {
    const pid = profileId || this.getActiveProfileId();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ROUTINES_PREFIX + pid);
      if (!data) return [];
      return JSON.parse(data);
    } catch (e) {
      return [];
    }
  },

  saveRoutines(routines: Routine[], profileId?: string): void {
    const pid = profileId || this.getActiveProfileId();
    try {
      localStorage.setItem(STORAGE_KEYS.ROUTINES_PREFIX + pid, JSON.stringify(routines));
    } catch (e) {
      console.error('Error saving routines:', e);
    }
  },

  // ================= WORKOUT HISTORY (Per Profile) =================
  getWorkoutHistory(profileId?: string): WorkoutSession[] {
    const pid = profileId || this.getActiveProfileId();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HISTORY_PREFIX + pid);
      if (!data) return [];
      return JSON.parse(data);
    } catch (e) {
      return [];
    }
  },

  saveWorkoutHistory(history: WorkoutSession[], profileId?: string): void {
    const pid = profileId || this.getActiveProfileId();
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY_PREFIX + pid, JSON.stringify(history));
    } catch (e) {
      console.error('Error saving history:', e);
    }
  },

  // ================= USER STATS (Per Profile) =================
  getUserStats(profileId?: string): UserStats {
    const pid = profileId || this.getActiveProfileId();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STATS_PREFIX + pid);
      if (!data) {
        const defaultStats: UserStats = {
          streakDays: 1,
          totalWorkouts: 0,
          totalVolumeKg: 0,
          weeklyGoal: 4,
          weeklyCompleted: 0,
          points: 50
        };
        localStorage.setItem(STORAGE_KEYS.STATS_PREFIX + pid, JSON.stringify(defaultStats));
        return defaultStats;
      }
      return JSON.parse(data);
    } catch (e) {
      return {
        streakDays: 1,
        totalWorkouts: 0,
        totalVolumeKg: 0,
        weeklyGoal: 4,
        weeklyCompleted: 0,
        points: 50
      };
    }
  },

  saveUserStats(stats: UserStats, profileId?: string): void {
    const pid = profileId || this.getActiveProfileId();
    try {
      localStorage.setItem(STORAGE_KEYS.STATS_PREFIX + pid, JSON.stringify(stats));
    } catch (e) {
      console.error('Error saving stats:', e);
    }
  },

  // ================= ACTIVE WORKOUT (Per Profile) =================
  getActiveWorkout(profileId?: string): WorkoutSession | null {
    const pid = profileId || this.getActiveProfileId();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_WORKOUT_PREFIX + pid);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  saveActiveWorkout(session: WorkoutSession | null, profileId?: string): void {
    const pid = profileId || this.getActiveProfileId();
    try {
      if (!session) {
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_WORKOUT_PREFIX + pid);
      } else {
        localStorage.setItem(STORAGE_KEYS.ACTIVE_WORKOUT_PREFIX + pid, JSON.stringify(session));
      }
    } catch (e) {
      console.error('Error saving active workout:', e);
    }
  },

  // ================= BACKUP & RESTORE =================
  exportBackup(): string {
    const pid = this.getActiveProfileId();
    const backup = {
      profile: this.getActiveProfile(),
      exercises: this.getExercises(),
      routines: this.getRoutines(pid),
      history: this.getWorkoutHistory(pid),
      stats: this.getUserStats(pid),
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(backup, null, 2);
  },

  importBackup(jsonString: string): boolean {
    try {
      const backup = JSON.parse(jsonString);
      const pid = this.getActiveProfileId();
      if (backup.exercises) this.saveExercises(backup.exercises);
      if (backup.routines) this.saveRoutines(backup.routines, pid);
      if (backup.history) this.saveWorkoutHistory(backup.history, pid);
      if (backup.stats) this.saveUserStats(backup.stats, pid);
      return true;
    } catch (e) {
      console.error('Import error:', e);
      return false;
    }
  }
};
