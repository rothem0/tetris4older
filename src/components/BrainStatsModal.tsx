import React from 'react';
import { GameStats } from '../types/game';
import { X, Award, CheckCircle2, HeartHandshake, Sparkles, Brain, Clock, ShieldCheck } from 'lucide-react';

interface BrainStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: GameStats;
}

export const BrainStatsModal: React.FC<BrainStatsModalProps> = ({
  isOpen,
  onClose,
  stats,
}) => {
  if (!isOpen) return null;

  const totalMinutes = Math.floor(stats.playTimeSeconds / 60);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border-4 border-emerald-500 flex flex-col gap-5">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-stone-900">
                어르신 두뇌 건강 일지
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-stone-500">
                꾸준한 퍼즐은 공간 감각과 단기 기억력을 건강하게 지켜줍니다.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            aria-label="닫기"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Daily Praise Stamp Banner */}
        <div className="bg-gradient-to-r from-amber-50 to-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 flex items-center gap-4 shadow-xs">
          <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-black text-emerald-900 text-base sm:text-lg">
              <span>오늘의 두뇌 건강 도장 획득!</span>
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
            </div>
            <p className="text-xs sm:text-sm text-stone-600 font-medium mt-0.5">
              포기하지 않고 즐겁게 생각하는 것만으로도 뇌세포 신경망이 튼튼해집니다.
            </p>
          </div>
        </div>

        {/* Cognitive Stat Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 flex flex-col">
            <span className="text-xs font-bold text-stone-500">총 맞춘 줄</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl sm:text-3xl font-black text-stone-900 font-mono tabular-nums">
                {stats.linesCleared}
              </span>
              <span className="text-sm font-bold text-stone-600">줄</span>
            </div>
            <span className="text-xs text-emerald-700 font-semibold mt-1">
              공간 정리 능력 향상
            </span>
          </div>

          <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 flex flex-col">
            <span className="text-xs font-bold text-stone-500">두뇌 집중 시간</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl sm:text-3xl font-black text-stone-900 font-mono tabular-nums">
                {totalMinutes > 0 ? totalMinutes : 1}
              </span>
              <span className="text-sm font-bold text-stone-600">분</span>
            </div>
            <span className="text-xs text-emerald-700 font-semibold mt-1">
              주의력 및 몰입 훈련
            </span>
          </div>

          <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 flex flex-col">
            <span className="text-xs font-bold text-stone-500">최고 두뇌 점수</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl sm:text-3xl font-black text-blue-700 font-mono tabular-nums">
                {stats.highestScore}
              </span>
              <span className="text-sm font-bold text-stone-600">점</span>
            </div>
            <span className="text-xs text-blue-700 font-semibold mt-1">
              기억력 활력 자극
            </span>
          </div>

          <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 flex flex-col">
            <span className="text-xs font-bold text-stone-500">한 수 무르기 활용</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl sm:text-3xl font-black text-amber-700 font-mono tabular-nums">
                {stats.undosUsed}
              </span>
              <span className="text-sm font-bold text-stone-600">회</span>
            </div>
            <span className="text-xs text-amber-700 font-semibold mt-1">
              신중한 자기 교정 훈련
            </span>
          </div>
        </div>

        {/* Cognitive Doctor / Therapist Care Notes */}
        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex flex-col gap-2">
          <div className="flex items-center gap-2 font-bold text-emerald-950 text-sm sm:text-base">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            <span>인지 재활 전문가의 한 마디</span>
          </div>
          <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed font-medium">
            테트리스 블록을 머릿속으로 돌리고 빈 공간에 맞추는 활동은 치매 초기나 경도인지장애 어르신의
            <strong> 전두엽(계획·실행 능력)</strong>과 <strong>두정엽(공간 지각력)</strong>을 자연스럽게 깨워줍니다.
            빠른 속도보다는 <strong>'여유롭게 생각하며 한 칸씩 맞추는 습관'</strong>이 가장 좋습니다.
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black text-base sm:text-lg rounded-2xl transition-all shadow-md mt-1"
        >
          확인하고 계속하기
        </button>
      </div>
    </div>
  );
};
