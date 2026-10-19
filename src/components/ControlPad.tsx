import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowDown,
  RotateCw,
  ChevronsDown,
  Lightbulb,
  Undo2,
  Sparkles,
  Pause,
  Play
} from 'lucide-react';
import { soundManager } from '../utils/audio';

interface ControlPadProps {
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onRotate: () => void;
  onSoftDrop: () => void;
  onHardDrop: () => void;
  onUndo: () => void;
  onHint: () => void;
  onRescue: () => void;
  onTogglePause: () => void;
  isPaused: boolean;
  canUndo: boolean;
  isTurnMode: boolean;
}

export const ControlPad: React.FC<ControlPadProps> = ({
  onMoveLeft,
  onMoveRight,
  onRotate,
  onSoftDrop,
  onHardDrop,
  onUndo,
  onHint,
  onRescue,
  onTogglePause,
  isPaused,
  canUndo,
  isTurnMode,
}) => {
  const handleAction = (callback: () => void) => {
    soundManager.triggerVibrate(20);
    callback();
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-3 select-none">
      {/* Top Assistance Row: Undo, Hint, Rescue, Pause */}
      <div className="grid grid-cols-4 gap-2">
        {/* Undo Button */}
        <button
          onClick={() => handleAction(onUndo)}
          disabled={!canUndo || isPaused}
          className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl border text-sm font-bold transition-all active:scale-95 shadow-sm ${
            canUndo && !isPaused
              ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300'
              : 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed opacity-60'
          }`}
          aria-label="한 수 무르기"
        >
          <Undo2 className="w-5 h-5 mb-0.5 text-amber-700" />
          <span className="text-xs sm:text-sm">한수무르기</span>
        </button>

        {/* AI Hint Button */}
        <button
          onClick={() => handleAction(onHint)}
          disabled={isPaused}
          className="flex flex-col items-center justify-center py-2.5 px-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-300 text-sm font-bold transition-all active:scale-95 shadow-sm"
          aria-label="추천 힌트"
        >
          <Lightbulb className="w-5 h-5 mb-0.5 text-blue-700" />
          <span className="text-xs sm:text-sm">추천자리</span>
        </button>

        {/* Rescue Button */}
        <button
          onClick={() => handleAction(onRescue)}
          disabled={isPaused}
          className="flex flex-col items-center justify-center py-2.5 px-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-300 text-sm font-bold transition-all active:scale-95 shadow-sm"
          aria-label="활력 찬스 (한 줄 지우기)"
        >
          <Sparkles className="w-5 h-5 mb-0.5 text-rose-700" />
          <span className="text-xs sm:text-sm">줄 지우기</span>
        </button>

        {/* Pause/Resume Button */}
        <button
          onClick={() => handleAction(onTogglePause)}
          className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl border text-sm font-bold transition-all active:scale-95 shadow-sm ${
            isPaused
              ? 'bg-emerald-600 text-white border-emerald-700'
              : 'bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-300'
          }`}
          aria-label={isPaused ? '계속하기' : '잠시 멈춤'}
        >
          {isPaused ? (
            <>
              <Play className="w-5 h-5 mb-0.5 fill-current" />
              <span className="text-xs sm:text-sm">계속하기</span>
            </>
          ) : (
            <>
              <Pause className="w-5 h-5 mb-0.5" />
              <span className="text-xs sm:text-sm">쉬어가기</span>
            </>
          )}
        </button>
      </div>

      {/* Main Large Movement Controls */}
      <div className="grid grid-cols-3 gap-2.5">
        {/* Left */}
        <button
          onClick={() => handleAction(onMoveLeft)}
          disabled={isPaused}
          className="h-16 sm:h-20 rounded-2xl bg-white hover:bg-stone-50 active:bg-stone-200 border-2 border-stone-300 active:border-stone-400 text-stone-900 flex flex-col items-center justify-center gap-1 shadow-md active:scale-95 transition-transform"
          aria-label="왼쪽으로 이동"
        >
          <ArrowLeft className="w-8 h-8 text-stone-800 stroke-[2.5]" />
          <span className="text-sm sm:text-base font-extrabold">왼쪽</span>
        </button>

        {/* Rotate Button (Primary Attention) */}
        <button
          onClick={() => handleAction(onRotate)}
          disabled={isPaused}
          className="h-16 sm:h-20 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white flex flex-col items-center justify-center gap-1 shadow-lg active:scale-95 transition-transform ring-2 ring-emerald-400"
          aria-label="모양 돌리기"
        >
          <RotateCw className="w-8 h-8 stroke-[2.5]" />
          <span className="text-sm sm:text-base font-black">모양 돌리기</span>
        </button>

        {/* Right */}
        <button
          onClick={() => handleAction(onMoveRight)}
          disabled={isPaused}
          className="h-16 sm:h-20 rounded-2xl bg-white hover:bg-stone-50 active:bg-stone-200 border-2 border-stone-300 active:border-stone-400 text-stone-900 flex flex-col items-center justify-center gap-1 shadow-md active:scale-95 transition-transform"
          aria-label="오른쪽으로 이동"
        >
          <ArrowRight className="w-8 h-8 text-stone-800 stroke-[2.5]" />
          <span className="text-sm sm:text-base font-extrabold">오른쪽</span>
        </button>
      </div>

      {/* Down & Instant Drop Row */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Step Down */}
        <button
          onClick={() => handleAction(onSoftDrop)}
          disabled={isPaused}
          className="h-14 sm:h-16 rounded-xl bg-stone-100 hover:bg-stone-200 active:bg-stone-300 border-2 border-stone-300 text-stone-800 flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-transform"
          aria-label="한 칸 내리기"
        >
          <ArrowDown className="w-6 h-6 text-stone-700 stroke-[2.5]" />
          <span className="text-base font-bold">
            {isTurnMode ? '한 칸 전진' : '천천히 내리기'}
          </span>
        </button>

        {/* Instant Drop */}
        <button
          onClick={() => handleAction(onHardDrop)}
          disabled={isPaused}
          className="h-14 sm:h-16 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white flex items-center justify-center gap-2 shadow-md active:scale-95 transition-transform"
          aria-label="바로 놓기"
        >
          <ChevronsDown className="w-6 h-6 stroke-[2.5]" />
          <span className="text-base font-bold">바로 놓기</span>
        </button>
      </div>
    </div>
  );
};
