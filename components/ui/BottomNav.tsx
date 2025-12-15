'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Home, Activity, Play, Trophy, User } from 'lucide-react';
import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';

export const BottomNav = () => {
    const pathname = usePathname();
    const router = useRouter();

    // Determine active tab based on path. 
    // '/' -> home
    // '/feed' -> feed
    const activeTab = pathname === '/home' || pathname === '/' ? 'home' : pathname.split('/')[1];

    const { workoutStatus, routine, startWorkout, setActiveModal, activeWorkout } = useStore();

    const handleMainClick = () => {
        if (workoutStatus !== 'idle') {
            router.push('/runner');
        } else if (routine.length > 0) {
            startWorkout();
            router.push('/runner');
        } else {
            setActiveModal('builder');
        }
    };

    const handleNavClick = (id: string, path: string) => {
        if (id === 'runner') {
            handleMainClick();
        } else {
            router.push(path);
        }
    };

    const navItems = [
        { id: 'home', icon: Home, label: '홈', path: '/home' },
        { id: 'feed', icon: Activity, label: '피드', path: '/feed' },
        { id: 'runner', icon: Play, label: '운동', isMain: true, path: '/runner' },
        { id: 'ranking', icon: Trophy, label: '랭킹', path: '/ranking' },
        { id: 'mypage', icon: User, label: 'MY', path: '/mypage' },
    ];

    if (pathname === '/login') return null;

    return (
        <nav className="fixed bottom-0 w-full max-w-md left-0 right-0 mx-auto bg-neutral-900/95 backdrop-blur border-t border-neutral-800 flex justify-around py-3 px-2 z-20 pb-safe">
            {navItems.map((item) => (
                <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id, item.path)}
                    className={cn("flex flex-col items-center gap-1", item.isMain ? '-mt-8' : '')}
                >
                    {item.isMain ? (
                        <div className={cn(
                            "w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all border-4 border-neutral-950",
                            workoutStatus !== 'idle' ? 'bg-yellow-400 animate-pulse' : 'bg-yellow-400'
                        )}>
                            {workoutStatus === 'idle' ?
                                <Play className="text-black ml-1 fill-black" /> :
                                <Activity className="text-black" />
                            }
                        </div>
                    ) : (
                        <div className={cn("p-1 rounded-xl transition-colors", activeTab === item.id ? 'text-yellow-400' : 'text-neutral-500')}>
                            <item.icon size={24} strokeWidth={activeTab === item.id ? 2.5 : 2} />
                        </div>
                    )}
                    {!item.isMain && (
                        <span className={cn("text-[10px]", activeTab === item.id ? 'text-yellow-400 font-bold' : 'text-neutral-600')}>
                            {item.label}
                        </span>
                    )}
                </button>
            ))}
        </nav>
    );
};
