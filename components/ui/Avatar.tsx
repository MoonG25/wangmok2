import { User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AvatarProps {
    color?: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const Avatar = ({ color, size = 'md', className }: AvatarProps) => {
    const sizeClass = size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-16 h-16' : 'w-10 h-10';
    const fontSize = size === 'lg' ? 'text-xl' : 'text-sm';

    return (
        <div className={cn(
            sizeClass,
            "rounded-full flex items-center justify-center text-white font-bold border-2 border-neutral-800 shadow-sm",
            fontSize,
            color || 'bg-gray-700',
            className
        )}>
            <User size={size === 'sm' ? 14 : size === 'lg' ? 24 : 20} />
        </div>
    );
};
