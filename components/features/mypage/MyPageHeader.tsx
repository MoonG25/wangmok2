'use client';

import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ChevronRight, LogOut } from 'lucide-react';
import { useStore } from '@/lib/store';
import { getLevel } from '@/lib/utils';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export const MyPageHeader = () => {
    const { user, setActiveModal } = useStore();
    const router = useRouter();

    // Mock user stats or fetch from store if available
    const stats = {
        totalVolume: 64200,
        workoutsCompleted: 32
    };

    const handleLogout = () => {
        setActiveModal('logout-confirm');
    };

    return (
        <div className="pb-24">
            <div className="bg-neutral-900 p-8 pb-10 pt-10 border-b border-neutral-800">
                <div className="flex items-center gap-4 mb-6">
                    <Avatar size="lg" color="bg-neutral-800 text-yellow-400 border border-neutral-700" />
                    <div>
                        <h2 className="text-2xl font-bold text-white">{user?.displayName || 'User'}</h2>
                        <p className="text-yellow-400 text-sm font-medium">{user?.email || 'user@example.com'}</p>
                        <p className="text-gray-500 text-xs mt-1">운동 32일차 • 레벨 {getLevel(stats.totalVolume)}</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="text-center">
                        <p className="font-black text-xl text-white">{stats.workoutsCompleted || 0}</p>
                        <p className="text-xs text-gray-500">운동 횟수</p>
                    </div>
                    <div className="w-[1px] bg-neutral-800 h-8 self-center"></div>
                    <div className="text-center">
                        <p className="font-black text-xl text-white">{(stats.totalVolume / 1000).toFixed(1)}t</p>
                        <p className="text-xs text-gray-500">총 볼륨</p>
                    </div>
                </div>
            </div>
            <div className="p-5 -mt-6">
                <Card className="p-0 bg-neutral-900 border-neutral-800">
                    {['계정 설정', '알림 설정'].map((item, idx) => (
                        <button key={idx} className="w-full text-left p-4 border-b border-neutral-800 last:border-0 flex justify-between items-center hover:bg-neutral-800 transition-colors">
                            <span className="font-medium text-gray-300">{item}</span>
                            <ChevronRight size={16} className="text-gray-600" />
                        </button>
                    ))}
                    <button onClick={handleLogout} className="w-full text-left p-4 border-b border-neutral-800 last:border-0 flex justify-between items-center hover:bg-red-900/20 transition-colors group">
                        <span className="font-medium text-red-400 group-hover:text-red-300">로그아웃</span>
                        <LogOut size={16} className="text-red-400 group-hover:text-red-300" />
                    </button>
                </Card>
            </div>
        </div>
    );
}
