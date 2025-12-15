'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Medal, Trophy, TrendingUp, Zap } from 'lucide-react';
import { RANKING_DATA, TIERS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { useStore } from '@/lib/store';

export const RankingList = () => {
    const { user } = useStore();
    const [activeRankTier, setActiveRankTier] = useState('Grand Master');

    // Mock User Stats for Header
    const userScore = 14200;

    const filteredRanking = RANKING_DATA.filter(u => u.tier === activeRankTier);

    const getRankStyle = (rank: number) => {
        if (rank === 1) return 'border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)] bg-yellow-400/10';
        if (rank === 2) return 'border-gray-300 shadow-[0_0_10px_rgba(209,213,219,0.3)] bg-gray-300/10';
        if (rank === 3) return 'border-orange-400 shadow-[0_0_10px_rgba(251,146,60,0.3)] bg-orange-400/10';
        return 'border-neutral-800 bg-neutral-900';
    };

    const getMedalIcon = (rank: number) => {
        if (rank === 1) return <Medal size={20} className="text-yellow-400 fill-yellow-400" />;
        if (rank === 2) return <Medal size={20} className="text-gray-300 fill-gray-300" />;
        if (rank === 3) return <Medal size={20} className="text-orange-400 fill-orange-400" />;
        return <span className="text-gray-500 font-bold w-6 text-center">{rank}</span>;
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end px-1">
                <h2 className="font-black text-2xl text-white italic">MONTHLY<br /><span className="text-yellow-400">LEADERBOARD</span></h2>
                <div className="text-right">
                    <p className="text-xs text-gray-500 font-bold uppercase">Reset in</p>
                    <p className="text-white font-mono font-bold">12 Days</p>
                </div>
            </div>

            <div className="space-y-4">
                <Card className="p-4 bg-neutral-900 border border-neutral-800">
                    <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded bg-neutral-800 flex items-center justify-center border border-neutral-700"><Trophy className="text-yellow-400" /></div>
                            <div>
                                <p className="text-xs text-gray-500 font-bold uppercase">My Rank</p>
                                <p className="text-lg font-black text-white italic">#14 {activeRankTier}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-500">Total Score</p>
                            <p className="text-sm font-bold text-blue-400">{userScore.toLocaleString()} pts</p>
                        </div>
                    </div>
                    <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden"><div className="h-full bg-blue-500 w-[75%]"></div></div>
                </Card>

                {/* 1RM Graph Mock */}
                <Card className="p-5 bg-neutral-900 border-neutral-800 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5"><TrendingUp size={100} className="text-yellow-400" /></div>
                    <h3 className="font-bold text-gray-300 mb-6 flex items-center gap-2 z-10 relative"><Zap size={16} className="text-yellow-400 fill-yellow-400" />1RM GROWTH <span className="text-xs text-gray-600 bg-neutral-800 px-2 py-0.5 rounded">SQUAT</span></h3>
                    <div className="h-40 flex items-end justify-between gap-3 px-2 z-10 relative">
                        {[60, 65, 70, 65, 80, 85, 90].map((val, idx) => (
                            <div key={idx} className="w-full flex flex-col items-center gap-2 group">
                                <div className="w-full relative h-32 flex items-end">
                                    <div style={{ height: `${val}%` }} className="w-full bg-neutral-800 rounded-t group-hover:bg-yellow-400 transition-colors relative duration-300"></div>
                                    <div style={{ bottom: `${val}%` }} className="absolute w-full h-0.5 bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,1)] mb-[-1px] z-20 group-hover:opacity-100 opacity-50 transition-opacity"></div>
                                </div>
                                <span className="text-[10px] text-gray-600 font-bold">{idx + 1}W</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Tiers Scroll */}
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {TIERS.map(tier => (
                    <button key={tier} onClick={() => setActiveRankTier(tier)} className={cn("px-4 py-2 rounded-full whitespace-nowrap text-xs font-bold transition-all border", activeRankTier === tier ? 'bg-white text-black border-white shadow-[0_0_10px_rgba(255,255,255,0.3)]' : 'bg-neutral-900 text-gray-500 border-neutral-800 hover:border-gray-600')}>{tier}</button>
                ))}
            </div>

            {/* List */}
            <div className="space-y-3 pb-20">
                {filteredRanking.map((item) => (
                    <div key={item.id} className={cn("flex items-center justify-between p-4 rounded-xl border transition-all", getRankStyle(item.rank))}>
                        <div className="flex items-center gap-4">
                            <div className="w-6 flex justify-center">{getMedalIcon(item.rank)}</div>
                            <Avatar size="sm" color={item.avatar} />
                            <div>
                                <span className={cn("font-bold", item.rank <= 3 ? 'text-white' : 'text-gray-300', item.id === user?.uid ? 'text-yellow-400' : '')}>{item.name} {item.id === user?.uid && '(Me)'}</span>
                                {item.rank <= 3 && <p className="text-[10px] text-yellow-400 font-bold uppercase tracking-widest">Top Rated</p>}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-white font-black font-mono text-lg">{item.score.toLocaleString()}</span>
                            <span className="text-[10px] text-gray-600 font-bold uppercase">pts</span>
                        </div>
                    </div>
                ))}
                {filteredRanking.length === 0 && <div className="text-center py-10 text-gray-600">No users in this tier yet.</div>}
            </div>
        </div>
    );
};
