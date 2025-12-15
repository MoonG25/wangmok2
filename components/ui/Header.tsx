import { Avatar } from '@/components/ui/Avatar';
import { Zap } from 'lucide-react';

export const Header = () => (
    <header className="px-5 py-4 flex justify-between items-center bg-neutral-900/80 backdrop-blur-md sticky top-0 z-10 border-b border-neutral-800">
        <div className="flex items-center gap-2">
            <Zap className="text-yellow-400 fill-yellow-400" size={20} />
            <span className="text-xs text-gray-400 font-medium">Power ON</span>
        </div>
        <div className="flex items-center gap-1">
            <span className="font-black text-xl tracking-tighter italic text-white">
                FIT<span className="text-yellow-400">LIFE</span>
            </span>
        </div>
        <Avatar color="bg-neutral-800 text-yellow-400" size="sm" />
    </header>
);
