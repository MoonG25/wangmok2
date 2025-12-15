import React, { useState, useEffect, useRef } from 'react';
import {
    Home,
    Activity,
    Play,
    Trophy,
    User,
    Plus,
    Calendar,
    Clock,
    MoreHorizontal,
    Heart,
    Share2,
    ChevronRight,
    Pause,
    RotateCcw,
    CheckCircle2,
    Dumbbell,
    Flame,
    Settings,
    X,
    Image as ImageIcon,
    Sun,
    CloudSun,
    Info,
    PlayCircle,
    SkipForward,
    StopCircle,
    Zap,
    Check,
    Droplets,
    Crown,
    TrendingUp,
    Video,
    Medal,
    LogOut,
    Mail,
    Lock,
    ArrowRight,
    Copy,
    AlertTriangle,
    EyeOff,
    UserMinus,
    Moon,
    Utensils,
    Footprints,
    Coffee,
    Smile,
    GripVertical
} from 'lucide-react';

// --- Firebase Imports ---
import { initializeApp } from "firebase/app";
import {
    getAuth,
    signInWithCustomToken,
    signInAnonymously,
    signOut,
    onAuthStateChanged,
    updateProfile
} from "firebase/auth";
import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    onSnapshot,
    collection,
    addDoc,
    query,
    orderBy,
    serverTimestamp,
    updateDoc,
    increment,
    arrayUnion,
    arrayRemove,
    deleteDoc
} from "firebase/firestore";

// --- Firebase Initialization ---
const firebaseConfig = JSON.parse(__firebase_config);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

// --- Mock Data & Constants ---

const CATEGORIES = [
    { id: 'back', name: '등', color: 'bg-blue-900/30 text-blue-400 border border-blue-800/50' },
    { id: 'chest', name: '가슴', color: 'bg-indigo-900/30 text-indigo-400 border border-indigo-800/50' },
    { id: 'legs', name: '하체', color: 'bg-red-900/30 text-red-400 border border-red-800/50' },
    { id: 'shoulder', name: '어깨', color: 'bg-purple-900/30 text-purple-400 border border-purple-800/50' },
    { id: 'arms', name: '팔', color: 'bg-pink-900/30 text-pink-400 border border-pink-800/50' },
    { id: 'core', name: '코어', color: 'bg-green-900/30 text-green-400 border border-green-800/50' },
    { id: 'cardio', name: '유산소/스포츠', color: 'bg-orange-900/30 text-orange-400 border border-orange-800/50' },
];

const DAILY_QUESTS = [
    { id: 'water', title: '물 2L 마시기', desc: '수분 충전으로 근육 회복 돕기', icon: Droplets, color: 'blue', exp: 50 },
    { id: 'protein', title: '단백질 챙겨 먹기', desc: '체중 1kg당 1.5g 이상 섭취', icon: Utensils, color: 'red', exp: 60 },
    { id: 'sleep', title: '7시간 이상 수면', desc: '성장은 잘 때 이루어집니다', icon: Moon, color: 'purple', exp: 80 },
    { id: 'walk', title: '만보 걷기', desc: '생활 속 유산소 실천', icon: Footprints, color: 'green', exp: 100 },
    { id: 'nocoffee', title: '카페인 줄이기', desc: '오후 2시 이후 커피 금지', icon: Coffee, color: 'yellow', exp: 40 },
    { id: 'stretch', title: '아침 스트레칭', desc: '상쾌한 하루의 시작', icon: Activity, color: 'orange', exp: 30 },
    { id: 'mind', title: '명상 5분', desc: '운동 전 멘탈 관리', icon: Smile, color: 'pink', exp: 50 },
];

