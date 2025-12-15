'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { X, ImageIcon } from 'lucide-react';
import { addDoc, collection, doc, serverTimestamp, updateDoc, increment, getDoc, getFirestore } from 'firebase/firestore';
import { db, APP_ID } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export const FeedCreateModal = () => {
    const { setActiveModal, user, activeWorkout, resetWorkoutState } = useStore();
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSkip = () => {
        resetWorkoutState();
        setActiveModal(null);
        router.push('/home');
    };

    const handleSubmit = async () => {
        if (!user) return;
        setLoading(true);

        // Calculate volume from activeWorkout or just mock if missing logic
        // This logic should match base-app.tsx completeWorkout
        // But activeWorkout in Store might be cleared? No, it's cleared after.

        // Simplified for now:
        const volume = activeWorkout?.logs.reduce((max, log) => Math.max(max, log.weight), 0) || 0;

        // Offline / Demo Mode Fallback
        if (!db) {
            // Mock delay and success
            await new Promise(resolve => setTimeout(resolve, 1000));
            resetWorkoutState();
            setActiveModal(null);
            router.push('/feed');
            return;
        }

        try {
            const newFeed = {
                user: user.displayName || 'Anonymous',
                uid: user.uid,
                time: 'Just now',
                content: text,
                likes: 0,
                likedBy: [],
                images: [],
                stats: { volume: `${volume}kg`, time: '1h 0m' }, // Mock time
                createdAt: serverTimestamp()
            };

            await addDoc(collection(db, 'artifacts', APP_ID, 'public', 'data', 'feeds'), newFeed);

            // Update user stats (mock logic for now or real if possible)

            resetWorkoutState();
            setActiveModal(null);
            router.push('/feed');
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full h-full flex flex-col p-5 bg-neutral-900">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">운동 완료! 🎉</h2>
                <button onClick={handleSkip}><X className="text-white" /></button>
            </div>

            <div className="mb-4">
                <textarea
                    className="w-full bg-neutral-800 rounded-xl p-4 text-white resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-gray-500"
                    rows={4}
                    placeholder="오늘 운동은 어땠나요? 기록을 남겨보세요."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
            </div>

            <div className="flex gap-2 mb-6">
                <button className="w-20 h-20 rounded-xl border-2 border-dashed border-neutral-700 flex flex-col items-center justify-center text-gray-500 hover:border-yellow-400 hover:text-yellow-400 transition-colors">
                    <ImageIcon size={24} />
                    <span className="text-[10px] mt-1">사진 추가</span>
                </button>
            </div>

            <div className="flex gap-2">
                <Button onClick={handleSkip} variant="ghost" className="flex-1 text-gray-400 hover:text-white">
                    건너뛰기
                </Button>
                <Button onClick={handleSubmit} size="lg" variant="primary" loading={loading} className="flex-[2] font-bold">
                    피드에 공유하기
                </Button>
            </div>
        </div>
    );
};
