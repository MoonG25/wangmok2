'use client';

import { useEffect, useRef } from 'react';
import { useStore, WorkoutLog } from '@/lib/store';
import { ActiveSet } from './ActiveSet';
import { RestTimer } from './RestTimer';
import { Button } from '@/components/ui/Button';
import { X, Play, Pause, SkipForward, CheckCircle2, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export const WorkoutRunner = () => {
    const router = useRouter();
    const {
        workoutStatus,
        isPaused,
        timer,

        routine,
        activeWorkout,
        currentExerciseIdx,
        currentSetIdx,

        setTimer,
        setWorkoutStatus,
        setActiveWorkout,
        setTotalTime,
        setIsPaused,
        setCurrentExerciseIdx,
        setCurrentSetIdx,

        currentWeight,
        setCurrentWeight,
        currentReps,
        setCurrentReps,

        setActiveModal,
        setRoutine,
        resetWorkoutState
    } = useStore();

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Timer Logic
    useEffect(() => {
        if ((workoutStatus === 'running' || workoutStatus === 'resting') && !isPaused) {
            timerRef.current = setInterval(() => {
                const currentTimer = useStore.getState().timer; // Access fresh state directly or use callback
                // Since I'm inside useEffect with dependency [timer], I could rely on prop, 
                // but setting state based on prev is better.
                // However, Zustand `set((state) => ...)` handles this in store actions.
                // But here I'm calling an action.

                // Better approach: Call a 'tick' action in store?
                // Or just use the action I have.

                if (workoutStatus === 'resting') {
                    useStore.getState().decrementTimer();
                    if (useStore.getState().timer <= 0) {
                        handleTimerComplete();
                    }
                } else {
                    useStore.getState().incrementTimer();
                }
            }, 1000);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [workoutStatus, isPaused]);
    // Note: Dependencies here ensure interval is cleared and recreated. 
    // This is safe but might drift slightly. For a fitness app, it's acceptable.

    const handleTimerComplete = () => {
        if (workoutStatus === 'resting') {
            startNextSet();
        }
    };

    const startNextSet = () => {
        const currentEx = routine[currentExerciseIdx];
        if (currentSetIdx < (currentEx.sets || 3) - 1) {
            setCurrentSetIdx(currentSetIdx + 1);
            setWorkoutStatus('running');
        } else {
            if (currentExerciseIdx < routine.length - 1) {
                setCurrentExerciseIdx(currentExerciseIdx + 1);
                setCurrentSetIdx(0);
                setWorkoutStatus('ready');
                setCurrentWeight('');
                setCurrentReps('');
            }
        }
        setTimer(0);
        setTotalTime(60);
        setIsPaused(false);
    };

    const startSet = () => {
        setWorkoutStatus('running');
        setTimer(0);
        setTotalTime(60);
        setIsPaused(false);
    };

    const finishSet = () => {
        const currentEx = routine[currentExerciseIdx];
        const recordedWeight = currentWeight === '' ? 0 : parseFloat(currentWeight);
        const recordedReps = currentReps === '' ? 0 : parseFloat(currentReps);

        const newLog: WorkoutLog = {
            exercise: currentEx.name,
            weight: recordedWeight,
            reps: recordedReps,
            set: currentSetIdx + 1
        };

        const currentLogs = activeWorkout?.logs || [];
        const updatedLogs = [...currentLogs, newLog];

        setActiveWorkout({
            startTime: activeWorkout?.startTime || Date.now(),
            logs: updatedLogs
        });

        const isLastEx = currentExerciseIdx === routine.length - 1;
        const isLastSet = currentSetIdx === (currentEx.sets || 3) - 1;

        if (isLastEx && isLastSet) {
            completeWorkout(updatedLogs);
        } else {
            const rest = currentEx.restTime || 60;
            setWorkoutStatus('resting');
            setTimer(rest);
            setTotalTime(rest);
            setIsPaused(false);
        }
    };

    const completeWorkout = (finalLogs: WorkoutLog[]) => {
        // Here we just transition to Feed Creation or Summary.
        setActiveModal('feed-create');
        // Summary data should probably be passed or calculated in modal from store.
        router.push('/feed'); // Or stay on runner and show modal? 
        // Logic: Modal overlays.
    };

    const confirmQuit = () => {
        setActiveModal('quit-confirm');
    };

    if (routine.length === 0) return <div className="p-10 text-white">No routine loaded.</div>;

    const currentEx = routine[currentExerciseIdx];
    const isReady = workoutStatus === 'ready';
    const isRestingState = workoutStatus === 'resting';

    // Pulse effect ref from original code:
    const pulseColor = isRestingState ? 'bg-emerald-500' : 'bg-yellow-500';

    return (
        <div className={cn(
            "h-[calc(100vh-80px)] flex flex-col text-white relative overflow-hidden transition-colors duration-700",
            isRestingState ? 'bg-emerald-950' : isReady ? 'bg-neutral-900' : 'bg-neutral-950'
        )}>
            <div className="flex gap-1 p-2 pt-safe z-20">
                {routine.map((_, idx) => (
                    <div key={idx} className={cn("h-1 flex-1 rounded-full", idx < currentExerciseIdx ? 'bg-yellow-400' : idx === currentExerciseIdx ? 'bg-white' : 'bg-neutral-800')} />
                ))}
            </div>

            <div className="px-6 py-4 flex justify-between items-start z-10">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className={cn("text-xs font-black px-2 py-0.5 rounded uppercase tracking-wider", isRestingState ? 'bg-emerald-900 text-emerald-400' : 'bg-yellow-900/50 text-yellow-400')}>
                            {isRestingState ? "RESTING" : isReady ? "GET READY" : "ACTIVE"}
                        </span>
                        <p className="text-gray-400 text-sm font-medium">Set {currentSetIdx + 1} / {currentEx.sets || 3}</p>
                    </div>
                    <h1 className="text-3xl font-black italic tracking-tighter">{currentEx.name}</h1>
                </div>
                <button onClick={confirmQuit} className="p-2 bg-neutral-800 rounded-full text-gray-400 hover:text-white hover:bg-neutral-700 transition-colors">
                    <X size={20} />
                </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center relative">
                <div className={cn("absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-[100px] opacity-20 transition-all duration-700", pulseColor, !isPaused && !isReady ? 'scale-125 opacity-30' : 'scale-90 opacity-10')}></div>

                <div className="relative z-10 text-center">
                    {isRestingState ? <RestTimer /> : <ActiveSet />}
                </div>
            </div>

            <div className={`bg-neutral-900 border-t border-neutral-800 text-white p-6 pb-24 rounded-t-3xl z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] transition-transform duration-300`}>
                <div className="flex justify-center mb-6">
                    <div className="bg-neutral-800 border border-neutral-700 px-4 py-1.5 rounded-full text-xs text-gray-400 font-medium flex items-center gap-2">
                        <RotateCcw size={12} /> 이전 기록: 60kg × 10회
                    </div>
                </div>
                <div className="flex justify-between items-center mb-6 px-2 gap-4">
                    <div className="text-center flex-1">
                        <p className="text-[10px] text-gray-500 mb-2 font-bold uppercase tracking-wider">Weight (kg)</p>
                        <input
                            type="number"
                            value={currentWeight}
                            onChange={(e) => setCurrentWeight(e.target.value)}
                            placeholder="60"
                            className="bg-neutral-800 border border-neutral-700 w-full p-4 rounded-xl text-center font-black text-2xl text-white focus:outline-none focus:border-yellow-400 transition-all placeholder-gray-600"
                        />
                    </div>
                    <div className="text-center flex-1">
                        <p className="text-[10px] text-gray-500 mb-2 font-bold uppercase tracking-wider">Reps</p>
                        <input
                            type="number"
                            value={currentReps}
                            onChange={(e) => setCurrentReps(e.target.value)}
                            placeholder="10"
                            className="bg-neutral-800 border border-neutral-700 w-full p-4 rounded-xl text-center font-black text-2xl text-white focus:outline-none focus:border-yellow-400 transition-all placeholder-gray-600"
                        />
                    </div>
                </div>
                <div className="flex gap-3">
                    {!isReady && (
                        <Button onClick={() => setIsPaused(!isPaused)} variant="secondary" className={cn("flex-1 h-14 border-none text-lg", isPaused ? 'bg-yellow-900/20 text-yellow-400 border border-yellow-400/50' : 'bg-neutral-800 hover:bg-neutral-700')}>
                            {isPaused ? <Play fill="currentColor" size={24} /> : <Pause fill="currentColor" size={24} />}
                        </Button>
                    )}
                    {isReady ? (
                        <Button onClick={startSet} variant="primary" className="flex-1 h-14 text-lg shadow-yellow-400/20">세트 시작 <Play fill="black" size={18} className="ml-1" /></Button>
                    ) : isRestingState ? (
                        <Button onClick={startNextSet} className="flex-[2] h-14 text-lg bg-emerald-600 hover:bg-emerald-500 text-white border-none shadow-lg shadow-emerald-900/50">휴식 건너뛰기 <SkipForward size={20} className="ml-1" /></Button>
                    ) : (
                        <Button onClick={finishSet} variant="primary" className="flex-[2] h-14 text-lg shadow-yellow-400/20">세트 완료 <CheckCircle2 size={24} className="ml-1" /></Button>
                    )}
                </div>
            </div>
        </div>
    );
};
