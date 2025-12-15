'use client';

import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ChevronRight, LogOut, Settings, Bell, Moon, Shield, HelpCircle, Trophy, Activity, History, Edit2, Dumbbell } from 'lucide-react';
import { useStore } from '@/lib/store';
import { getLevel } from '@/lib/utils';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export const MyPageHeader = () => {
    const { user, setActiveModal } = useStore();
    const router = useRouter();

    // Mock stats - in real app would come from firestore or store
    const stats = {
        totalVolume: 64200,
        workoutsCompleted: 32,
        streak: 5,
        bestLift: 140
    };

    const handleLogout = () => {
        setActiveModal('logout-confirm');
    };

    const menuGroups = [
        {
            title: "계정",
            items: [
                { icon: <Settings size={18} />, label: "계정 설정", value: "" },
                { icon: <Shield size={18} />, label: "개인정보 보호", value: "" },
            ]
        },
        {
            title: "앱 설정",
            items: [
                { icon: <Bell size={18} />, label: "알림 설정", value: "ON" },
                { icon: <Moon size={18} />, label: "다크 모드", value: "System" },
            ]
        },
        {
            title: "지원",
            items: [
                { icon: <HelpCircle size={18} />, label: "도움말", value: "" },
            ]
        }
    ];

    return (
        <div className="pb-24 bg-neutral-950 min-h-screen relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-neutral-800 to-neutral-950 z-0"></div>
            <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-yellow-400/5 rounded-full blur-[80px] z-0"></div>

            <div className="relative z-10 px-6 pt-8 pb-6">
                {/* Profile Header */}
                <div className="flex flex-col items-center mb-8">
                    <div className="relative mb-4 group cursor-pointer">
                        <div className="absolute -inset-1 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                        <Avatar size="2xl" className="w-24 h-24 border-4 border-neutral-900 bg-neutral-800 text-3xl font-bold shadow-2xl relative z-10" />
                        <button className="absolute bottom-0 right-0 bg-neutral-800 p-2 rounded-full border border-neutral-700 text-white hover:bg-neutral-700 hover:text-yellow-400 transition-colors z-20 shadow-lg">
                            <Edit2 size={14} />
                        </button>
                    </div>

                    <h2 className="text-2xl font-black text-white mb-1 flex items-center gap-2">
                        {user?.displayName || 'Unknown Warrior'}
                        <span className="bg-yellow-400 text-black text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                            {getLevel(stats.totalVolume)}
                        </span>
                    </h2>
                    <p className="text-gray-400 text-sm font-medium">{user?.email || 'user@example.com'}</p>
                </div>

                {/* Main Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                    <Card className="p-4 bg-neutral-900/50 border-neutral-800 backdrop-blur-sm flex flex-col items-center justify-center gap-1 group hover:border-yellow-400/30 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-yellow-400/10 flex items-center justify-center mb-1 group-hover:bg-yellow-400 group-hover:text-black transition-colors text-yellow-400">
                            <Trophy size={20} />
                        </div>
                        <span className="text-2xl font-black text-white">{stats.workoutsCompleted}</span>
                        <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Workouts</span>
                    </Card>
                    <Card className="p-4 bg-neutral-900/50 border-neutral-800 backdrop-blur-sm flex flex-col items-center justify-center gap-1 group hover:border-yellow-400/30 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mb-1 group-hover:bg-blue-500 group-hover:text-white transition-colors text-blue-500">
                            <Activity size={20} />
                        </div>
                        <span className="text-2xl font-black text-white">{(stats.totalVolume / 1000).toFixed(1)}k</span>
                        <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Volume (kg)</span>
                    </Card>
                    <Card className="p-4 bg-neutral-900/50 border-neutral-800 backdrop-blur-sm flex flex-col items-center justify-center gap-1 group hover:border-yellow-400/30 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center mb-1 group-hover:bg-orange-500 group-hover:text-white transition-colors text-orange-500">
                            <History size={20} />
                        </div>
                        <span className="text-2xl font-black text-white">{stats.streak}</span>
                        <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Day Streak</span>
                    </Card>
                    <Card className="p-4 bg-neutral-900/50 border-neutral-800 backdrop-blur-sm flex flex-col items-center justify-center gap-1 group hover:border-yellow-400/30 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center mb-1 group-hover:bg-purple-500 group-hover:text-white transition-colors text-purple-500">
                            <Dumbbell size={20} />
                        </div>
                        <span className="text-2xl font-black text-white">{stats.bestLift}</span>
                        <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Best Lift</span>
                    </Card>
                </div>

                {/* Settings Menus */}
                <div className="space-y-6">
                    {menuGroups.map((group, idx) => (
                        <div key={idx}>
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-1">{group.title}</h3>
                            <Card className="p-0 bg-neutral-900 border-neutral-800 overflow-hidden">
                                {group.items.map((item, itemIdx) => (
                                    <button
                                        key={itemIdx}
                                        className="w-full text-left p-4 border-b border-neutral-800 last:border-0 flex justify-between items-center hover:bg-neutral-800 transition-colors group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-gray-400 group-hover:text-white transition-colors">{item.icon}</span>
                                            <span className="font-medium text-gray-300 group-hover:text-white transition-colors">{item.label}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {item.value && <span className="text-xs text-gray-500">{item.value}</span>}
                                            <ChevronRight size={16} className="text-gray-600" />
                                        </div>
                                    </button>
                                ))}
                            </Card>
                        </div>
                    ))}

                    <div>
                        <button
                            onClick={handleLogout}
                            className="w-full bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center justify-center gap-2 text-red-500 font-bold hover:bg-red-500/20 transition-all active:scale-[0.98]"
                        >
                            <LogOut size={18} />
                            로그아웃
                        </button>
                        <p className="text-center text-[10px] text-gray-700 mt-4">
                            FitLife Pro v1.0.0 (Build 2025.1.15)
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

