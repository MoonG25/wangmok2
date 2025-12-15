'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useStore } from '@/lib/store';
import { Calendar, Dumbbell, Flame, Play } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const TodayRoutineCard = () => {
    const { routine, startWorkout, setActiveModal } = useStore();
    const router = useRouter();

    const handleStart = () => {
        startWorkout();
        router.push('/runner');
    };

    const handleEdit = () => {
        setActiveModal('builder');
    };

    return (
        <section>
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-bold text-white">오늘의 운동 일정</h2>
                {routine.length > 0 && (
                    <button onClick={handleEdit} className="text-sm text-gray-400 underline decoration-gray-600 hover:text-white">수정</button>
                )}
            </div>
            {routine.length === 0 ? (
                <Card className="p-8 flex flex-col items-center justify-center text-center gap-4 border-2 border-dashed border-neutral-800 bg-neutral-900/50">
                    <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center">
                        <Calendar className="text-gray-600" />
                    </div>
                    <div>
                        <p className="font-bold text-gray-300">등록된 일정이 없어요</p>
                        <p className="text-sm text-gray-500 mt-1">오늘의 목표를 설정하고 시작해보세요!</p>
                    </div>
                    <Button onClick={handleEdit} size="sm">운동 일정 만들기</Button>
                </Card>
            ) : (
                <Card className="bg-gradient-to-br from-neutral-800 to-neutral-900 border border-yellow-400/30 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 opacity-5 transform translate-x-10 -translate-y-10 group-hover:opacity-10 transition-opacity">
                        <Dumbbell size={150} className="text-yellow-400" />
                    </div>
                    <div className="p-5 relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-2xl font-black text-white italic tracking-tight">TODAY'S PLAN</h3>
                                <p className="text-yellow-400/80 font-medium text-sm">{routine.length}개의 운동 • 약 {routine.length * 15}분 소요</p>
                            </div>
                            <div className="bg-yellow-400/20 p-2 rounded-lg backdrop-blur-sm">
                                <Flame className="text-yellow-400 fill-yellow-400" />
                            </div>
                        </div>
                        <div className="space-y-2 mb-6">
                            {routine.slice(0, 3).map((ex, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => useStore.getState().setViewingExercise(ex)}
                                    className="w-full flex items-center gap-3 text-sm text-gray-300 bg-neutral-950/30 p-3 rounded-lg hover:bg-neutral-800 transition-colors text-left border border-transparent hover:border-yellow-400/30 cursor-pointer"
                                >
                                    <span className="w-5 h-5 rounded bg-yellow-400 text-black font-bold flex items-center justify-center text-xs">{idx + 1}</span>
                                    <span className="font-medium flex-1 text-white">{ex.name}</span>
                                    <span className="text-xs text-gray-500">{ex.sets}세트</span>
                                </div>
                            ))}
                            {routine.length > 3 && <p className="text-xs text-center text-gray-600">+{routine.length - 3} more</p>}
                        </div>
                        <Button onClick={handleStart} variant="primary" className="w-full font-bold text-lg">
                            운동 시작하기 <Play fill="black" size={18} />
                        </Button>
                    </div>
                </Card>
            )}
        </section>
    );
};
