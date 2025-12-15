'use client';

import { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, increment, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db, APP_ID } from '@/lib/firebase';
import { useStore } from '@/lib/store';
import { FeedItem } from '@/components/features/feed/FeedItem';

export default function FeedPage() {
    const { user } = useStore();
    const [posts, setPosts] = useState<any[]>([]);

    useEffect(() => {
        if (!user) return;
        if (!db) {
            // Offline/Demo Mode: Set mock posts or empty
            setPosts([
                {
                    id: 'mock-1',
                    user: '데모 유저',
                    uid: 'demo',
                    time: '방금 전',
                    content: '오프라인 모드입니다. 파이어베이스 설정이 필요합니다.',
                    likes: 0,
                    likedBy: [],
                    images: [],
                    stats: { volume: '0kg', time: '0m' },
                    createdAt: { seconds: Date.now() / 1000 }
                }
            ]);
            return;
        }

        const feedsRef = collection(db, 'artifacts', APP_ID, 'public', 'data', 'feeds');
        const q = query(feedsRef, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedPosts = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setPosts(fetchedPosts);
        });

        return () => unsubscribe();
    }, [user]);

    const handleLike = async (post: any) => {
        if (!user || !db) return; // Skip if offline
        const postRef = doc(db, 'artifacts', APP_ID, 'public', 'data', 'feeds', post.id);
        const isLiked = post.likedBy && post.likedBy.includes(user.uid);

        try {
            if (isLiked) {
                await updateDoc(postRef, {
                    likes: increment(-1),
                    likedBy: arrayRemove(user.uid)
                });
            } else {
                await updateDoc(postRef, {
                    likes: increment(1),
                    likedBy: arrayUnion(user.uid)
                });
            }
        } catch (error) {
            console.error("Error toggling like:", error);
        }
    };

    return (
        <div className="pb-24">
            <div className="px-5 py-3 border-b border-neutral-800 flex justify-between items-center sticky top-0 bg-neutral-900/90 backdrop-blur z-10">
                <h2 className="font-bold text-lg text-white">피드</h2>
                <div className="flex gap-4 text-sm font-medium">
                    <span className="text-yellow-400 border-b-2 border-yellow-400 pb-1">추천</span>
                    <span className="text-gray-500 pb-1">팔로잉</span>
                </div>
            </div>

            <div className="space-y-3 bg-neutral-950 pt-3">
                {posts.map(post => (
                    <FeedItem
                        key={post.id}
                        post={post}
                        currentUserId={user?.uid}
                        onLike={handleLike}
                        onShare={() => { }}
                        onMore={() => { }}
                    />
                ))}
                {posts.length === 0 && (
                    <div className="text-center py-20 text-gray-500">
                        게시물이 없습니다. 첫 번째 기록을 남겨보세요!
                    </div>
                )}
            </div>
        </div>
    );
}
