import {
    Droplets,
    Utensils,
    Moon,
    Footprints,
    Coffee,
    Activity,
    Smile,
} from 'lucide-react';

export interface Exercise {
    id: string;
    name: string;
    slug: string;
    description: string;
    defaultTime: number;
    guide?: string;
    // Routine specific fields
    sets?: number;
    restTime?: number;
}

export const CATEGORIES = [
    { id: 'back', name: '등', color: 'bg-blue-900/30 text-blue-400 border border-blue-800/50' },
    { id: 'chest', name: '가슴', color: 'bg-indigo-900/30 text-indigo-400 border border-indigo-800/50' },
    { id: 'legs', name: '하체', color: 'bg-red-900/30 text-red-400 border border-red-800/50' },
    { id: 'shoulder', name: '어깨', color: 'bg-purple-900/30 text-purple-400 border border-purple-800/50' },
    { id: 'arms', name: '팔', color: 'bg-pink-900/30 text-pink-400 border border-pink-800/50' },
    { id: 'core', name: '코어', color: 'bg-green-900/30 text-green-400 border border-green-800/50' },
    { id: 'cardio', name: '유산소/스포츠', color: 'bg-orange-900/30 text-orange-400 border border-orange-800/50' },
];

export const DAILY_QUESTS = [
    { id: 'water', title: '물 2L 마시기', desc: '수분 충전으로 근육 회복 돕기', icon: Droplets, color: 'blue', exp: 50 },
    { id: 'protein', title: '단백질 챙겨 먹기', desc: '체중 1kg당 1.5g 이상 섭취', icon: Utensils, color: 'red', exp: 60 },
    { id: 'sleep', title: '7시간 이상 수면', desc: '성장은 잘 때 이루어집니다', icon: Moon, color: 'purple', exp: 80 },
    { id: 'walk', title: '만보 걷기', desc: '생활 속 유산소 실천', icon: Footprints, color: 'green', exp: 100 },
    { id: 'nocoffee', title: '카페인 줄이기', desc: '오후 2시 이후 커피 금지', icon: Coffee, color: 'yellow', exp: 40 },
    { id: 'stretch', title: '아침 스트레칭', desc: '상쾌한 하루의 시작', icon: Activity, color: 'orange', exp: 30 },
    { id: 'mind', title: '명상 5분', desc: '운동 전 멘탈 관리', icon: Smile, color: 'pink', exp: 50 },
];

export const EXERCISES: Record<string, Exercise[]> = {
    back: [
        { id: '1001', name: '데드리프트', slug: 'deadlift', description: "등/전신 근력 강화", defaultTime: 0 },
        { id: '1009', name: '시티드 케이블 로우', slug: 'seated-cable-row', description: "등 중앙부 발달", defaultTime: 0 },
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
        { id: '2001', name: '벤치 프레스', slug: 'bench-press', description: "가슴 운동의 왕", defaultTime: 0 },
        { id: '2002', name: '덤벨 벤치 프레스', slug: 'dumbbell-bench-press', description: "가동범위 극대화", defaultTime: 0 },
        { id: '2008', name: '딥스', slug: 'dips', description: "아랫가슴 및 삼두", defaultTime: 0 },
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
        { id: '4025', name: '프론트 스쿼트', slug: 'front-squat', description: "대퇴사두 집중", defaultTime: 0 },
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
        { id: '3001', name: '오버헤드 프레스', slug: 'overhead-press', description: "어깨 전체 매스", defaultTime: 0 },
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
        { id: '7001', name: '바벨 바이셉 컬', slug: 'barbell-bicep-curl', description: "이두근 매스", defaultTime: 0 },
        { id: '6002', name: '케이블 트라이셉 푸쉬다운', slug: 'cable-tricep-pushdown', description: "삼두근 외측두", defaultTime: 0 },
        { id: '8001', name: '덤벨 리스트 컬', slug: 'dumbbell-wrist-curl', description: "전완근 굴곡근", defaultTime: 0 },
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
        { id: '5001', name: '레그 레이즈', slug: 'leg-raise', description: "하복부 강화", defaultTime: 0 },
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

export const MOCK_USERS_ONLINE = [
    { id: 1, name: '김헬스', avatar: 'bg-blue-600' },
    { id: 2, name: '이근육', avatar: 'bg-red-600' },
    { id: 3, name: '박득근', avatar: 'bg-green-600' },
    { id: 4, name: '최요가', avatar: 'bg-yellow-600' },
    { id: 5, name: '정필라', avatar: 'bg-purple-600' },
];

export const TIERS = ['Grand Master', 'Master', 'Diamond', 'Platinum', 'Gold', 'Silver', 'Bronze'];

export const RANKING_DATA: any[] = [];
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
