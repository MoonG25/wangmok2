'use client';

import { LiveGymWidget } from '@/components/features/home/LiveGymWidget';
import { WeeklyStreak } from '@/components/features/home/WeeklyStreak';
import { TodayRoutineCard } from '@/components/features/home/TodayRoutineCard';
import { QuestCard } from '@/components/features/home/QuestCard';
import { useStore } from '@/lib/store';
import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db, APP_ID } from '@/lib/firebase';
import { DAILY_QUESTS } from '@/lib/constants';

export default function HomePage() {
    const { user, setActiveModal, activeQuest } = useStore();
    const [userStats, setUserStats] = useState<any>({});

    // Quest Logic (Simplified local state for demo)
    const [isQuestCompleted, setIsQuestCompleted] = useState(false);

    // Fetch stats
    useEffect(() => {
        if (!user) return;
        const statsRef = doc(db, 'artifacts', APP_ID, 'users', user.uid, 'data', 'stats');
        const unsubscribe = onSnapshot(statsRef, (doc) => {
            if (doc.exists()) {
                setUserStats(doc.data());
            }
        });
        return () => unsubscribe();
    }, [user]);

    return (
        <div className="p-5 space-y-6">
            <LiveGymWidget />
            <WeeklyStreak weeklyActivity={userStats.weeklyActivity} />
            <TodayRoutineCard />
            <QuestCard
                activeQuest={activeQuest}
                isQuestCompleted={isQuestCompleted}
                onToggleComplete={() => setIsQuestCompleted(!isQuestCompleted)}
                onOpenSelection={() => setActiveModal('quest-selection')}
            />

            <section className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl shadow-lg">
                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">Weekly Volume</p>
                    <p className="text-2xl font-black text-white">{userStats.weeklyVolume?.toLocaleString() || 0} <span className="text-xs font-medium text-gray-500">kg</span></p>
                    <div className="mt-3 h-1 bg-neutral-800 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-400 w-[75%] shadow-[0_0_10px_rgba(250,204,21,0.5)]"></div>
                    </div>
                </div>
                <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl shadow-lg">
                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">Growth</p>
                    <p className="text-2xl font-black text-yellow-400">+12%</p>
                    <p className="text-xs text-gray-500 flex items-center mt-1">
                        vs 지난주
                    </p>
                </div>
            </section>
        </div>
    );
}
