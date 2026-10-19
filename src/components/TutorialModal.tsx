import React from 'react';
import { X, ArrowLeftRight, RotateCw, CheckCircle, Undo2, Lightbulb, Sparkles, Keyboard } from 'lucide-react';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border-4 border-stone-300 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-stone-900">
                어르신을 위한 쉬운 놀이 방법
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-stone-500">
                급하지 않게 천천히, 원하는 대로 즐기시면 됩니다.
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

        {/* 4 Easy Illustrated Steps */}
        <div className="flex flex-col gap-4">
          {/* Step 1 */}
          <div className="flex items-start gap-3.5 p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 font-black text-base shadow-sm">
              1
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 font-black text-stone-900 text-base">
                <ArrowLeftRight className="w-4 h-4 text-emerald-600" />
                <span>왼쪽·오른쪽으로 자리 맞추기</span>
              </div>
              <p className="text-sm text-stone-600 leading-relaxed font-medium">
                화면 아래의 커다란 <strong>[왼쪽]</strong>, <strong>[오른쪽]</strong> 버튼을 눌러 블록을 빈 곳으로 옮깁니다.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3.5 p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 font-black text-base shadow-sm">
              2
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 font-black text-stone-900 text-base">
                <RotateCw className="w-4 h-4 text-emerald-600" />
                <span>가운데 [모양 돌리기] 누르기</span>
              </div>
              <p className="text-sm text-stone-600 leading-relaxed font-medium">
                가운데 초록색 <strong>[모양 돌리기]</strong> 버튼을 누르면 블록이 빙글 돌아가 빈틈에 쏙 들어갑니다.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-3.5 p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 font-black text-base shadow-sm">
              3
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 font-black text-stone-900 text-base">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>가로 한 줄 채우면 상쾌하게 완성!</span>
              </div>
              <p className="text-sm text-stone-600 leading-relaxed font-medium">
                가로 10칸을 빈틈없이 채우면 예쁜 소리와 함께 줄이 사라지며 두뇌 활력 점수를 얻습니다.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex items-start gap-3.5 p-3.5 bg-amber-50 rounded-2xl border border-amber-200">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 font-black text-base shadow-sm">
              4
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 font-black text-amber-950 text-base">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>실수해도 괜찮은 든든한 도우미</span>
              </div>
              <p className="text-sm text-amber-900 leading-relaxed font-medium">
                잘못 놓았을 땐 <strong>[한 수 무르기]</strong>, 어디 둘지 고민될 땐 <strong>[추천 자리]</strong>, 블록이 너무 높으면 <strong>[줄 지우기]</strong>를 누르세요.
              </p>
            </div>
          </div>
        </div>

        {/* Keyboard Guide for PC Users */}
        <div className="p-3.5 bg-stone-100 rounded-2xl border border-stone-200 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-stone-800 font-bold text-sm">
            <Keyboard className="w-4 h-4 text-stone-600" />
            <span>컴퓨터 키보드로도 할 수 있습니다</span>
          </div>
          <div className="text-xs text-stone-600 grid grid-cols-2 gap-2">
            <div>• 이동: <strong>← 좌, → 우 방향키</strong></div>
            <div>• 돌리기: <strong>↑ 위쪽 방향키</strong></div>
            <div>• 내리기: <strong>↓ 아래 방향키</strong></div>
            <div>• 바로 놓기: <strong>스페이스바 (Space)</strong></div>
          </div>
        </div>

        {/* Start Game Action */}
        <button
          onClick={onClose}
          className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black text-base sm:text-lg rounded-2xl transition-all shadow-md"
        >
          이해했습니다! 신나게 해보기
        </button>
      </div>
    </div>
  );
};
