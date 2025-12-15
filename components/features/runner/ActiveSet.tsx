'use client';

import { useStore } from '@/lib/store';
import { formatTime } from '@/lib/utils';
import { Activity, Info, Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const ActiveSet = () => {
    const {
        timer,
        activeWorkout,
        workoutStatus,
        isPaused,
        currentSetIdx,
        setWorkoutStatus,
        setTimer,
        setTotalTime,
        setIsPaused,
        activeModal
    } = useStore();

    const isReady = workoutStatus === 'ready';
    const radius = 120;
    const circumference = 2 * Math.PI * radius;
    // Active timer goes UP from 0 to 60 (visual reference) or continuous
    const progress = (timer % 60) / 60;
    const strokeDashoffset = circumference * (1 - progress);

    const startSet = () => {
        setWorkoutStatus('running');
        setTimer(0);
        setTotalTime(60);
        setIsPaused(false);
    };

    if (isReady) {
        return (
            <div className="w-64 h-64 rounded-full border-4 border-dashed border-neutral-700 flex flex-col items-center justify-center relative bg-neutral-900 shadow-2xl">
                <p className="text-xl font-bold mb-2 text-white">SET {currentSetIdx + 1}</p>
                <p className="text-sm text-gray-500 mb-6 uppercase tracking-widest">Start when ready</p>
                <Button
                    onClick={startSet}
                    variant="primary"
                    className="rounded-full w-20 h-20 hover:scale-110 transition-all shadow-[0_0_30px_rgba(250,204,21,0.4)]"
                >
                    <Play size={32} fill="black" />
                </Button>
            </div>
        );
    }

    return (
        <div className="relative flex items-center justify-center">
            <div className="relative w-72 h-72">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 260 260">
                    <circle cx="130" cy="130" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" className="text-neutral-800" />
                    <circle
                        cx="130"
                        cy="130"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className="text-yellow-400 transition-all duration-1000 ease-linear"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className={`text-7xl font-black mb-1 tabular-nums text-white ${isPaused ? 'opacity-50' : ''}`}>
                        {formatTime(timer)}
                    </div>
                    <p className="text-yellow-400 text-sm mb-6 flex items-center gap-2 font-bold uppercase tracking-wider">
                        {isPaused ? <span className="text-red-400 flex items-center gap-1"><Pause size={14} /> Paused</span> : <><Activity size={14} /> Active</>}
                    </p>
                    <button
                        onClick={() => {
                            const currentEx = useStore.getState().routine[useStore.getState().currentExerciseIdx];
                            useStore.getState().setViewingExercise(currentEx);
                        }}
                        className="absolute bottom-8 bg-neutral-800 hover:bg-neutral-700 px-4 py-2 rounded-full text-xs flex items-center gap-1 transition-colors border border-neutral-700 text-gray-300"
                    >
                        <Info size={12} /> 자세 보기
                    </button>
                    {/* View Info Modal trigger could be here */}
                </div>
            </div>
        </div>
    );
};
