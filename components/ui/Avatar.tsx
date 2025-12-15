import { User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AvatarProps {
    color?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    className?: string;
}

export const Avatar = ({ color, size = 'md', className }: AvatarProps) => {
    const sizeClass = {
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-16 h-16',
        xl: 'w-20 h-20',
        '2xl': 'w-24 h-24'
    }[size];

    const fontSize = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-xl',
        xl: 'text-2xl',
        '2xl': 'text-3xl'
    }[size];

    const iconSize = {
        sm: 14,
        md: 20,
        lg: 24,
        xl: 32,
        '2xl': 40
    }[size];

    return (
        <div className={cn(
            sizeClass,
            "rounded-full flex items-center justify-center text-white font-bold border-2 border-neutral-800 shadow-sm",
            fontSize,
            color || 'bg-gray-700',
            className
        )}>
            <User size={iconSize} />
        </div>
    );
};
