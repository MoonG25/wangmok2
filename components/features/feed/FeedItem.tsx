'use client';

import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { MoreHorizontal, Heart, Share2, ImageIcon } from 'lucide-react';
import { useState } from 'react';
// import { useStore } from '@/lib/store'; // For user auth to check 'isLiked'
// In a real app we would pass 'currentUser' to check likedBy array.

interface FeedItemProps {
    post: any; // Type strictly later
    currentUserId?: string;
    onLike: (post: any) => void;
    onShare: (post: any) => void;
    onMore: (post: any) => void;
}

export const FeedItem = ({ post, currentUserId, onLike, onShare, onMore }: FeedItemProps) => {
    const isLiked = post.likedBy && currentUserId && post.likedBy.includes(currentUserId);

    return (
        <div className="bg-neutral-900 p-5 border-y border-neutral-800">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    <Avatar size="sm" />
                    <div>
                        <p className="font-bold text-sm text-white">{post.user}</p>
                        <p className="text-xs text-gray-500">{post.time || 'Just now'}</p>
                    </div>
                </div>
                <Button onClick={() => onMore(post)} variant="ghost" size="sm" className="px-0 text-gray-500"><MoreHorizontal size={20} /></Button>
            </div>
            {post.images && post.images.length > 0 && (
                <div className="bg-neutral-800 rounded-xl aspect-square mb-4 flex items-center justify-center relative overflow-hidden border border-neutral-800">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-5">
                        <p className="text-white font-black italic text-2xl">#오운완</p>
                    </div>
                    <ImageIcon size={48} className="text-neutral-700" />
                </div>
            )}
            <p className="text-gray-300 mb-4 text-sm leading-relaxed">{post.content}</p>
            <div className="flex gap-2 mb-4">
                <div className="bg-neutral-800 text-yellow-400 border border-neutral-700 px-3 py-1.5 rounded text-xs font-bold tracking-wide">
                    🏋️ {post.stats?.volume || 0}
                </div>
                <div className="bg-neutral-800 text-gray-300 border border-neutral-700 px-3 py-1.5 rounded text-xs font-bold tracking-wide">
                    ⏱️ {post.stats?.time || '0m'}
                </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-neutral-800">
                <div className="flex gap-4">
                    <button
                        onClick={() => onLike(post)}
                        className={`flex items-center gap-1.5 transition-colors ${isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                    >
                        <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
                        <span className="text-sm font-medium">{post.likes}</span>
                    </button>
                </div>
                <button onClick={() => onShare(post)} className="text-gray-400 hover:text-white"><Share2 size={20} /></button>
            </div>
        </div>
    );
};
