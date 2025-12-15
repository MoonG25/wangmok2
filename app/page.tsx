'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Dumbbell, Mail, Lock, ArrowRight } from 'lucide-react';
import { signInAnonymously, updateProfile } from "firebase/auth";
import { auth, db, APP_ID } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';

export default function LoginPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('wangmok@test.com');
  const [password, setPassword] = useState('wangmok12#');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async (type: string) => {
    setLoading(true);
    try {
      // For prototype, we stick to Anonymous login but simulate 'Email' flow by updating profile
      // In real app, use createUserWithEmailAndPassword
      await signInAnonymously(auth);

      const user = auth.currentUser;
      if (!user) return;

      let displayName = 'User';
      let providerId = 'anonymous';

      if (type === 'kakao') {
        displayName = '김헬스(Kakao)';
        providerId = 'kakao';
      } else if (type === 'google') {
        displayName = '김헬스(Google)';
        providerId = 'google';
      } else {
        displayName = email.split('@')[0] || 'User';
        providerId = 'email';
      }

      await updateProfile(user, { displayName });

      await setDoc(doc(db, 'artifacts', APP_ID, 'users', user.uid, 'profile', 'info'), {
        uid: user.uid,
        name: displayName,
        email: type === 'email' ? email : `${providerId}@example.com`,
        provider: providerId,
        createdAt: new Date().toISOString()
      }, { merge: true });

      const statsRef = doc(db, 'artifacts', APP_ID, 'users', user.uid, 'data', 'stats');
      const statsSnap = await getDoc(statsRef);
      if (!statsSnap.exists()) {
        await setDoc(statsRef, {
          totalVolume: 0,
          weeklyVolume: 0,
          weeklyActivity: Array(7).fill(false),
          workoutsCompleted: 0
        });
      }

      router.push('/home');

    } catch (error) {
      console.error("Auth error:", error);

      // Fallback to Demo Mode
      alert("Firebase 인증에 실패했습니다. 테스트 모드로 진입합니다.");
      useStore.getState().setDemoMode(true);
      useStore.getState().setUser({
        uid: 'demo-user',
        displayName: 'Test User',
        email: 'test@example.com',
        emailVerified: true,
        isAnonymous: true,
        providerData: [],
        metadata: {},
        refreshToken: '',
        tenantId: null,
        delete: async () => { },
        getIdToken: async () => '',
        getIdTokenResult: async () => ({} as any),
        reload: async () => { },
        toJSON: () => ({})
      } as any);

      router.push('/home');

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-900 via-neutral-950 to-neutral-950 z-0"></div>
      <div className="absolute top-10 left-10 w-64 h-64 bg-yellow-400/10 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] animate-pulse delay-700"></div>

      <div className="w-full max-w-sm z-10 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-400 rounded-2xl mb-4 shadow-lg shadow-yellow-400/20">
            <Dumbbell className="text-black w-8 h-8" />
          </div>
          <h1 className="text-4xl font-black text-white italic tracking-tighter">
            FIT<span className="text-yellow-400">LIFE</span>
          </h1>
          <p className="text-gray-400 text-sm">Every Rep Counts. Start Your Journey.</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-3">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="email"
                placeholder="이메일 주소"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-400 transition-colors"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-400 transition-colors"
              />
            </div>
          </div>

          <Button
            onClick={() => handleAuth('email')}
            variant="primary"
            className="w-full font-bold text-lg h-14"
            loading={loading}
          >
            {isSignup ? '회원가입' : '로그인'}
            {!loading && <ArrowRight className="w-5 h-5 ml-1" />}
          </Button>
        </div>

        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-800"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-neutral-950 px-2 text-gray-600 font-bold">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleAuth('email')}
            disabled={loading}
            className="col-span-2 bg-yellow-400 hover:bg-yellow-300 text-black font-black py-4 rounded-xl shadow-lg shadow-yellow-400/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Dumbbell size={20} />
            <span>테스트 계정으로 바로 시작하기</span>
          </button>

          <button
            onClick={() => handleAuth('kakao')}
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-[#FEE500] text-black/90 font-bold py-3.5 rounded-xl hover:bg-[#FDD835] transition-colors disabled:opacity-50"
          >
            <span className="text-sm">카카오 로그인</span>
          </button>
          <button
            onClick={() => handleAuth('google')}
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-white text-gray-700 font-bold py-3.5 rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            <span className="text-sm">구글 로그인</span>
          </button>
        </div>

        <div className="text-center">
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-sm text-gray-500 hover:text-yellow-400 transition-colors font-medium"
          >
            {isSignup ? "이미 계정이 있으신가요? 로그인" : "계정이 없으신가요? 회원가입"}
          </button>
        </div>
      </div>
    </div>
  );
}
