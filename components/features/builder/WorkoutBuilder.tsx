'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { CATEGORIES, EXERCISES, Exercise } from '@/lib/constants';
import { GripVertical, X, CheckCircle2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { doc, setDoc } from 'firebase/firestore';
import { db, APP_ID } from '@/lib/firebase';

export const WorkoutBuilder = () => {
    const { routine, setRoutine, setActiveModal, user } = useStore();
    const [selectedCategory, setSelectedCategory] = useState('back');
    const [tempRoutine, setTempRoutine] = useState<Exercise[]>(routine);
    const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

    const addExercise = (ex: Exercise) => {
        setTempRoutine([...tempRoutine, { ...ex, sets: 3, restTime: 60 }]);
    };

    const removeExercise = (index: number) => {
        const newR = [...tempRoutine];
        newR.splice(index, 1);
        setTempRoutine(newR);
    };

    const updateSets = (index: number, sets: number) => {
        const newR = [...tempRoutine];
        newR[index] = { ...newR[index], sets };
        setTempRoutine(newR);
    };

    const handleDragStart = (e: React.DragEvent, index: number) => {
        setDraggedIdx(index);
        e.dataTransfer.effectAllowed = "move";
        // e.dataTransfer.setData("text/plain", index.toString());
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent, dropIndex: number) => {
        e.preventDefault();
        if (draggedIdx === null) return;
        if (draggedIdx === dropIndex) return;

        const newRoutine = [...tempRoutine];
        const [draggedItem] = newRoutine.splice(draggedIdx, 1);
        newRoutine.splice(dropIndex, 0, draggedItem);

        setTempRoutine(newRoutine);
        setDraggedIdx(null);
    };

    const handleSave = async () => {
        setRoutine(tempRoutine);
        setActiveModal(null);

        if (user) {
            try {
                await setDoc(doc(db, 'artifacts', APP_ID, 'users', user.uid, 'data', 'currentRoutine'), {
                    routine: tempRoutine
                });
            } catch (e) {
                console.error("Routine save failed", e);
            }
        }
    };

    return (
        <div className="flex flex-col h-full bg-neutral-900 overflow-hidden">
            {/* Not using Modal wrapper content here because this is likely inside the Modal body logic if used, 
                 but wait, Modal component handles the container. So this should fill the modal. 
                 Or this component INCLUDES the modal structure? 
                 The store 'activeModal' triggers the Modal wrapper in Layout or Page. 
                 Ideally this component is just the content. 
                 The Modal component styles the container. 
                 So I should remove the fixed inset-0 logic if the Modal component handles it.
                 Yes, Modal component handles the overlay and window. 
                 I just need the inner content.
             */}

            <div className="flex-1 overflow-y-auto bg-neutral-950 p-4 pb-24">
                {/* Selected List */}
                {tempRoutine.length > 0 && (
                    <div className="bg-neutral-900 p-4 mb-2 shadow-sm border-b border-neutral-800 rounded-xl">
                        <h3 className="text-xs font-bold text-yellow-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                            <CheckCircle2 size={12} /> 선택된 운동 ({tempRoutine.length})
                        </h3>
                        <div className="space-y-2">
                            {tempRoutine.map((item, idx) => (
                                <div
                                    key={`${item.id}-${idx}`}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, idx)}
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, idx)}
                                    className={cn(
                                        "flex justify-between items-center bg-neutral-800 p-3 rounded-lg border border-neutral-700 transition-all cursor-move",
                                        draggedIdx === idx ? 'opacity-50 scale-95 border-yellow-400/50' : ''
                                    )}
                                >
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className="text-gray-500 cursor-grab active:cursor-grabbing">
                                            <GripVertical size={16} />
                                        </div>
                                        <span className="font-medium text-gray-200">{item.name}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1 text-sm text-yellow-400">
                                            <input
                                                type="number"
                                                className="w-8 bg-neutral-900 text-center rounded border border-neutral-700 h-6 text-white focus:border-yellow-400 outline-none"
                                                value={item.sets}
                                                onChange={(e) => updateSets(idx, parseInt(e.target.value) || 1)}
                                            />
                                            <span className="text-gray-500">set</span>
                                        </div>
                                        <button onClick={() => removeExercise(idx)} className="text-gray-500 hover:text-red-500"><X size={16} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Selector */}
                <div className="mt-4">
                    <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={cn(
                                    "px-4 py-2 rounded-full whitespace-nowrap text-sm font-bold transition-colors border",
                                    selectedCategory === cat.id ? 'bg-yellow-400 text-black border-yellow-400' : 'bg-transparent text-gray-400 border-neutral-700 hover:border-gray-500'
                                )}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    <div className="grid gap-3">
                        {EXERCISES[selectedCategory] && EXERCISES[selectedCategory].map((ex) => (
                            <button key={ex.id} onClick={() => addExercise(ex)} className="bg-neutral-900 p-4 rounded-xl border border-neutral-800 text-left hover:border-yellow-400/50 transition-all active:scale-[0.98] shadow-sm flex justify-between items-center group relative">
                                <div className="flex-1">
                                    <p className="font-bold text-white group-hover:text-yellow-400 transition-colors">{ex.name}</p>
                                    <p className="text-xs text-gray-500 mt-1">{ex.description}</p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center group-hover:bg-yellow-400 transition-colors">
                                        <Plus size={18} className="text-gray-400 group-hover:text-black" />
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="p-4 border-t border-neutral-800 bg-neutral-900 z-20">
                <Button onClick={handleSave} size="lg" variant="primary" className="font-bold w-full">
                    저장하기
                </Button>
            </div>
        </div>
    );
};
