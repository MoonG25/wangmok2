'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useStore } from '@/lib/store';
import { Check } from 'lucide-react';
import { DAILY_QUESTS } from '@/lib/constants';

// We need a way to store active quest in store, but currently it's just 'activeQuest' without a full type in store logic?
// Store persistence is partial.
// base-app.tsx logic: activeQuest {icon, title...}. isQuestCompleted boolean.

// I'll update this component to accept props or strictly use store later.
// For now, I'll use local state + mock, or better, add activeQuest to store properly if not present.
// I didn't add activeQuest to store interface in previous step.
// I will implement it as a purely presentational component that takes data,
// but the parent (Home Page) will handle logic or I use a local context.
// Actually, let's keep it simple: Use Store if possible, or Local State.
// Since 'task.md' requires persistence/features, I should probably put it in Store.
// BUT I can't modify Store too often.
// I'll assume the parent Home Page handles the state for now.

interface QuestProps {
    activeQuest: any;
    isQuestCompleted: boolean;
    onToggleComplete: () => void;
    onOpenSelection: () => void;
}

export const QuestCard = ({ activeQuest, isQuestCompleted, onToggleComplete, onOpenSelection }: QuestProps) => {
    return (
        <section>
            <h2 className="text-lg font-bold text-white mb-3">일일 퀘스트</h2>
            {activeQuest ? (
                <Card className={`p-0 bg-neutral-900 border-neutral-800 relative overflow-hidden transition-all duration-500 ${isQuestCompleted ? 'border-blue-500/50' : ''}`}>
                    <div className="absolute bottom-0 left-0 h-1 bg-neutral-800 w-full">
                        <div className={`h-full bg-blue-500 transition-all duration-500 ${isQuestCompleted ? 'w-full' : 'w-1/3'}`}></div>
                    </div>
                    <div className="p-4 flex items-center justify-between z-10 relative">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${isQuestCompleted ? 'bg-blue-500 text-white' : 'bg-neutral-800 border border-neutral-700 text-blue-400'}`}>
                                <activeQuest.icon size={24} fill={isQuestCompleted ? "currentColor" : "none"} />
                            </div>
                            <div className="flex-1">
                                <p className={`font-bold text-sm ${isQuestCompleted ? 'text-blue-400 line-through' : 'text-gray-200'}`}>{activeQuest.title}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{isQuestCompleted ? `퀘스트 완료! 경험치 +${activeQuest.exp}` : activeQuest.desc}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={onOpenSelection}
                                className="text-xs text-gray-500 underline mr-2 hover:text-white"
                            >변경</button>
                            <button
                                onClick={onToggleComplete}
                                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all group ${isQuestCompleted ? 'bg-blue-500 border-blue-500' : 'border-neutral-600 hover:border-blue-400'}`}
                            >
                                <Check size={16} className={`transition-all ${isQuestCompleted ? 'text-white scale-100' : 'text-transparent scale-50'}`} strokeWidth={4} />
                            </button>
                        </div>
                    </div>
                </Card>
            ) : (
                <Card className="p-6 bg-neutral-900 border-dashed border-2 border-neutral-800 flex flex-col items-center justify-center gap-2">
                    <p className="text-gray-400 text-sm">진행 중인 퀘스트가 없습니다.</p>
                    <Button onClick={onOpenSelection} size="sm" variant="secondary">오늘의 퀘스트 선택하기</Button>
                </Card>
            )}
        </section>
    );
};
