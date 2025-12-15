import { MOCK_USERS_ONLINE } from '@/lib/constants';
import { Avatar } from '@/components/ui/Avatar';

export const LiveGymWidget = () => (
    <section>
        <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]"></span>
                라이브 짐
            </h2>
            <span className="text-sm text-yellow-400 font-medium">52명 운동중</span>
        </div>
        <div className="flex -space-x-3 overflow-hidden py-2 pl-1">
            {MOCK_USERS_ONLINE.map((u: any) => (
                <Avatar key={u.id} color={u.avatar} />
            ))}
            <div className="w-10 h-10 rounded-full bg-neutral-800 border-2 border-neutral-900 flex items-center justify-center text-xs text-gray-400 font-medium">
                +47
            </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">친구 3명이 지금 하체를 조지고 있어요!</p>
    </section>
);
