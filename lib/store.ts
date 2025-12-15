import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from 'firebase/auth';
import { Exercise } from './constants';

export interface WorkoutLog {
    exercise: string;
    weight: number;
    reps: number;
    set: number;
}

interface ActiveWorkout {
    startTime: number; // Timestamp
    logs: WorkoutLog[];
}

interface WorkoutState {
    // Auth
    user: User | null;
    setUser: (user: User | null) => void;
    isDemoMode: boolean;
    setDemoMode: (isDemo: boolean) => void;

    // Routine
    routine: Exercise[];
    setRoutine: (routine: Exercise[]) => void;

    // Active Workout Status
    workoutStatus: 'idle' | 'ready' | 'running' | 'resting';
    setWorkoutStatus: (status: 'idle' | 'ready' | 'running' | 'resting') => void;
    startWorkout: () => void;

    activeWorkout: ActiveWorkout | null;
    setActiveWorkout: (workout: ActiveWorkout | null) => void;

    // Timer Logic
    timer: number;
    setTimer: (time: number) => void;
    decrementTimer: () => void;
    incrementTimer: () => void;

    totalTime: number;
    setTotalTime: (time: number) => void;

    isPaused: boolean;
    setIsPaused: (paused: boolean) => void;

    currentExerciseIdx: number;
    setCurrentExerciseIdx: (idx: number) => void;

    currentSetIdx: number;
    setCurrentSetIdx: (idx: number) => void;

    // Workout Input
    currentWeight: string;
    setCurrentWeight: (weight: string) => void;
    currentReps: string;
    setCurrentReps: (reps: string) => void;

    // Daily Quest
    activeQuest: any | null; // using any for simplicity to match constants, or define Quest type
    setActiveQuest: (quest: any | null) => void;

    // UI State
    activeModal: 'builder' | 'feed-create' | 'logout-confirm' | 'quit-confirm' | 'quest-selection' | null;
    setActiveModal: (modal: 'builder' | 'feed-create' | 'logout-confirm' | 'quit-confirm' | 'quest-selection' | null) => void;

    viewingExercise: Exercise | null;
    setViewingExercise: (exercise: Exercise | null) => void;

    // Reset Action
    resetWorkoutState: () => void;
}

export const useStore = create<WorkoutState>()(
    persist(
        (set) => ({
            user: null,
            setUser: (user) => set({ user }),
            isDemoMode: false,
            setDemoMode: (isDemoMode) => set({ isDemoMode }),

            routine: [],
            setRoutine: (routine) => set({ routine }),

            workoutStatus: 'idle',
            setWorkoutStatus: (workoutStatus) => set({ workoutStatus }),
            startWorkout: () => set({
                workoutStatus: 'ready',
                activeWorkout: { startTime: Date.now(), logs: [] },
                currentExerciseIdx: 0,
                currentSetIdx: 0,
                timer: 0,
                isPaused: false
            }),

            activeWorkout: null,
            setActiveWorkout: (activeWorkout) => set({ activeWorkout }),

            timer: 0,
            setTimer: (timer) => set({ timer }),
            decrementTimer: () => set((state) => ({ timer: state.timer - 1 })),
            incrementTimer: () => set((state) => ({ timer: state.timer + 1 })),

            totalTime: 60,
            setTotalTime: (totalTime) => set({ totalTime }),

            isPaused: false,
            setIsPaused: (isPaused) => set({ isPaused }),

            currentExerciseIdx: 0,
            setCurrentExerciseIdx: (currentExerciseIdx) => set({ currentExerciseIdx }),

            currentSetIdx: 0,
            setCurrentSetIdx: (currentSetIdx) => set({ currentSetIdx }),

            currentWeight: '',
            setCurrentWeight: (currentWeight) => set({ currentWeight }),

            currentReps: '',
            setCurrentReps: (currentReps) => set({ currentReps }),

            activeQuest: null,
            setActiveQuest: (activeQuest) => set({ activeQuest }),

            activeModal: null,
            setActiveModal: (activeModal) => set({ activeModal }),

            viewingExercise: null,
            setViewingExercise: (viewingExercise) => set({ viewingExercise }),

            resetWorkoutState: () => set({
                workoutStatus: 'idle',
                activeWorkout: null,
                timer: 0,
                isPaused: false,
                currentExerciseIdx: 0,
                currentSetIdx: 0,
                currentWeight: '',
                currentReps: '',
                routine: []
            })
        }),
        {
            name: 'fitlife-storage',
            partialize: (state) => ({
                routine: state.routine,
                workoutStatus: state.workoutStatus,
                activeWorkout: state.activeWorkout,
                currentExerciseIdx: state.currentExerciseIdx,
                currentSetIdx: state.currentSetIdx,
                timer: state.timer,
                totalTime: state.totalTime,
                currentWeight: state.currentWeight,
                currentReps: state.currentReps,
                activeQuest: state.activeQuest
            }),
        }
    )
);
