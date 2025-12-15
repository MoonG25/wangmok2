'use client';

import { useStore } from '@/lib/store';
import { formatTime } from '@/lib/utils';
import { Pause, RotateCcw } from 'lucide-react';
import { useEffect } from 'react';

export const RestTimer = () => {
    const {
        timer,
        totalTime,
        isPaused,
        incrementTimer,
        decrementTimer
    } = useStore();

    const radius = 120;
    const circumference = 2 * Math.PI * radius;
    const progress = totalTime > 0 ? (timer / totalTime) : 0;
    const strokeDashoffset = circumference * (1 - progress);

    return (
        <div className="relative flex items-center justify-center">
            <div className="relative w-72 h-72">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 260 260">
                    <circle cx="130" cy="130" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" className="text-emerald-900" />
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
                        className="text-emerald-400 transition-all duration-1000 ease-linear"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-emerald-400 font-bold text-xl mb-2 animate-pulse flex items-center justify-center gap-2">
                        {isPaused ? <Pause size={20} /> : <RotateCcw size={20} />}
                        {isPaused ? "Paused" : "Resting"}
                    </p>
                    <div className={`text-8xl font-black tabular-nums tracking-tighter mb-2 ${isPaused ? 'opacity-50' : ''}`}>
                        {formatTime(timer)}
                    </div>
                    <div className="flex gap-4">
                        <button onClick={() => decrementTimer()} className="text-gray-500 hover:text-white">-10s</button>
                        <p className="text-gray-500 font-medium text-xs self-center">NEXT SET PREPARATION</p>
                        <button onClick={() => incrementTimer()} className="text-gray-500 hover:text-white">+10s</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
