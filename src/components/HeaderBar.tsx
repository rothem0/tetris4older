import React from 'react';
import { Sparkles } from 'lucide-react';

interface HeaderBarProps {
  onOpenStats: () => void;
  onOpenTutorial: () => void;
  onOpenSettings: () => void;
  onRestartGame: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  onOpenStats,
  onOpenTutorial,
  onOpenSettings,
  onRestartGame,
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-4 sm:px-8 py-3.5 bg-white border-b border-stone-200">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
        <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm">
          <Sparkles className="w-5 h-5 text-emerald-100" />
        </div>
        <span className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
          청춘 두뇌 테트리스
        </span>
      </div>

      {/* Zone 2: 4 clean single-line nav links */}
      <nav className="hidden md:flex items-center gap-7 text-base font-semibold text-stone-600">
        <button
          onClick={onRestartGame}
          className="hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded px-1"
        >
          게임하기
        </button>
        <button
          onClick={onOpenStats}
          className="hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-emerald-500 rounded px-1"
        >
          두뇌 일지
        </button>
        <button
          onClick={onOpenTutorial}
          className="hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded px-1"
        >
          쉬운 안내
        </button>
        <button
          onClick={onOpenSettings}
          className="hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded px-1"
        >
          맞춤 설정
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onRestartGame}
          className="px-5 py-2.5 text-base font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-xl transition-all shadow-sm whitespace-nowrap shrink-0"
        >
          새 게임 시작
        </button>
      </div>
    </header>
  );
};
