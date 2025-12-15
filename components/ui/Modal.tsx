import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    className?: string;
    title?: string;
    showCloseButton?: boolean;
    disableContentScroll?: boolean;
    fullScreen?: boolean;
}

export const Modal = ({ isOpen, onClose, children, className, title, showCloseButton = true, disableContentScroll = false, fullScreen = false }: ModalProps) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!mounted || !isOpen) return null;

    return createPortal(
        <div className={cn(
            "fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center animate-in fade-in duration-200",
            fullScreen ? "p-0" : "p-0 sm:p-4"
        )}>
            <div className={cn(
                "bg-neutral-900 w-full flex flex-col overflow-hidden border-t sm:border border-neutral-800 animate-in slide-in-from-bottom duration-300",
                fullScreen
                    ? "h-[100dvh] max-w-md mx-auto sm:h-[800px] sm:rounded-2xl"
                    : "max-w-md rounded-t-2xl sm:rounded-2xl max-h-[90vh] sm:max-h-[800px]",
                className
            )}>
                {(title || showCloseButton) && (
                    <div className="p-4 border-b border-neutral-800 flex justify-between items-center sticky top-0 bg-neutral-900 z-10">
                        {title && <h2 className="font-bold text-lg text-white">{title}</h2>}
                        {showCloseButton && (
                            <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
                                <X size={24} />
                            </button>
                        )}
                    </div>
                )}
                <div className={cn("flex-1", disableContentScroll ? "overflow-hidden" : "overflow-y-auto")}>
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
};