const EXERCISES = {
    back: [
        { id: '1001', name: '데드리프트', slug: 'deadlift', mp4_url: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/1001.mp4", description: "등/전신 근력 강화", defaultTime: 0 },
        { id: '1009', name: '시티드 케이블 로우', slug: 'seated-cable-row', mp4_url: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/1009.mp4", description: "등 중앙부 발달", defaultTime: 0 },
        { id: 'b1', name: '바벨 로우', slug: 'barbell-row', description: "등 근육 전체 두께", defaultTime: 0 },
        { id: 'b2', name: '풀 업', slug: 'pull-up', description: "광배근 너비 발달", defaultTime: 0 },
        { id: 'b3', name: '랫 풀다운', slug: 'lat-pulldown', description: "등 너비 운동", defaultTime: 0 },
        { id: 'b4', name: '루마니안 데드리프트', slug: 'romanian-deadlift', description: "등 하부 및 햄스트링", defaultTime: 0 },
        { id: 'b5', name: '백 익스텐션', slug: 'back-extension', description: "기립근 강화", defaultTime: 0 },
        { id: 'b6', name: '원 암 덤벨 로우', slug: 'one-arm-dumbbell-row', description: "광배근 고립 운동", defaultTime: 0 },
        { id: 'b7', name: '시티드 로우 머신', slug: 'seated-row-machine', description: "머신 등 운동", defaultTime: 0 },
        { id: 'b8', name: '티 바 로우', slug: 't-bar-row', description: "등 두께감 향상", defaultTime: 0 },
        { id: 'b9', name: '암 풀다운', slug: 'arm-pulldown', description: "광배근 고립", defaultTime: 0 },
        { id: 'b10', name: '굿모닝', slug: 'good-morning', description: "기립근 및 후면 사슬", defaultTime: 0 },
        { id: 'b11', name: '슈퍼맨 로우', slug: 'superman-row', description: "맨몸 등 운동", defaultTime: 0 },
        { id: 'b12', name: '펜들레이 로우', slug: 'pendlay-row', description: "폭발적인 등 수축", defaultTime: 0 },
        { id: 'b13', name: '랙 풀', slug: 'rack-pull', description: "데드리프트 부분 반복", defaultTime: 0 },
    ],
    chest: [
        { id: '2001', name: '벤치 프레스', slug: 'bench-press', mp4_url: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/2001.mp4", description: "가슴 운동의 왕", defaultTime: 0 },
        { id: '2002', name: '덤벨 벤치 프레스', slug: 'dumbbell-bench-press', mp4_url: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/2002.mp4", description: "가동범위 극대화", defaultTime: 0 },
        { id: '2008', name: '딥스', slug: 'dips', mp4_url: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/2008.mp4", description: "아랫가슴 및 삼두", defaultTime: 0 },
        { id: 'c1', name: '인클라인 벤치 프레스', slug: 'incline-bench-press', description: "윗가슴 발달", defaultTime: 0 },
        { id: 'c2', name: '덤벨 플라이', slug: 'dumbbell-fly', description: "가슴 안쪽 라인", defaultTime: 0 },
        { id: 'c3', name: '푸쉬업', slug: 'push-up', description: "기본 맨몸 운동", defaultTime: 0 },
        { id: 'c4', name: '펙덱 플라이', slug: 'pec-deck-fly', description: "머신 가슴 운동", defaultTime: 0 },
        { id: 'c5', name: '케이블 크로스오버', slug: 'cable-crossover', description: "가슴 하부 및 안쪽", defaultTime: 0 },
        { id: 'c6', name: '체스트 프레스 머신', slug: 'chest-press-machine', description: "안정적인 프레스", defaultTime: 0 },
        { id: 'c7', name: '디클라인 벤치 프레스', slug: 'decline-bench-press', description: "아랫가슴 타겟", defaultTime: 0 },
        { id: 'c8', name: '스미스 머신 벤치 프레스', slug: 'smith-machine-bench-press', description: "고립 프레스", defaultTime: 0 },
        { id: 'c9', name: '덤벨 풀오버', slug: 'dumbbell-pullover', description: "가슴과 등 동시 자극", defaultTime: 0 },
    ],
    legs: [
        { id: '4025', name: '프론트 스쿼트', slug: 'front-squat', mp4_url: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/4025.mp4", description: "대퇴사두 집중", defaultTime: 0 },
        { id: 'l1', name: '바벨 스쿼트', slug: 'barbell-squat', description: "하체 운동의 기본", defaultTime: 0 },
        { id: 'l2', name: '런지', slug: 'lunge', description: "힙업 및 균형", defaultTime: 0 },
        { id: 'l3', name: '레그 프레스', slug: 'leg-press', description: "고중량 하체 운동", defaultTime: 0 },
        { id: 'l4', name: '레그 익스텐션', slug: 'leg-extension', description: "허벅지 앞쪽 분리도", defaultTime: 0 },
        { id: 'l5', name: '레그 컬', slug: 'leg-curl', description: "햄스트링 강화", defaultTime: 0 },
        { id: 'l6', name: '바벨 스티프 레그 데드리프트', slug: 'barbell-stiff-leg-deadlift', description: "햄스트링 스트레칭", defaultTime: 0 },
        { id: 'l7', name: '카프 레이즈', slug: 'calf-raise', description: "종아리 운동", defaultTime: 0 },
        { id: 'l8', name: '핵 스쿼트 머신', slug: 'hack-squat-machine', description: "머신 스쿼트", defaultTime: 0 },
        { id: 'l9', name: '힙 어덕션 머신', slug: 'hip-adduction-machine', description: "내전근 강화", defaultTime: 0 },
        { id: 'l10', name: '바벨 힙 쓰러스트', slug: 'barbell-hip-thrust', description: "둔근 폭발력", defaultTime: 0 },
        { id: 'l11', name: '스모 데드리프트', slug: 'sumo-deadlift', description: "내전근 및 둔근", defaultTime: 0 },
        { id: 'l12', name: '불가리안 스플릿 스쿼트', slug: 'dumbbell-bulgarian-split-squat', description: "한발 스쿼트", defaultTime: 0 },
        { id: 'l13', name: '박스 점프', slug: 'box-jump', description: "플라이오메트릭", defaultTime: 0 },
    ],
    shoulder: [
        { id: '3001', name: '오버헤드 프레스', slug: 'overhead-press', mp4_url: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/3001.mp4", description: "어깨 전체 매스", defaultTime: 0 },
        { id: 's1', name: '덤벨 숄더 프레스', slug: 'dumbbell-shoulder-press', description: "전면/측면 삼각근", defaultTime: 0 },
        { id: 's2', name: '덤벨 레터럴 레이즈', slug: 'dumbbell-lateral-raise', description: "어깨 측면 고립", defaultTime: 0 },
        { id: 's3', name: '덤벨 프론트 레이즈', slug: 'dumbbell-front-raise', description: "전면 삼각근", defaultTime: 0 },
        { id: 's4', name: '페이스 풀', slug: 'face-pull', description: "후면 삼각근 및 회전근개", defaultTime: 0 },
        { id: 's5', name: '아놀드 프레스', slug: 'arnold-press', description: "전측면 회전 프레스", defaultTime: 0 },
        { id: 's6', name: '벤트 오버 레터럴 레이즈', slug: 'dumbbell-bent-over-lateral-raise', description: "후면 삼각근", defaultTime: 0 },
        { id: 's7', name: '바벨 슈러그', slug: 'barbell-shrug', description: "승모근 상부", defaultTime: 0 },
        { id: 's8', name: '숄더 프레스 머신', slug: 'shoulder-press-machine', description: "머신 어깨 운동", defaultTime: 0 },
        { id: 's9', name: '케이블 레터럴 레이즈', slug: 'cable-lateral-raise', description: "지속적인 장력", defaultTime: 0 },
    ],
    arms: [
        { id: '7001', name: '바벨 바이셉 컬', slug: 'barbell-bicep-curl', mp4_url: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/7001.mp4", description: "이두근 매스", defaultTime: 0 },
        { id: '6002', name: '케이블 트라이셉 푸쉬다운', slug: 'cable-tricep-pushdown', mp4_url: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/6002.mp4", description: "삼두근 외측두", defaultTime: 0 },
        { id: '8001', name: '덤벨 리스트 컬', slug: 'dumbbell-wrist-curl', mp4_url: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/8001.mp4", description: "전완근 굴곡근", defaultTime: 0 },
        { id: 'a1', name: '덤벨 바이셉 컬', slug: 'dumbbell-bicep-curl', description: "이두근 고립", defaultTime: 0 },
        { id: 'a2', name: '덤벨 해머 컬', slug: 'dumbbell-hammer-curl', description: "상완근 및 이두 바깥쪽", defaultTime: 0 },
        { id: 'a3', name: '라잉 트라이셉 익스텐션', slug: 'lying-barbell-tricep-extension', description: "삼두 장두 발달", defaultTime: 0 },
        { id: 'a4', name: '덤벨 킥백', slug: 'one-arm-dumbbell-kickback', description: "삼두 수축감", defaultTime: 0 },
        { id: 'a5', name: '벤치 딥스', slug: 'bench-dips', description: "맨몸 삼두 운동", defaultTime: 0 },
        { id: 'a6', name: '프리쳐 컬', slug: 'preacher-curl', description: "이두근 단두 타겟", defaultTime: 0 },
        { id: 'a7', name: '케이블 로프 익스텐션', slug: 'cable-rope-tricep-extension', description: "삼두근 짜주기", defaultTime: 0 },
        { id: 'a8', name: '리버스 바벨 리스트 컬', slug: 'reverse-barbell-wrist-curl', description: "전완근 신전근", defaultTime: 0 },
    ],
    core: [
        { id: '5001', name: '레그 레이즈', slug: 'leg-raise', mp4_url: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/5001.mp4", description: "하복부 강화", defaultTime: 0 },
        { id: 'co1', name: '플랭크', slug: 'plank', description: "코어 안정성", defaultTime: 60 },
        { id: 'co2', name: '크런치', slug: 'crunch', description: "상복부 고립", defaultTime: 0 },
        { id: 'co3', name: '행잉 레그 레이즈', slug: 'hanging-leg-raise', description: "고강도 하복부", defaultTime: 0 },
        { id: 'co4', name: '바이시클 크런치', slug: 'bicycle-crunch', description: "복사근 및 복직근", defaultTime: 0 },
        { id: 'co5', name: 'AB 슬라이드', slug: 'ab-wheel', description: "전신 코어", defaultTime: 0 },
        { id: 'co6', name: '러시안 트위스트', slug: 'russian-twist', description: "옆구리/회전근", defaultTime: 0 },
        { id: 'co7', name: '사이드 플랭크', slug: 'side-plank', description: "측면 코어 버티기", defaultTime: 45 },
        { id: 'co8', name: '브이 업', slug: 'v-up', description: "상하복부 동시 수축", defaultTime: 0 },
    ],
    cardio: [
        { id: 'ca1', name: '달리기', slug: 'running', description: "전신 유산소", defaultTime: 600 },
        { id: 'ca2', name: '사이클링', slug: 'cycling', description: "하체 근지구력", defaultTime: 900 },
        { id: 'ca3', name: '수영', slug: 'swimming', description: "전신 운동", defaultTime: 1200 },
        { id: 'ca4', name: '복싱', slug: 'boxing', description: "순발력 및 유산소", defaultTime: 600 },
        { id: 'ca5', name: '축구', slug: 'soccer', description: "팀 스포츠", defaultTime: 1800 },
        { id: 'ca6', name: '테니스', slug: 'tennis', description: "라켓 스포츠", defaultTime: 1800 },
        { id: 'ca7', name: '클라이밍', slug: 'climbing', description: "전신 근력/유연성", defaultTime: 1800 },
        { id: 'ca8', name: '줄넘기', slug: 'jump-rope', description: "칼로리 버닝", defaultTime: 300 },
    ]
};

const MOCK_USERS_ONLINE = [
    { id: 1, name: '김헬스', avatar: 'bg-blue-600' },
    { id: 2, name: '이근육', avatar: 'bg-red-600' },
    { id: 3, name: '박득근', avatar: 'bg-green-600' },
    { id: 4, name: '최요가', avatar: 'bg-yellow-600' },
    { id: 5, name: '정필라', avatar: 'bg-purple-600' },
];

const WEEKLY_ACTIVITY = [
    { day: 'M', active: true },
    { day: 'T', active: true },
    { day: 'W', active: false },
    { day: 'T', active: true },
    { day: 'F', active: false },
    { day: 'S', active: false },
    { day: 'S', active: false },
];

const TIERS = ['Grand Master', 'Master', 'Diamond', 'Platinum', 'Gold', 'Silver', 'Bronze'];

const RANKING_DATA = [];
TIERS.forEach((tier, tIdx) => {
    const baseScore = 20000 - (tIdx * 2500);
    for (let i = 0; i < 15; i++) {
        RANKING_DATA.push({
            id: `${tier}-${i}`,
            name: `${tier} User ${i + 1}`,
            score: baseScore - (i * Math.floor(Math.random() * 150)),
            avatar: `bg-${['red', 'blue', 'green', 'yellow', 'purple', 'pink', 'indigo', 'orange'][Math.floor(Math.random() * 8)]}-500`,
            tier: tier,
            rank: i + 1
        });
    }
});
RANKING_DATA[0].name = "이근육";
RANKING_DATA[1].name = "박득근";
RANKING_DATA[2].name = "최요가";
RANKING_DATA[15].name = "김헬스";

// --- Utility Functions ---

const calculate1RM = (weight, reps) => {
    if (reps === 1) return weight;
    return Math.round(weight * (1 + reps / 30));
};

const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

// --- Components ---

const Avatar = ({ color, size = 'md' }) => {
    const sizeClass = size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-16 h-16' : 'w-10 h-10';
    const fontSize = size === 'lg' ? 'text-xl' : 'text-sm';
    return (
        <div className={`${sizeClass} rounded-full ${color || 'bg-gray-700'} flex items-center justify-center text-white font-bold border-2 border-neutral-800 shadow-sm ${fontSize}`}>
            <User size={size === 'sm' ? 14 : size === 'lg' ? 24 : 20} />
        </div>
    );
};

const Card = ({ children, className = '' }) => (
    <div className={`bg-neutral-900 rounded-2xl shadow-lg border border-neutral-800 overflow-hidden ${className}`}>
        {children}
    </div>
);

const Button = ({ children, onClick, variant = 'primary', className = '', size = 'md', disabled = false }) => {
    const baseStyle = "font-medium rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2";
    const variants = {
        primary: "bg-yellow-400 text-black hover:bg-yellow-300 shadow-lg shadow-yellow-400/20",
        secondary: "bg-neutral-800 text-white hover:bg-neutral-700 border border-neutral-700",
        danger: "bg-red-900/50 text-red-400 hover:bg-red-900/70 border border-red-900",
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
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed active:scale-100' : ''} ${className}`}
        >
            {children}
        </button>
    );
};

// --- View: Login & Signup ---

const LoginView = ({ onLogin }) => {
    const [isSignup, setIsSignup] = useState(false);
    const [email, setEmail] = useState('wangmok@test.com');
    const [password, setPassword] = useState('wangmok12#');
    const [loading, setLoading] = useState(false);

    const handleAuth = async (type) => {
        setLoading(true);
        try {
            await signInAnonymously(auth);

            const user = auth.currentUser;
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

            await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'info'), {
                uid: user.uid,
                name: displayName,
                email: type === 'email' ? email : `${providerId}@example.com`,
                provider: providerId,
                createdAt: new Date().toISOString()
            }, { merge: true });

            const statsRef = doc(db, 'artifacts', appId, 'users', user.uid, 'data', 'stats');
            const statsSnap = await getDoc(statsRef);
            if (!statsSnap.exists()) {
                await setDoc(statsRef, {
                    totalVolume: 0,
                    weeklyVolume: 0,
                    weeklyActivity: Array(7).fill(false),
                    workoutsCompleted: 0
                });
            }

        } catch (error) {
            console.error("Auth error:", error);
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
                        disabled={loading}
                    >
                        {loading ? '로그인 중...' : (isSignup ? '회원가입' : '로그인')}
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
};

// --- Sub-Components (Moved out of App to prevent re-creation) ---

const Header = () => (
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

const BottomNav = ({ activeTab, setActiveTab, workoutStatus, startWorkout, setModalOpen, routine }) => (
    <nav className="fixed bottom-0 w-full max-w-md left-0 right-0 mx-auto bg-neutral-900/95 backdrop-blur border-t border-neutral-800 flex justify-around py-3 px-2 z-20 pb-safe">
        {[
            { id: 'home', icon: Home, label: '홈' },
            { id: 'feed', icon: Activity, label: '피드' },
            { id: 'runner', icon: Play, label: '운동', isMain: true },
            { id: 'ranking', icon: Trophy, label: '랭킹' },
            { id: 'mypage', icon: User, label: 'MY' },
        ].map((item) => (
            <button
                key={item.id}
                onClick={() => {
                    if (item.id === 'runner') {
                        if (workoutStatus !== 'idle') setActiveTab('runner');
                        else if (routine.length > 0) startWorkout();
                        else setModalOpen('builder');
                    } else {
                        setActiveTab(item.id);
                    }
                }}
                className={`flex flex-col items-center gap-1 ${item.isMain ? '-mt-8' : ''}`}
            >
                {item.isMain ? (
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all border-4 border-neutral-950 ${workoutStatus !== 'idle' ? 'bg-yellow-400 animate-pulse' : 'bg-yellow-400'
                        }`}>
                        {/* Icon in main button is black for contrast with yellow */}
                        {workoutStatus === 'idle' ? <Play className="text-black ml-1 fill-black" /> : <Activity className="text-black" />}
                    </div>
                ) : (
                    <div className={`p-1 rounded-xl transition-colors ${activeTab === item.id ? 'text-yellow-400' : 'text-neutral-500'}`}>
                        <item.icon size={24} strokeWidth={activeTab === item.id ? 2.5 : 2} />
                    </div>
                )}
                {!item.isMain && <span className={`text-[10px] ${activeTab === item.id ? 'text-yellow-400 font-bold' : 'text-neutral-600'}`}>{item.label}</span>}
            </button>
        ))}
    </nav>
);

const ExerciseGuideModal = React.memo(({ exercise, onClose }) => {
    if (!exercise) return null;
    return (
        <div className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200 backdrop-blur-sm">
            <div className="bg-neutral-900 w-full max-w-sm rounded-2xl overflow-hidden relative shadow-2xl animate-in zoom-in-95 duration-200 border border-neutral-800">
                <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white backdrop-blur-md z-10 transition-colors">
                    <X size={20} />
                </button>

                {/* Media Area (Video or GIF Placeholder) */}
                <div className="aspect-[4/3] bg-neutral-800 flex items-center justify-center relative overflow-hidden group">
                    {exercise.mp4_url ? (
                        <video
                            src={exercise.mp4_url}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="relative w-full h-full flex items-center justify-center">
                            <Dumbbell className="text-yellow-400 w-32 h-32 animate-bounce" strokeWidth={1} />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-20 h-2 bg-yellow-400/20 rounded-full mt-24 blur-sm animate-pulse"></div>
                            </div>
                            <div className="absolute bottom-3 right-3 bg-black/70 text-yellow-400 text-[10px] px-2 py-1 rounded backdrop-blur-md font-bold border border-yellow-400/20">
                                GIF
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6">
                    <h3 className="text-2xl font-black italic text-white mb-1 uppercase">{exercise.name}</h3>
                    <p className="text-yellow-400 font-medium text-sm mb-4">{exercise.description}</p>

                    <div className="space-y-4">
                        <div className="bg-neutral-800 p-4 rounded-xl border border-neutral-700">
                            <h4 className="font-bold text-gray-200 text-sm mb-2 flex items-center gap-2">
                                <CheckCircle2 size={16} className="text-emerald-500" />
                                운동 방법
                            </h4>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                {exercise.guide || "허리를 곧게 펴고 정확한 자세로 동작을 수행하세요. 부상 방지를 위해 무리한 중량은 피해주세요."}
                            </p>
                        </div>

                        <div className="flex gap-2">
                            <div className="flex-1 bg-neutral-800 border border-neutral-700 p-3 rounded-lg text-center">
                                <p className="text-[10px] text-gray-500 font-bold mb-1 uppercase">Target</p>
                                <p className="text-sm font-bold text-orange-400">주동근</p>
                            </div>
                            <div className="flex-1 bg-neutral-800 border border-neutral-700 p-3 rounded-lg text-center">
                                <p className="text-[10px] text-gray-500 font-bold mb-1 uppercase">Level</p>
                                <p className="text-sm font-bold text-blue-400">초급</p>
                            </div>
                        </div>
                    </div>

                    <Button onClick={onClose} variant="secondary" className="w-full mt-6">
                        닫기
                    </Button>
                </div>
            </div>
        </div>
    );
});

const QuestSelectionModal = ({ onClose, onSelect, quests }) => (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className="bg-neutral-900 w-full max-w-sm rounded-2xl p-0 border border-neutral-800 shadow-2xl overflow-hidden max-h-[80vh] flex flex-col">
            <div className="p-5 border-b border-neutral-800 flex justify-between items-center bg-neutral-900 sticky top-0 z-10">
                <h3 className="text-xl font-bold text-white">오늘의 퀘스트 선택</h3>
                <button onClick={onClose}><X className="text-gray-400 hover:text-white" /></button>
            </div>
            <div className="overflow-y-auto p-4 space-y-3">
                {quests.map((quest) => (
                    <button
                        key={quest.id}
                        onClick={() => onSelect(quest)}
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-4 flex items-center gap-4 hover:border-yellow-400 hover:bg-neutral-700 transition-all group text-left"
                    >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${quest.color}-900/50 text-${quest.color}-400 group-hover:scale-110 transition-transform`}>
                            <quest.icon size={20} />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-white text-sm">{quest.title}</h4>
                            <p className="text-xs text-gray-400 mt-0.5">{quest.desc}</p>
                        </div>
                        <div className="text-xs font-bold text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded">+{quest.exp} EXP</div>
                    </button>
                ))}
            </div>
        </div>
    </div>
);


const WorkoutBuilder = ({ routine, setRoutine, setModalOpen, user }) => {
    const [selectedCategory, setSelectedCategory] = useState('back'); // Default to back
    const [tempRoutine, setTempRoutine] = useState(routine);
    const [draggedIdx, setDraggedIdx] = useState(null);

    const addExercise = (ex) => {
        setTempRoutine([...tempRoutine, { ...ex, sets: 3, restTime: 60 }]);
    };

    const removeExercise = (index) => {
        const newR = [...tempRoutine];
        newR.splice(index, 1);
        setTempRoutine(newR);
    };

    const handleDragStart = (e, index) => {
        setDraggedIdx(index);
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", index);
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
    };

    const handleDrop = (e, dropIndex) => {
        e.preventDefault();
        if (draggedIdx === null) return;
        if (draggedIdx === dropIndex) return;

        const newRoutine = [...tempRoutine];
        const [draggedItem] = newRoutine.splice(draggedIdx, 1);
        newRoutine.splice(dropIndex, 0, draggedItem);

        setTempRoutine(newRoutine);
        setDraggedIdx(null);
    };

    const handleSave = async () => {
        setRoutine(tempRoutine);
        setModalOpen(null);
        // Persist Routine to Firestore
        if (user) {
            try {
                await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'data', 'currentRoutine'), {
                    routine: tempRoutine
                });
            } catch (e) {
                console.error("Routine save failed", e);
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="bg-neutral-900 w-full max-w-md h-[90vh] sm:h-[800px] rounded-t-2xl sm:rounded-2xl flex flex-col overflow-hidden border border-neutral-800">
                <div className="p-4 border-b border-neutral-800 flex justify-between items-center">
                    <h2 className="font-bold text-lg text-white">운동 일정 만들기</h2>
                    <button onClick={() => setModalOpen(null)}><X className="text-gray-400 hover:text-white" /></button>
                </div>

                <div className="flex-1 overflow-y-auto bg-neutral-950">
                    {/* Selected List */}
                    {tempRoutine.length > 0 && (
                        <div className="bg-neutral-900 p-4 mb-2 shadow-sm border-b border-neutral-800">
                            <h3 className="text-xs font-bold text-yellow-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                                <CheckCircle2 size={12} /> 선택된 운동 ({tempRoutine.length})
                            </h3>
                            <div className="space-y-2">
                                {tempRoutine.map((item, idx) => (
                                    <div
                                        key={idx}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, idx)}
                                        onDragOver={(e) => handleDragOver(e, idx)}
                                        onDrop={(e) => handleDrop(e, idx)}
                                        className={`flex justify-between items-center bg-neutral-800 p-3 rounded-lg border border-neutral-700 transition-all ${draggedIdx === idx ? 'opacity-50 scale-95 border-yellow-400/50' : ''} cursor-move`}
                                    >
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className="text-gray-500 cursor-grab active:cursor-grabbing">
                                                <GripVertical size={16} />
                                            </div>
                                            <span className="font-medium text-gray-200">{item.name}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-1 text-sm text-yellow-400">
                                                <input className="w-8 bg-neutral-900 text-center rounded border border-neutral-700 h-6 text-white" defaultValue={item.sets} />
                                                <span className="text-gray-500">set</span>
                                            </div>
                                            <button onClick={() => removeExercise(idx)} className="text-gray-500 hover:text-red-500"><X size={16} /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Selector */}
                    <div className="p-4">
                        <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-bold transition-colors border ${selectedCategory === cat.id ? 'bg-yellow-400 text-black border-yellow-400' : 'bg-transparent text-gray-400 border-neutral-700 hover:border-gray-500'
                                        }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>

                        <div className="grid gap-3">
                            {EXERCISES[selectedCategory] && EXERCISES[selectedCategory].map((ex) => (
                                <button key={ex.id} onClick={() => addExercise(ex)} className="bg-neutral-900 p-4 rounded-xl border border-neutral-800 text-left hover:border-yellow-400/50 transition-all active:scale-[0.98] shadow-sm flex justify-between items-center group relative">
                                    <div className="flex-1">
                                        <p className="font-bold text-white group-hover:text-yellow-400 transition-colors">{ex.name}</p>
                                        <p className="text-xs text-gray-500 mt-1">{ex.description}</p>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {/* Add visual info button but for builder we just add */}
                                        <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center group-hover:bg-yellow-400 transition-colors">
                                            <Plus size={18} className="text-gray-400 group-hover:text-black" />
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-neutral-800 bg-neutral-900">
                    <Button onClick={handleSave} size="lg" variant="primary" className="font-bold">
                        저장하기
                    </Button>
                </div>
            </div>
        </div>
    );
};

const FeedCreateModal = ({ setCompletedWorkouts, setModalOpen, setActiveTab, completedWorkouts, workoutSummary, routine, user }) => {
    const [text, setText] = useState('');

    const handleSkip = () => {
        setModalOpen(null);
        setActiveTab('home');
    };

    // Firestore integration for creating feeds
    const handleSubmit = async () => {
        const auth = getAuth();
        const user = auth.currentUser;
        const db = getFirestore();
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

        // Get Volume from summary (Calculated before routine reset)
        const sessionVolume = workoutSummary?.volume || 0;

        try {
            const newFeed = {
                user: user.displayName || 'Anonymous',
                uid: user.uid,
                time: 'Just now',
                content: text,
                likes: 0,
                likedBy: [],
                images: [],
                stats: { volume: `${sessionVolume.toLocaleString()}kg`, time: workoutSummary?.time || 'Just now' },
                createdAt: serverTimestamp()
            };

            await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'feeds'), newFeed);

            // 2. Update User Stats
            const statsRef = doc(db, 'artifacts', appId, 'users', user.uid, 'data', 'stats');
            const today = new Date().getDay();
            const dayIndex = today === 0 ? 6 : today - 1;

            const statsSnap = await getDoc(statsRef);
            if (statsSnap.exists()) {
                const data = statsSnap.data();
                const newActivity = [...(data.weeklyActivity || Array(7).fill(false))];
                newActivity[dayIndex] = true;

                await updateDoc(statsRef, {
                    totalVolume: increment(sessionVolume),
                    weeklyVolume: increment(sessionVolume),
                    workoutsCompleted: increment(1),
                    weeklyActivity: newActivity
                });
            }

            // 3. Clear stored routine after successful workout
            await deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'data', 'currentRoutine'));

            setModalOpen(null);
            setActiveTab('feed');
        } catch (error) {
            console.error("Error creating feed:", error);
            alert("Failed to create feed");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="bg-neutral-900 w-full max-w-md rounded-t-2xl sm:rounded-2xl overflow-hidden p-5 border border-neutral-800">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">운동 완료! 🎉</h2>
                    <button onClick={handleSkip}><X className="text-white" /></button>
                </div>

                <div className="mb-4">
                    <textarea
                        className="w-full bg-neutral-800 rounded-xl p-4 text-white resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-gray-500"
                        rows={4}
                        placeholder="오늘 운동은 어땠나요? 기록을 남겨보세요."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 mb-6">
                    <button className="w-20 h-20 rounded-xl border-2 border-dashed border-neutral-700 flex flex-col items-center justify-center text-gray-500 hover:border-yellow-400 hover:text-yellow-400 transition-colors">
                        <ImageIcon size={24} />
                        <span className="text-[10px] mt-1">사진 추가</span>
                    </button>
                </div>

                <div className="flex gap-2">
                    <Button onClick={handleSkip} variant="ghost" className="flex-1 text-gray-400 hover:text-white">
                        건너뛰기
                    </Button>
                    <Button onClick={handleSubmit} size="lg" variant="primary" className="flex-[2] font-bold">
                        피드에 공유하기
                    </Button>
                </div>
            </div>
        </div>
    );
};

const LogoutModal = ({ setModalOpen, processLogout }) => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className="bg-neutral-900 w-full max-w-sm rounded-2xl p-6 border border-neutral-800 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-2">로그아웃</h3>
            <p className="text-gray-400 mb-6 text-sm">정말 로그아웃 하시겠습니까? 기록 중인 운동 데이터가 초기화될 수 있습니다.</p>
            <div className="flex gap-3">
                <Button onClick={() => setModalOpen(null)} variant="secondary" className="flex-1">취소</Button>
                <Button onClick={processLogout} variant="danger" className="flex-1">로그아웃</Button>
            </div>
        </div>
    </div>
);

const QuitWorkoutModal = ({ setModalOpen, confirmQuit }) => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className="bg-neutral-900 w-full max-w-sm rounded-2xl p-6 border border-neutral-800 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-2">운동 종료</h3>
            <p className="text-gray-400 mb-6 text-sm">진행 중인 운동이 저장되지 않을 수 있습니다. 정말 종료하시겠습니까?</p>
            <div className="flex gap-3">
                <Button onClick={() => setModalOpen(null)} variant="secondary" className="flex-1">취소</Button>
                <Button onClick={confirmQuit} variant="danger" className="flex-1">종료</Button>
            </div>
        </div>
    </div>
);

const Toast = ({ message }) => (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-white/90 text-black px-5 py-3 rounded-full shadow-2xl z-[70] animate-in fade-in slide-in-from-top-5 duration-300 flex items-center gap-3 backdrop-blur-md border border-gray-200">
        <div className="bg-green-100 p-1 rounded-full">
            <CheckCircle2 size={16} className="text-green-600" />
        </div>
        <span className="text-sm font-bold tracking-tight">{message}</span>
    </div>
);

const MoreActionSheet = ({ onClose }) => (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-end animate-in fade-in duration-200" onClick={onClose}>
        <div className="w-full bg-neutral-900 rounded-t-2xl p-4 space-y-2 animate-in slide-in-from-bottom duration-300 border-t border-neutral-800" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-1 bg-neutral-800 rounded-full mx-auto mb-4"></div>
            <button className="w-full bg-neutral-800 p-4 rounded-xl text-red-400 font-bold hover:bg-neutral-700 flex items-center gap-3 transition-colors">
                <AlertTriangle size={20} /> 신고하기
            </button>
            <button className="w-full bg-neutral-800 p-4 rounded-xl text-white font-bold hover:bg-neutral-700 flex items-center gap-3 transition-colors">
                <EyeOff size={20} /> 이 게시물 숨기기
            </button>
            <button className="w-full bg-neutral-800 p-4 rounded-xl text-white font-bold hover:bg-neutral-700 flex items-center gap-3 transition-colors">
                <UserMinus size={20} /> 팔로우 취소
            </button>
            <button className="w-full bg-neutral-950 border border-neutral-800 p-4 rounded-xl text-gray-500 font-bold mt-2 hover:bg-neutral-900 transition-colors" onClick={onClose}>
                취소
            </button>
        </div>
    </div>
);

// --- Main Application Component ---

export default function App() {
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('home');
    const [modalOpen, setModalOpen] = useState(null);
    const [viewingExercise, setViewingExercise] = useState(null);
    const [routine, setRoutine] = useState([]);
    const [activeWorkout, setActiveWorkout] = useState(null);
    const [workoutSummary, setWorkoutSummary] = useState(null);

    // Stats
    const [userStats, setUserStats] = useState({
        totalVolume: 0,
        weeklyVolume: 0,
        workoutsCompleted: 0,
        weeklyActivity: Array(7).fill(false)
    });

    // Quest States
    const [activeQuest, setActiveQuest] = useState(null);
    const [isQuestCompleted, setIsQuestCompleted] = useState(false);

    const [workoutStatus, setWorkoutStatus] = useState('idle');
    const [isPaused, setIsPaused] = useState(false);
    const [currentExerciseIdx, setCurrentExerciseIdx] = useState(0);
    const [currentSetIdx, setCurrentSetIdx] = useState(0);
    const [timer, setTimer] = useState(0);
    const [totalTime, setTotalTime] = useState(60);
    const [completedWorkouts, setCompletedWorkouts] = useState([]);
    const [activeRankTier, setActiveRankTier] = useState('Grand Master');
    const [currentWeight, setCurrentWeight] = useState('');
    const [currentReps, setCurrentReps] = useState('');

    // New States for Interactions
    const [toastMessage, setToastMessage] = useState(null);
    const [activeMenuPostId, setActiveMenuPostId] = useState(null);

    const timerRef = useRef(null);

    // --- Helpers ---
    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 2000);
    };

    const getLevel = (volume) => {
        if (!volume) return 1;
        return Math.floor(volume / 50000) + 1; // 50t volume = 1 level
    };

    // --- Auth Listener ---
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    // --- Initialize Auth if token present ---
    useEffect(() => {
        const initAuth = async () => {
            if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
                await signInWithCustomToken(auth, __initial_auth_token);
            }
        };
        initAuth();
    }, []);

    // --- Firestore Stats Subscription ---
    useEffect(() => {
        if (!user) return;
        const statsRef = doc(db, 'artifacts', appId, 'users', user.uid, 'data', 'stats');
        const unsubscribe = onSnapshot(statsRef, (doc) => {
            if (doc.exists()) {
                setUserStats(doc.data());
            }
        });
        return () => unsubscribe();
    }, [user]);

    // --- Firestore Routine Subscription (Load Routine) ---
    useEffect(() => {
        if (!user) return;
        const routineRef = doc(db, 'artifacts', appId, 'users', user.uid, 'data', 'currentRoutine');
        const unsubscribe = onSnapshot(routineRef, (doc) => {
            if (doc.exists()) {
                setRoutine(doc.data().routine || []);
            } else {
                setRoutine([]);
            }
        });
        return () => unsubscribe();
    }, [user]);

    // --- Firestore Feed Subscription ---
    useEffect(() => {
        if (!user) return;

        // Subscribe to public feeds
        const feedsRef = collection(db, 'artifacts', appId, 'public', 'data', 'feeds');
        const q = query(feedsRef, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const posts = snapshot.docs.map(doc => {
                const data = doc.data();
                const isLiked = data.likedBy && data.likedBy.includes(user.uid);
                return {
                    id: doc.id,
                    ...data,
                    isLiked
                };
            });
            setCompletedWorkouts(posts);
        }, (error) => {
            console.error("Feed fetch error:", error);
        });

        return () => unsubscribe();
    }, [user]);

    // --- Logic: Workout Runner ---

    useEffect(() => {
        if ((workoutStatus === 'running' || workoutStatus === 'resting') && !isPaused) {
            timerRef.current = setInterval(() => {
                setTimer((prev) => {
                    if (workoutStatus === 'resting') {
                        if (prev <= 1) {
                            handleTimerComplete();
                            return 0;
                        }
                        return prev - 1;
                    } else {
                        return prev + 1;
                    }
                });
            }, 1000);
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [workoutStatus, isPaused]);

    const handleTimerComplete = () => {
        if (workoutStatus === 'resting') {
            startNextSet();
        }
    };

    const startWorkout = () => {
        if (routine.length === 0) {
            setModalOpen('builder');
            return;
        }
        // Initialize logs array explicitly
        setActiveWorkout({ startTime: new Date(), logs: [] });
        setWorkoutStatus('ready');
        setCurrentExerciseIdx(0);
        setCurrentSetIdx(0);
        setIsPaused(false);
        setTimer(0);
        setTotalTime(60);
        setActiveTab('runner');

        // Set initial input values if available (optional) or leave blank for user input
        // If we want to default to something, we can set it here.
        // Let's reset them to empty to force initial input or placeholders
        setCurrentReps('');
        setCurrentWeight('');
    };

    const startSet = () => {
        setWorkoutStatus('running');
        setTimer(0);
        setTotalTime(60);
        setIsPaused(false);
    };

    const finishSet = () => {
        // Record Log
        const currentEx = routine[currentExerciseIdx];
        // Use stored state values. If empty, default to 0 to prevent NaN, but UI should encourage input.
        // Ideally, validation should be here (e.g., disable button if empty), but for now we fallback to 0.
        const recordedWeight = currentWeight === '' ? 0 : parseFloat(currentWeight);
        const recordedReps = currentReps === '' ? 0 : parseFloat(currentReps);

        const newLog = {
            exercise: currentEx.name,
            weight: recordedWeight,
            reps: recordedReps,
            set: currentSetIdx + 1
        };

        // Update active workout state
        const updatedLogs = [...(activeWorkout?.logs || []), newLog];
        setActiveWorkout(prev => ({ ...prev, logs: updatedLogs }));

        const isLastEx = currentExerciseIdx === routine.length - 1;
        const isLastSet = currentSetIdx === currentEx.sets - 1;

        if (isLastEx && isLastSet) {
            completeWorkout(updatedLogs); // Pass latest logs
        } else {
            const rest = currentEx.restTime || 60;
            setWorkoutStatus('resting');
            setTimer(rest);
            setTotalTime(rest);
            setIsPaused(false);
            // NOTE: We DO NOT reset currentWeight/currentReps here. 
            // This allows the user to keep the same weight/reps for the next set without re-typing.
        }
    };

    const startNextSet = () => {
        const currentEx = routine[currentExerciseIdx];
        if (currentSetIdx < currentEx.sets - 1) {
            setCurrentSetIdx(prev => prev + 1);
            setWorkoutStatus('running');
        } else {
            if (currentExerciseIdx < routine.length - 1) {
                setCurrentExerciseIdx(prev => prev + 1);
                setCurrentSetIdx(0);
                setWorkoutStatus('ready');
                // Optional: Reset inputs when exercise changes? 
                // Often users change weights between exercises, so clearing might be UX friendly, 
                // or keeping it is also fine. Let's clear for new exercise.
                setCurrentWeight('');
                setCurrentReps('');
            }
        }
        setTimer(0);
        setTotalTime(60);
        setIsPaused(false);
    };

    const completeWorkout = (finalLogs) => {
        const endTime = new Date();
        const startTime = activeWorkout?.startTime || new Date();
        const diff = endTime - startTime;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        let timeStr = '';
        if (hours > 0) timeStr += `${hours}시간 `;
        timeStr += `${minutes}분`;
        if (hours === 0 && minutes === 0) timeStr = "1분 미만";

        // Calculate Volume: Sum of max weight per exercise
        let totalScore = 0;
        const logsToCalculate = finalLogs || activeWorkout?.logs || [];

        // Group by exercise to find max weight used for each
        const exerciseMaxWeights = {};
        logsToCalculate.forEach(log => {
            const currentMax = exerciseMaxWeights[log.exercise] || 0;
            if (log.weight > currentMax) {
                exerciseMaxWeights[log.exercise] = log.weight;
            }
        });

        // Sum max weights
        totalScore = Object.values(exerciseMaxWeights).reduce((a, b) => a + b, 0);

        // Fallback if 0 (User didn't input anything)
        if (totalScore === 0 && routine.length > 0) {
            // Mock: Assume 20kg per exercise if nothing logged
            totalScore = routine.length * 20;
        }

        setWorkoutSummary({ time: timeStr, volume: totalScore });
        setWorkoutStatus('idle');
        setActiveWorkout(null);
        setRoutine([]);
        setModalOpen('feed-create');
    };

    const togglePause = () => {
        setIsPaused(!isPaused);
    };

    const handleLogout = () => {
        setModalOpen('logout-confirm');
    };

    const processLogout = async () => {
        await signOut(auth);
        setRoutine([]);
        setWorkoutStatus('idle');
        setTimer(0);
        setCurrentExerciseIdx(0);
        setCurrentSetIdx(0);
        setIsPaused(false);
        setModalOpen(null);
        setActiveTab('home');
        setActiveQuest(null);
        setIsQuestCompleted(false);
    };

    const confirmQuitWorkout = () => {
        setWorkoutStatus('idle');
        setActiveTab('home');
        setModalOpen(null);
        setTimer(0);
        setIsPaused(false);
        setActiveWorkout(null);
    };

    const handleLikeToggle = async (post) => {
        if (!user) return;
        const postRef = doc(db, 'artifacts', appId, 'public', 'data', 'feeds', post.id);
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

    const handleShare = (post) => {
        showToast('공유 링크가 클립보드에 복사되었습니다.');
    };

    const handleMoreClick = (postId) => {
        setActiveMenuPostId(postId);
    };

    const handleSelectQuest = (quest) => {
        setActiveQuest(quest);
        setIsQuestCompleted(false);
        setModalOpen(null);
        showToast('새로운 퀘스트가 시작되었습니다!');
    };

    const toggleQuestCompletion = () => {
        if (activeQuest) {
            const newState = !isQuestCompleted;
            setIsQuestCompleted(newState);
            if (newState) showToast(`퀘스트 완료! +${activeQuest.exp} EXP`);
        }
    };

    // --- Views ---

    const HomeView = () => (
        <div className="p-5 pb-24 space-y-6">
            <section>
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]"></span>
                        라이브 짐
                    </h2>
                    <span className="text-sm text-yellow-400 font-medium">52명 운동중</span>
                </div>
                <div className="flex -space-x-3 overflow-hidden py-2 pl-1">
                    {MOCK_USERS_ONLINE.map((u) => (
                        <Avatar key={u.id} color={u.avatar} />
                    ))}
                    <div className="w-10 h-10 rounded-full bg-neutral-800 border-2 border-neutral-900 flex items-center justify-center text-xs text-gray-400 font-medium">
                        +47
                    </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">친구 3명이 지금 하체를 조지고 있어요!</p>
            </section>

            <section>
                <div className="flex justify-between items-end mb-3">
                    <h2 className="text-lg font-bold text-white">이번 주 버닝 🔥</h2>
                    <span className="text-xs text-yellow-400 font-bold bg-yellow-400/10 px-2 py-1 rounded">3일 연속 달성 중!</span>
                </div>
                <Card className="p-4 bg-neutral-900 border-neutral-800 flex justify-between items-center">
                    {userStats.weeklyActivity && ['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-2 group">
                            <div className={`w-3 h-12 rounded-full transition-all duration-300 ${userStats.weeklyActivity[idx] ? 'bg-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.6)]' : 'bg-neutral-800 border border-neutral-700'}`}></div>
                            <span className={`text-[10px] font-bold ${userStats.weeklyActivity[idx] ? 'text-white' : 'text-neutral-600'}`}>{day}</span>
                        </div>
                    ))}
                </Card>
            </section>

            <section>
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-lg font-bold text-white">오늘의 운동 일정</h2>
                    {routine.length > 0 && (
                        <button onClick={() => setModalOpen('builder')} className="text-sm text-gray-400 underline decoration-gray-600 hover:text-white">수정</button>
                    )}
                </div>
                {routine.length === 0 ? (
                    <Card className="p-8 flex flex-col items-center justify-center text-center gap-4 border-2 border-dashed border-neutral-800 bg-neutral-900/50">
                        <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center">
                            <Calendar className="text-gray-600" />
                        </div>
                        <div>
                            <p className="font-bold text-gray-300">등록된 일정이 없어요</p>
                            <p className="text-sm text-gray-500 mt-1">오늘의 목표를 설정하고 시작해보세요!</p>
                        </div>
                        <Button onClick={() => setModalOpen('builder')} size="sm">운동 일정 만들기</Button>
                    </Card>
                ) : (
                    <Card className="bg-gradient-to-br from-neutral-800 to-neutral-900 border border-yellow-400/30 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 opacity-5 transform translate-x-10 -translate-y-10 group-hover:opacity-10 transition-opacity">
                            <Dumbbell size={150} className="text-yellow-400" />
                        </div>
                        <div className="p-5 relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-2xl font-black text-white italic tracking-tight">TODAY'S PLAN</h3>
                                    <p className="text-yellow-400/80 font-medium text-sm">{routine.length}개의 운동 • 약 {routine.length * 15}분 소요</p>
                                </div>
                                <div className="bg-yellow-400/20 p-2 rounded-lg backdrop-blur-sm">
                                    <Flame className="text-yellow-400 fill-yellow-400" />
                                </div>
                            </div>
                            <div className="space-y-2 mb-6">
                                {routine.slice(0, 3).map((ex, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setViewingExercise(ex)}
                                        className="w-full flex items-center gap-3 text-sm text-gray-300 bg-neutral-950/30 p-3 rounded-lg hover:bg-neutral-800 transition-colors text-left border border-transparent hover:border-yellow-400/30"
                                    >
                                        <span className="w-5 h-5 rounded bg-yellow-400 text-black font-bold flex items-center justify-center text-xs">{idx + 1}</span>
                                        <span className="font-medium flex-1 text-white">{ex.name}</span>
                                        <span className="text-xs text-gray-500">{ex.sets}세트</span>
                                    </button>
                                ))}
                                {routine.length > 3 && <p className="text-xs text-center text-gray-600">+{routine.length - 3} more</p>}
                            </div>
                            <Button onClick={startWorkout} variant="primary" className="w-full font-bold text-lg">
                                운동 시작하기 <Play fill="black" size={18} />
                            </Button>
                        </div>
                    </Card>
                )}
            </section>

            <section>
                <h2 className="text-lg font-bold text-white mb-3">일일 퀘스트</h2>
                {activeQuest ? (
                    <Card className={`p-0 bg-neutral-900 border-neutral-800 relative overflow-hidden transition-all duration-500 ${isQuestCompleted ? 'border-blue-500/50' : ''}`}>
                        <div className="absolute bottom-0 left-0 h-1 bg-neutral-800 w-full">
                            <div className={`h-full bg-blue-500 transition-all duration-500 ${isQuestCompleted ? 'w-full' : 'w-1/3'}`}></div>
                        </div>
                        <div className="p-4 flex items-center justify-between z-10 relative">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${isQuestCompleted ? 'bg-blue-500 text-white' : 'bg-neutral-800 border border-neutral-700 text-blue-400'}`}>
                                    <activeQuest.icon size={24} fill={isQuestCompleted ? "currentColor" : "none"} />
                                </div>
                                <div className="flex-1">
                                    <p className={`font-bold text-sm ${isQuestCompleted ? 'text-blue-400 line-through' : 'text-gray-200'}`}>{activeQuest.title}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{isQuestCompleted ? `퀘스트 완료! 경험치 +${activeQuest.exp}` : activeQuest.desc}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setModalOpen('quest-selection')}
                                    className="text-xs text-gray-500 underline mr-2 hover:text-white"
                                >변경</button>
                                <button
                                    onClick={toggleQuestCompletion}
                                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all group ${isQuestCompleted ? 'bg-blue-500 border-blue-500' : 'border-neutral-600 hover:border-blue-400'}`}
                                >
                                    <Check size={16} className={`transition-all ${isQuestCompleted ? 'text-white scale-100' : 'text-transparent scale-50'}`} strokeWidth={4} />
                                </button>
                            </div>
                        </div>
                    </Card>
                ) : (
                    <Card className="p-6 bg-neutral-900 border-dashed border-2 border-neutral-800 flex flex-col items-center justify-center gap-2">
                        <p className="text-gray-400 text-sm">진행 중인 퀘스트가 없습니다.</p>
                        <Button onClick={() => setModalOpen('quest-selection')} size="sm" variant="secondary">오늘의 퀘스트 선택하기</Button>
                    </Card>
                )}
            </section>

            <section className="grid grid-cols-2 gap-4">
                <Card className="p-4 bg-neutral-900 border-neutral-800">
                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">Weekly Volume</p>
                    <p className="text-2xl font-black text-white">{userStats.weeklyVolume?.toLocaleString() || 0} <span className="text-xs font-medium text-gray-500">kg</span></p>
                    <div className="mt-3 h-1 bg-neutral-800 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-400 w-[75%] shadow-[0_0_10px_rgba(250,204,21,0.5)]"></div>
                    </div>
                </Card>
                <Card className="p-4 bg-neutral-900 border-neutral-800">
                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">Growth</p>
                    <p className="text-2xl font-black text-yellow-400">+12%</p>
                    <p className="text-xs text-gray-500 flex items-center mt-1">
                        vs 지난주
                    </p>
                </Card>
            </section>
        </div>
    );

    const FeedView = () => (
        <div className="pb-24">
            <div className="px-5 py-3 border-b border-neutral-800 flex justify-between items-center sticky top-0 bg-neutral-900/90 backdrop-blur z-10">
                <h2 className="font-bold text-lg text-white">피드</h2>
                <div className="flex gap-4 text-sm font-medium">
                    <span className="text-yellow-400 border-b-2 border-yellow-400 pb-1">추천</span>
                    <span className="text-gray-500 pb-1">팔로잉</span>
                </div>
            </div>
            <div className="space-y-3 bg-neutral-950 pt-3">
                {completedWorkouts.map((post) => (
                    <div key={post.id} className="bg-neutral-900 p-5 border-y border-neutral-800">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <Avatar size="sm" />
                                <div>
                                    <p className="font-bold text-sm text-white">{post.user}</p>
                                    <p className="text-xs text-gray-500">{post.time}</p>
                                </div>
                            </div>
                            <Button onClick={() => handleMoreClick(post.id)} variant="ghost" size="sm" className="px-0 text-gray-500"><MoreHorizontal size={20} /></Button>
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
                                🏋️ {post.stats.volume}
                            </div>
                            <div className="bg-neutral-800 text-gray-300 border border-neutral-700 px-3 py-1.5 rounded text-xs font-bold tracking-wide">
                                ⏱️ {post.stats.time}
                            </div>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-neutral-800">
                            <div className="flex gap-4">
                                <button
                                    onClick={() => handleLikeToggle(post)}
                                    className={`flex items-center gap-1.5 transition-colors ${post.isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                                >
                                    <Heart size={20} fill={post.isLiked ? "currentColor" : "none"} />
                                    <span className="text-sm font-medium">{post.likes}</span>
                                </button>
                            </div>
                            <button onClick={() => handleShare(post)} className="text-gray-400 hover:text-white"><Share2 size={20} /></button>
                        </div>
                    </div>
                ))}
                {completedWorkouts.length === 0 && (
                    <div className="text-center py-20 text-gray-500">
                        아직 게시물이 없습니다. 첫 번째 게시물을 작성해보세요!
                    </div>
                )}
            </div>
        </div>
    );

    const RunnerView = () => {
        if (!activeWorkout) return <div className="p-10 text-center text-gray-500">운동 중이 아닙니다.</div>;
        const currentEx = routine[currentExerciseIdx];
        const isReady = workoutStatus === 'ready';
        const isRestingState = workoutStatus === 'resting';
        const bgColor = isRestingState ? 'bg-emerald-950' : isReady ? 'bg-neutral-900' : 'bg-neutral-950';
        const pulseColor = isRestingState ? 'bg-emerald-500' : 'bg-yellow-500';
        const radius = 120;
        const circumference = 2 * Math.PI * radius;
        let progress = 0;
        if (isRestingState) {
            progress = totalTime > 0 ? (timer / totalTime) : 0;
        } else {
            progress = (timer % 60) / 60;
        }
        const strokeDashoffset = circumference * (1 - progress);

        return (
            <div className={`h-[calc(100vh-80px)] flex flex-col ${bgColor} text-white relative overflow-hidden transition-colors duration-700`}>
                <div className="flex gap-1 p-2 pt-safe z-20">
                    {routine.map((_, idx) => (
                        <div key={idx} className={`h-1 flex-1 rounded-full ${idx < currentExerciseIdx ? 'bg-yellow-400' : idx === currentExerciseIdx ? 'bg-white' : 'bg-neutral-800'}`} />
                    ))}
                </div>
                <div className="px-6 py-4 flex justify-between items-start z-10">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-black px-2 py-0.5 rounded uppercase tracking-wider ${isRestingState ? 'bg-emerald-900 text-emerald-400' : 'bg-yellow-900/50 text-yellow-400'}`}>
                                {isRestingState ? "RESTING" : isReady ? "GET READY" : "ACTIVE"}
                            </span>
                            <p className="text-gray-400 text-sm font-medium">Set {currentSetIdx + 1} / {currentEx.sets}</p>
                        </div>
                        <h1 className="text-3xl font-black italic tracking-tighter">{currentEx.name}</h1>
                    </div>
                    <button onClick={() => setModalOpen('quit-confirm')} className="p-2 bg-neutral-800 rounded-full text-gray-400 hover:text-white hover:bg-neutral-700 transition-colors">
                        <X size={20} />
                    </button>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center relative">
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-[100px] opacity-20 transition-all duration-700 ${pulseColor} ${!isPaused && !isReady ? 'scale-125 opacity-30' : 'scale-90 opacity-10'}`}></div>
                    <div className="relative z-10 text-center">
                        {isRestingState ? (
                            <div className="relative flex items-center justify-center">
                                <div className="relative w-72 h-72">
                                    <svg className="w-full h-full -rotate-90" viewBox="0 0 260 260">
                                        <circle cx="130" cy="130" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" className="text-emerald-900" />
                                        <circle cx="130" cy="130" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" className="text-emerald-400 transition-all duration-1000 ease-linear" />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <p className="text-emerald-400 font-bold text-xl mb-2 animate-pulse flex items-center justify-center gap-2">
                                            {isPaused ? <Pause size={20} /> : <RotateCcw size={20} />}
                                            {isPaused ? "Paused" : "Resting"}
                                        </p>
                                        <div className={`text-8xl font-black tabular-nums tracking-tighter mb-2 ${isPaused ? 'opacity-50' : ''}`}>{formatTime(timer)}</div>
                                        <p className="text-gray-500 font-medium text-xs">NEXT SET PREPARATION</p>
                                    </div>
                                </div>
                            </div>
                        ) : isReady ? (
                            <>
                                <div className="w-64 h-64 rounded-full border-4 border-dashed border-neutral-700 flex flex-col items-center justify-center relative bg-neutral-900 shadow-2xl">
                                    <p className="text-xl font-bold mb-2 text-white">SET {currentSetIdx + 1}</p>
                                    <p className="text-sm text-gray-500 mb-6 uppercase tracking-widest">Start when ready</p>
                                    <Button onClick={startSet} variant="primary" className="rounded-full w-20 h-20 hover:scale-110 transition-all shadow-[0_0_30px_rgba(250,204,21,0.4)]"><Play size={32} fill="black" /></Button>
                                </div>
                            </>
                        ) : (
                            <div className="relative flex items-center justify-center">
                                <div className="relative w-72 h-72">
                                    <svg className="w-full h-full -rotate-90" viewBox="0 0 260 260">
                                        <circle cx="130" cy="130" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" className="text-neutral-800" />
                                        <circle cx="130" cy="130" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" className="text-yellow-400 transition-all duration-1000 ease-linear" />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <div className={`text-7xl font-black mb-1 tabular-nums text-white ${isPaused ? 'opacity-50' : ''}`}>{formatTime(timer)}</div>
                                        <p className="text-yellow-400 text-sm mb-6 flex items-center gap-2 font-bold uppercase tracking-wider">{isPaused ? <span className="text-red-400 flex items-center gap-1"><Pause size={14} /> Paused</span> : <><Activity size={14} /> Active</>}</p>
                                        <button onClick={() => setViewingExercise(currentEx)} className="absolute bottom-8 bg-neutral-800 hover:bg-neutral-700 px-4 py-2 rounded-full text-xs flex items-center gap-1 transition-colors border border-neutral-700 text-gray-300"><Info size={12} /> 자세 보기</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className={`bg-neutral-900 border-t border-neutral-800 text-white p-6 rounded-t-3xl z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] transition-transform duration-300`}>
                    <div className="flex justify-center mb-6">
                        <div className="bg-neutral-800 border border-neutral-700 px-4 py-1.5 rounded-full text-xs text-gray-400 font-medium flex items-center gap-2"><RotateCcw size={12} /> 이전 기록: 60kg × 10회</div>
                    </div>
                    <div className="flex justify-between items-center mb-6 px-2 gap-4">
                        <div className="text-center flex-1">
                            <p className="text-[10px] text-gray-500 mb-2 font-bold uppercase tracking-wider">Weight (kg)</p>
                            <input type="number" value={currentWeight} onChange={(e) => setCurrentWeight(e.target.value)} placeholder="60" className="bg-neutral-800 border border-neutral-700 w-full p-4 rounded-xl text-center font-black text-2xl text-white focus:outline-none focus:border-yellow-400 transition-all placeholder-gray-600" />
                        </div>
                        <div className="text-center flex-1">
                            <p className="text-[10px] text-gray-500 mb-2 font-bold uppercase tracking-wider">Reps</p>
                            <input type="number" value={currentReps} onChange={(e) => setCurrentReps(e.target.value)} placeholder="10" className="bg-neutral-800 border border-neutral-700 w-full p-4 rounded-xl text-center font-black text-2xl text-white focus:outline-none focus:border-yellow-400 transition-all placeholder-gray-600" />
                        </div>
                    </div>
                    <div className="flex gap-3">
                        {!isReady && (
                            <Button onClick={togglePause} variant="secondary" className={`flex-1 h-14 border-none text-lg ${isPaused ? 'bg-yellow-900/20 text-yellow-400 border border-yellow-400/50' : 'bg-neutral-800 hover:bg-neutral-700'}`}>
                                {isPaused ? <Play fill="currentColor" size={24} /> : <Pause fill="currentColor" size={24} />}
                            </Button>
                        )}
                        {isReady ? (
                            <Button onClick={startSet} variant="primary" className="flex-1 h-14 text-lg shadow-yellow-400/20">세트 시작 <Play fill="black" size={18} className="ml-1" /></Button>
                        ) : isRestingState ? (
                            <Button onClick={startNextSet} className="flex-[2] h-14 text-lg bg-emerald-600 hover:bg-emerald-500 text-white border-none shadow-lg shadow-emerald-900/50">휴식 건너뛰기 <SkipForward size={20} className="ml-1" /></Button>
                        ) : (
                            <Button onClick={finishSet} variant="primary" className="flex-[2] h-14 text-lg shadow-yellow-400/20">세트 완료 <CheckCircle2 size={24} className="ml-1" /></Button>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const RankingView = () => {
        const filteredRanking = RANKING_DATA.filter(user => user.tier === activeRankTier);
        const getRankStyle = (rank) => {
            if (rank === 1) return 'border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)] bg-yellow-400/10';
            if (rank === 2) return 'border-gray-300 shadow-[0_0_10px_rgba(209,213,219,0.3)] bg-gray-300/10';
            if (rank === 3) return 'border-orange-400 shadow-[0_0_10px_rgba(251,146,60,0.3)] bg-orange-400/10';
            return 'border-neutral-800 bg-neutral-900';
        };
        const getMedalIcon = (rank) => {
            if (rank === 1) return <Medal size={20} className="text-yellow-400 fill-yellow-400" />;
            if (rank === 2) return <Medal size={20} className="text-gray-300 fill-gray-300" />;
            if (rank === 3) return <Medal size={20} className="text-orange-400 fill-orange-400" />;
            return <span className="text-gray-500 font-bold w-6 text-center">{rank}</span>;
        };

        return (
            <div className="p-5 pb-24 space-y-6">
                <div className="flex justify-between items-end">
                    <h2 className="font-black text-2xl text-white italic">MONTHLY<br /><span className="text-yellow-400">LEADERBOARD</span></h2>
                    <div className="text-right">
                        <p className="text-xs text-gray-500 font-bold uppercase">Reset in</p>
                        <p className="text-white font-mono font-bold">12 Days</p>
                    </div>
                </div>
                <div className="space-y-4">
                    <Card className="p-4 bg-neutral-900 border border-neutral-800">
                        <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded bg-neutral-800 flex items-center justify-center border border-neutral-700"><Trophy className="text-yellow-400" /></div>
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase">My Rank</p>
                                    <p className="text-lg font-black text-white italic">#{userStats.totalVolume > 0 ? '14' : '-'} {activeRankTier}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-500">Total Score</p>
                                <p className="text-sm font-bold text-blue-400">{userStats.totalVolume?.toLocaleString() || 0} pts</p>
                            </div>
                        </div>
                        <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden"><div className="h-full bg-blue-500 w-[75%]"></div></div>
                    </Card>
                    <Card className="p-5 bg-neutral-900 border-neutral-800 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5"><TrendingUp size={100} className="text-yellow-400" /></div>
                        <h3 className="font-bold text-gray-300 mb-6 flex items-center gap-2 z-10 relative"><Zap size={16} className="text-yellow-400 fill-yellow-400" />1RM GROWTH <span className="text-xs text-gray-600 bg-neutral-800 px-2 py-0.5 rounded">SQUAT</span></h3>
                        <div className="h-40 flex items-end justify-between gap-3 px-2 z-10 relative">
                            {[60, 65, 70, 65, 80, 85, 90].map((val, idx) => (
                                <div key={idx} className="w-full flex flex-col items-center gap-2 group">
                                    <div className="w-full relative h-32 flex items-end">
                                        <div style={{ height: `${val}%` }} className="w-full bg-neutral-800 rounded-t group-hover:bg-yellow-400 transition-colors relative duration-300"></div>
                                        <div style={{ bottom: `${val}%` }} className="absolute w-full h-0.5 bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,1)] mb-[-1px] z-20 group-hover:opacity-100 opacity-50 transition-opacity"></div>
                                    </div>
                                    <span className="text-[10px] text-gray-600 font-bold">{idx + 1}W</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                    {TIERS.map(tier => (
                        <button key={tier} onClick={() => setActiveRankTier(tier)} className={`px-4 py-2 rounded-full whitespace-nowrap text-xs font-bold transition-all border ${activeRankTier === tier ? 'bg-white text-black border-white shadow-[0_0_10px_rgba(255,255,255,0.3)]' : 'bg-neutral-900 text-gray-500 border-neutral-800 hover:border-gray-600'}`}>{tier}</button>
                    ))}
                </div>
                <div className="space-y-3">
                    {filteredRanking.map((item) => (
                        <div key={item.id} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${getRankStyle(item.rank)}`}>
                            <div className="flex items-center gap-4">
                                <div className="w-6 flex justify-center">{getMedalIcon(item.rank)}</div>
                                <Avatar size="sm" color={item.avatar} />
                                <div>
                                    <span className={`font-bold ${item.rank <= 3 ? 'text-white' : 'text-gray-300'} ${item.id === user.uid ? 'text-yellow-400' : ''}`}>{item.name} {item.id === user.uid && '(Me)'}</span>
                                    {item.rank <= 3 && <p className="text-[10px] text-yellow-400 font-bold uppercase tracking-widest">Top Rated</p>}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-white font-black font-mono text-lg">{item.score.toLocaleString()}</span>
                                <span className="text-[10px] text-gray-600 font-bold uppercase">pts</span>
                            </div>
                        </div>
                    ))}
                    {filteredRanking.length === 0 && <div className="text-center py-10 text-gray-600">No users in this tier yet.</div>}
                </div>
            </div>
        );
    };

    const MyPageView = () => (
        <div className="pb-24">
            <div className="bg-neutral-900 p-8 pb-10 pt-10 border-b border-neutral-800">
                <div className="flex items-center gap-4 mb-6">
                    <Avatar size="lg" color="bg-neutral-800 text-yellow-400 border border-neutral-700" />
                    <div>
                        <h2 className="text-2xl font-bold text-white">{user?.displayName || 'User'}</h2>
                        <p className="text-yellow-400 text-sm font-medium">{user?.email || 'user@example.com'}</p>
                        <p className="text-gray-500 text-xs mt-1">운동 32일차 • 레벨 {getLevel(userStats.totalVolume)}</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="text-center">
                        <p className="font-black text-xl text-white">{userStats.workoutsCompleted || 0}</p>
                        <p className="text-xs text-gray-500">운동 횟수</p>
                    </div>
                    <div className="w-[1px] bg-neutral-800 h-8 self-center"></div>
                    <div className="text-center">
                        <p className="font-black text-xl text-white">{(userStats.totalVolume / 1000).toFixed(1)}t</p>
                        <p className="text-xs text-gray-500">총 볼륨</p>
                    </div>
                </div>
            </div>
            <div className="p-5 -mt-6">
                <Card className="p-0 bg-neutral-900 border-neutral-800">
                    {['계정 설정', '알림 설정'].map((item, idx) => (
                        <button key={idx} className="w-full text-left p-4 border-b border-neutral-800 last:border-0 flex justify-between items-center hover:bg-neutral-800 transition-colors">
                            <span className="font-medium text-gray-300">{item}</span>
                            <ChevronRight size={16} className="text-gray-600" />
                        </button>
                    ))}
                    <button onClick={handleLogout} className="w-full text-left p-4 border-b border-neutral-800 last:border-0 flex justify-between items-center hover:bg-red-900/20 transition-colors group">
                        <span className="font-medium text-red-400 group-hover:text-red-300">로그아웃</span>
                        <LogOut size={16} className="text-red-400 group-hover:text-red-300" />
                    </button>
                </Card>
            </div>
        </div>
    );

    if (!user) {
        return <LoginView onLogin={setUser} />;
    }

    return (
        <div className="max-w-md mx-auto min-h-screen bg-neutral-950 shadow-2xl overflow-hidden font-sans text-gray-100 relative">
            {/* Dynamic Content */}
            {activeTab === 'runner' ? (
                <RunnerView />
            ) : (
                <>
                    <Header />
                    <main className="min-h-screen">
                        {activeTab === 'home' && <HomeView />}
                        {activeTab === 'feed' && <FeedView />}
                        {activeTab === 'ranking' && <RankingView />}
                        {activeTab === 'mypage' && <MyPageView />}
                    </main>
                    <BottomNav
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        workoutStatus={workoutStatus}
                        startWorkout={startWorkout}
                        setModalOpen={setModalOpen}
                        routine={routine}
                    />
                </>
            )}

            {/* Overlays */}
            {toastMessage && <Toast message={toastMessage} />}

            {/* Modals */}
            {modalOpen === 'builder' && (
                <WorkoutBuilder
                    routine={routine}
                    setRoutine={setRoutine}
                    setModalOpen={setModalOpen}
                    user={user}
                />
            )}
            {modalOpen === 'feed-create' && (
                <FeedCreateModal
                    setCompletedWorkouts={setCompletedWorkouts}
                    setModalOpen={setModalOpen}
                    setActiveTab={setActiveTab}
                    completedWorkouts={completedWorkouts}
                    workoutSummary={workoutSummary}
                    routine={routine}
                    user={user}
                />
            )}
            {modalOpen === 'logout-confirm' && (
                <LogoutModal
                    setModalOpen={setModalOpen}
                    processLogout={processLogout}
                />
            )}
            {modalOpen === 'quit-confirm' && (
                <QuitWorkoutModal
                    setModalOpen={setModalOpen}
                    confirmQuit={confirmQuitWorkout}
                />
            )}
            {modalOpen === 'quest-selection' && (
                <QuestSelectionModal
                    onClose={() => setModalOpen(null)}
                    onSelect={handleSelectQuest}
                    quests={DAILY_QUESTS}
                />
            )}
            {viewingExercise && (
                <ExerciseGuideModal
                    exercise={viewingExercise}
                    onClose={() => setViewingExercise(null)}
                />
            )}
            {activeMenuPostId && (
                <MoreActionSheet onClose={() => setActiveMenuPostId(null)} />
            )}
        </div>
    );
}