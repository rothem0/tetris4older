import React from 'react';
import { Award, RotateCcw, Brain, CheckCircle2 } from 'lucide-react';

interface GameOverModalProps {
  isOpen: boolean;
  score: number;
  lines: number;
  playTimeMinutes: number;
  onRestart: () => void;
  onViewStats: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  score,
  lines,
  playTimeMinutes,
  onRestart,
  onViewStats,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border-4 border-emerald-500 flex flex-col items-center text-center gap-5">
        {/* Warm Golden Badge */}
        <div className="w-20 h-20 rounded-full bg-emerald-100 border-4 border-emerald-500 text-emerald-700 flex items-center justify-center shadow-lg animate-bounce">
          <Award className="w-12 h-12" />
        </div>

        <div className="flex flex-col gap-1.5">
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
            두뇌 운동 완료!
          </h2>
          <p className="text-base font-bold text-emerald-800">
            오늘도 훌륭하게 두뇌를 깨우셨습니다!
          </p>
          <p className="text-xs sm:text-sm text-stone-500 font-medium">
            블록을 돌리고 맞추는 동안 어르신의 집중력과 뇌 신경망이 튼튼해졌습니다.
          </p>
        </div>

        {/* Results Box */}
        <div className="w-full grid grid-cols-2 gap-3 p-4 bg-stone-50 rounded-2xl border border-stone-200">
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-stone-500">맞춘 줄</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-black text-stone-900 font-mono tabular-nums">
                {lines}
              </span>
              <span className="text-sm font-bold text-stone-600">줄</span>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-stone-500">두뇌 활력 점수</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-black text-emerald-700 font-mono tabular-nums">
                {score}
              </span>
              <span className="text-sm font-bold text-stone-600">점</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2.5">
          <button
            onClick={onRestart}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black text-lg rounded-2xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-6 h-6" />
            <span>새 게임 다시 하기</span>
          </button>

          <button
            onClick={onViewStats}
            className="w-full py-3 bg-stone-100 hover:bg-stone-200 active:scale-98 text-stone-800 font-bold text-base rounded-2xl transition-all flex items-center justify-center gap-2 border border-stone-300"
          >
            <Brain className="w-5 h-5 text-stone-600" />
            <span>나의 두뇌 건강 일지 보기</span>
          </button>
        </div>
      </div>
    </div>
  );
};
