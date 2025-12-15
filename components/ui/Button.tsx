import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { ArrowRight, Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'white';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    icon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', loading, children, icon, disabled, ...props }, ref) => {
        const baseStyle = "font-medium rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2";

        const variants = {
            primary: "bg-yellow-400 text-black hover:bg-yellow-300 shadow-lg shadow-yellow-400/20 disabled:bg-yellow-400/50",
            secondary: "bg-neutral-800 text-white hover:bg-neutral-700 border border-neutral-700 disabled:bg-neutral-800/50",
            danger: "bg-red-900/50 text-red-400 hover:bg-red-900/70 border border-red-900 disabled:bg-red-900/20",
            ghost: "bg-transparent text-gray-400 hover:bg-neutral-800 hover:text-white",
            outline: "border-2 border-neutral-700 text-gray-300 hover:border-yellow-400 hover:text-yellow-400",
            white: "bg-white text-black hover:bg-gray-100 shadow-md"
        };

        const sizes = {
            sm: "px-3 py-1.5 text-sm",
            md: "px-4 py-3 text-base",
            lg: "px-6 py-4 text-lg w-full"
        };

        return (
            <button
                ref={ref}
                className={cn(baseStyle, variants[variant], sizes[size], className)}
                disabled={loading || disabled}
                {...props}
            >
                {loading && <Loader2 className="animate-spin" size={20} />}
                {!loading && icon}
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';

export { Button };
