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
}

export const Modal = ({ isOpen, onClose, children, className, title, showCloseButton = true }: ModalProps) => {
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
            <div className={cn(
                "bg-neutral-900 w-full max-w-md rounded-t-2xl sm:rounded-2xl flex flex-col overflow-hidden border border-neutral-800 max-h-[90vh] sm:max-h-[800px] animate-in slide-in-from-bottom duration-300",
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
                <div className="flex-1 overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
};
