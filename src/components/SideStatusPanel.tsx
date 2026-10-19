import React from 'react';
import { GameMode, Piece } from '../types/game';
import { Trophy, Clock, Brain, Flame } from 'lucide-react';

interface SideStatusPanelProps {
  nextPiece: Piece | null;
  score: number;
  lines: number;
  mode: GameMode;
  playTimeMinutes: number;
  streak: number;
  onOpenSettings: () => void;
}

export const SideStatusPanel: React.FC<SideStatusPanelProps> = ({
  nextPiece,
  score,
  lines,
  mode,
  playTimeMinutes,
  streak,
  onOpenSettings,
}) => {
  const getModeLabel = (m: GameMode) => {
    switch (m) {
      case 'turn':
        return '생각하며 한 칸씩 (시간 여유)';
      case 'relaxed':
        return '아주 느긋하게 (초급)';
      case 'normal':
        return '편안한 리듬 (보통)';
      case 'active':
        return '활기찬 두뇌 (빠름)';
    }
  };

  return (
    <div className="flex flex-col gap-3.5 w-full max-w-[280px]">
      {/* Next Piece Card */}
      <div className="bg-white rounded-2xl border-2 border-stone-200 p-4 shadow-sm flex flex-col items-center">
        <span className="text-sm font-bold text-stone-500 mb-2">다음 나올 모양</span>
        <div className="w-24 h-24 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-center p-2">
          {nextPiece ? (
            <div
              className="grid gap-1"
              style={{
                gridTemplateColumns: `repeat(${nextPiece.shape[0].length}, minmax(0, 1fr))`,
              }}
            >
              {nextPiece.shape.map((row, rIdx) =>
                row.map((cell, cIdx) => (
                  <div
                    key={`${rIdx}-${cIdx}`}
                    className={`w-5 h-5 rounded flex items-center justify-center ${
                      cell !== 0 ? 'shadow-sm' : 'invisible'
                    }`}
                    style={{
                      backgroundColor: cell !== 0 ? nextPiece.color : 'transparent',
                      borderColor: cell !== 0 ? nextPiece.borderColor : 'transparent',
                    }}
                  >
                    {cell !== 0 && (
                      <span className="text-white text-xs font-bold leading-none">
                        {nextPiece.symbol}
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          ) : (
            <span className="text-xs text-stone-400">대기 중</span>
          )}
        </div>
      </div>

      {/* Main Cognitive Metrics */}
      <div className="bg-white rounded-2xl border-2 border-stone-200 p-4 shadow-sm flex flex-col gap-3">
        {/* Cleared Lines Count */}
        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Trophy className="w-4 h-4" />
            </div>
            <span className="text-base font-bold text-stone-800">맞춘 줄</span>
          </div>
          <span className="text-2xl font-black text-emerald-700 font-mono tabular-nums">
            {lines}
            <span className="text-sm font-semibold text-stone-500 ml-1">줄</span>
          </span>
        </div>

        {/* Score */}
        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center">
              <Brain className="w-4 h-4" />
            </div>
            <span className="text-base font-bold text-stone-800">두뇌 활력</span>
          </div>
          <span className="text-2xl font-black text-blue-700 font-mono tabular-nums">
            {score}
            <span className="text-sm font-semibold text-stone-500 ml-1">점</span>
          </span>
        </div>

        {/* Focus Time */}
        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-base font-bold text-stone-800">운동 시간</span>
          </div>
          <span className="text-lg font-bold text-stone-800 font-mono tabular-nums">
            {playTimeMinutes}
            <span className="text-sm font-semibold text-stone-500 ml-1">분</span>
          </span>
        </div>

        {/* Combo / Streak */}
        {streak > 1 && (
          <div className="flex items-center justify-between px-3 py-1.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800">
            <div className="flex items-center gap-1.5 font-bold text-sm">
              <Flame className="w-4 h-4 text-rose-600 fill-rose-500" />
              <span>연속 완성</span>
            </div>
            <span className="text-base font-black font-mono tabular-nums">
              {streak}연속!
            </span>
          </div>
        )}
      </div>

      {/* Speed / Mode Card */}
      <div className="bg-stone-50 rounded-2xl border border-stone-200 p-3.5 flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-stone-500">진행 속도</span>
          <button
            onClick={onOpenSettings}
            className="text-xs font-bold text-emerald-700 hover:underline"
          >
            변경
          </button>
        </div>
        <p className="text-sm font-bold text-stone-800">{getModeLabel(mode)}</p>
      </div>
    </div>
  );
};
