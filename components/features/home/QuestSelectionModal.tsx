'use client';

import { Modal } from '@/components/ui/Modal';
import { useStore } from '@/lib/store';
import { DAILY_QUESTS } from '@/lib/constants';
import { Card } from '@/components/ui/Card';
import { Check } from 'lucide-react';

export const QuestSelectionModal = () => {
    const { activeQuest, setActiveQuest, setActiveModal } = useStore();

    const handleSelect = (quest: any) => {
        setActiveQuest(quest);
        setActiveModal(null);
    };

    return (
        <div className="h-full overflow-y-auto p-5 pb-10 bg-neutral-900">
            <h3 className="text-xl font-bold text-white mb-4 px-1">오늘의 퀘스트 선택</h3>
            <div className="grid grid-cols-1 gap-3">
                {DAILY_QUESTS.map((quest) => {
                    const isActive = activeQuest?.id === quest.id;
                    const colorMap: any = {
                        blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
                        red: 'bg-red-500/20 text-red-400 border-red-500/30',
                        purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
                        green: 'bg-green-500/20 text-green-400 border-green-500/30',
                        yellow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
                        orange: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
                        pink: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
                    };

                    return (
                        <button
                            key={quest.id}
                            onClick={() => handleSelect(quest)}
                            className={`w-full text-left p-4 rounded-xl border flex items-center gap-4 transition-all ${isActive ? 'bg-neutral-800 border-yellow-400 ring-1 ring-yellow-400' : 'bg-neutral-900/50 border-neutral-800 hover:bg-neutral-800'}`}
                        >
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center border ${colorMap[quest.color]}`}>
                                <quest.icon size={24} />
                            </div>
                            <div className="flex-1">
                                <h4 className={`font-bold ${isActive ? 'text-yellow-400' : 'text-gray-200'}`}>{quest.title}</h4>
                                <p className="text-xs text-gray-500">{quest.desc}</p>
                            </div>
                            {isActive && <Check className="text-yellow-400" />}
                        </button>
                    )
                })}
            </div>
        </div>
    );
};
