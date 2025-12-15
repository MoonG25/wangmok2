import { Card } from '@/components/ui/Card';

interface WeeklyStreakProps {
    weeklyActivity: boolean[];
}

export const WeeklyStreak = ({ weeklyActivity = Array(7).fill(false) }: WeeklyStreakProps) => (
    <section>
        <div className="flex justify-between items-end mb-3">
            <h2 className="text-lg font-bold text-white">이번 주 버닝 🔥</h2>
            <span className="text-xs text-yellow-400 font-bold bg-yellow-400/10 px-2 py-1 rounded">3일 연속 달성 중!</span>
        </div>
        <Card className="p-4 bg-neutral-900 border-neutral-800 flex justify-between items-center">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2 group">
                    <div className={`w-3 h-12 rounded-full transition-all duration-300 ${weeklyActivity[idx] ? 'bg-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.6)]' : 'bg-neutral-800 border border-neutral-700'}`}></div>
                    <span className={`text-[10px] font-bold ${weeklyActivity[idx] ? 'text-white' : 'text-neutral-600'}`}>{day}</span>
                </div>
            ))}
        </Card>
    </section>
);
