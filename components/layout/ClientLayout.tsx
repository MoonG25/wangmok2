'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { BottomNav } from '@/components/ui/BottomNav';
import { Modal } from '@/components/ui/Modal';
import { Header } from '@/components/ui/Header';
import { WorkoutBuilder } from '@/components/features/builder/WorkoutBuilder';
import { FeedCreateModal } from '@/components/features/feed/FeedCreateModal';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { ExerciseGuideModal } from '@/components/features/guide/ExerciseGuideModal';
import { signOut } from 'firebase/auth';

export const ClientLayout = ({ children }: { children: React.ReactNode }) => {
    const {
        activeModal,
        setActiveModal,
        setUser,
        user
    } = useStore();

    const pathname = usePathname();
    const router = useRouter();
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        setHydrated(true); // Wait for hydration to avoid mismatch
    }, []);

    // Auth Listener
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (!currentUser && pathname !== '/' && pathname !== '/login') {
                router.push('/');
            }
        });
        return () => unsubscribe();
    }, [setUser, router, pathname]);

    if (!hydrated) return null; // Or a loader

    const isInternalPage = pathname !== '/' && pathname !== '/login';

    return (
        <div className="max-w-md mx-auto min-h-screen bg-neutral-950 shadow-2xl overflow-hidden font-sans text-gray-100 relative mb-safe">
            {isInternalPage && <Header />}

            <main className={isInternalPage ? "min-h-screen pb-24" : "min-h-screen"}>
                {children}
            </main>

            {isInternalPage && <BottomNav />}

            {/* Global Modals */}
            <Modal isOpen={activeModal === 'builder'} onClose={() => setActiveModal(null)} title="운동 일정 만들기">
                <WorkoutBuilder />
            </Modal>

            <Modal isOpen={activeModal === 'feed-create'} onClose={() => { }} showCloseButton={false} className="bg-transparent border-none shadow-none p-0">
                {/* FeedCreateModal has its own style container, so we unwrap or adjust? 
                     FeedCreateModal implementation has a container. 
                     The Modal wrapper adds a container. Double container?
                     Let's check Modal implementation. It adds bg-neutral-900.
                     FeedCreateModal also adds bg-neutral-900.
                     I should adjust FeedCreateModal to NOT have the outer wrapper or pass className to Modal.
                  */}
                <FeedCreateModal />
            </Modal>

            <Modal isOpen={activeModal === 'quit-confirm'} onClose={() => setActiveModal(null)}>
                <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">운동 종료</h3>
                    <p className="text-gray-400 mb-6 text-sm">진행 중인 운동이 저장되지 않을 수 있습니다. 정말 종료하시겠습니까?</p>
                    <div className="flex gap-3">
                        <Button onClick={() => setActiveModal(null)} variant="secondary" className="flex-1">취소</Button>
                        <Button onClick={() => {
                            useStore.getState().resetWorkoutState();
                            setActiveModal(null);
                            router.push('/home');
                        }} variant="danger" className="flex-1">종료</Button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={activeModal === 'logout-confirm'} onClose={() => setActiveModal(null)}>
                <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">로그아웃</h3>
                    <p className="text-gray-400 mb-6 text-sm">정말 로그아웃 하시겠습니까?</p>
                    <div className="flex gap-3">
                        <Button onClick={() => setActiveModal(null)} variant="secondary" className="flex-1">취소</Button>
                        <Button onClick={async () => {
                            await signOut(auth);
                            useStore.getState().resetWorkoutState();
                            setActiveModal(null);
                            router.push('/');
                        }} variant="danger" className="flex-1">로그아웃</Button>
                    </div>
                </div>
            </Modal>

            <ExerciseGuideModal />
        </div>
    );
};
