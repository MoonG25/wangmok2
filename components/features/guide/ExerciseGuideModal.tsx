'use client';

import { Modal } from '@/components/ui/Modal';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, Dumbbell, X } from 'lucide-react';

export const ExerciseGuideModal = () => {
    const { viewingExercise, setViewingExercise } = useStore();

    if (!viewingExercise) return null;

    return (
        <Modal isOpen={!!viewingExercise} onClose={() => setViewingExercise(null)} className="max-w-sm" showCloseButton={false}>
            <div className="relative">
                <button
                    onClick={() => setViewingExercise(null)}
                    className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white backdrop-blur-md z-10 transition-colors"
                >
                    <X size={20} />
                </button>

                {/* Media Area (Video or GIF Placeholder) */}
                <div className="aspect-[4/3] bg-neutral-800 flex items-center justify-center relative overflow-hidden group">
                    {viewingExercise.mp4_url ? (
                        <video
                            src={viewingExercise.mp4_url}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="relative w-full h-full flex items-center justify-center">
                            <Dumbbell className="text-yellow-400 w-32 h-32 animate-bounce" strokeWidth={1} />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-20 h-2 bg-yellow-400/20 rounded-full mt-24 blur-sm animate-pulse"></div>
                            </div>
                            <div className="absolute bottom-3 right-3 bg-black/70 text-yellow-400 text-[10px] px-2 py-1 rounded backdrop-blur-md font-bold border border-yellow-400/20">
                                GIF
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6">
                    <h3 className="text-2xl font-black italic text-white mb-1 uppercase">{viewingExercise.name}</h3>
                    <p className="text-yellow-400 font-medium text-sm mb-4">{viewingExercise.description}</p>

                    <div className="space-y-4">
                        <div className="bg-neutral-800 p-4 rounded-xl border border-neutral-700">
                            <h4 className="font-bold text-gray-200 text-sm mb-2 flex items-center gap-2">
                                <CheckCircle2 size={16} className="text-emerald-500" />
                                운동 방법
                            </h4>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                {viewingExercise.guide || "허리를 곧게 펴고 정확한 자세로 동작을 수행하세요. 부상 방지를 위해 무리한 중량은 피해주세요."}
                            </p>
                        </div>

                        <div className="flex gap-2">
                            <div className="flex-1 bg-neutral-800 border border-neutral-700 p-3 rounded-lg text-center">
                                <p className="text-[10px] text-gray-500 font-bold mb-1 uppercase">Target</p>
                                <p className="text-sm font-bold text-orange-400">주동근</p>
                            </div>
                            <div className="flex-1 bg-neutral-800 border border-neutral-700 p-3 rounded-lg text-center">
                                <p className="text-[10px] text-gray-500 font-bold mb-1 uppercase">Level</p>
                                <p className="text-sm font-bold text-blue-400">초급</p>
                            </div>
                        </div>
                    </div>

                    <Button onClick={() => setViewingExercise(null)} variant="secondary" className="w-full mt-6">
                        닫기
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
