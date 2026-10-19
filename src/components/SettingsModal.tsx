import React from 'react';
import { BlockComplexity, GameMode, GameSettings } from '../types/game';
import { X, Volume2, VolumeX, Eye, Gauge, Sliders, Type } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  const handleModeChange = (mode: GameMode) => {
    onUpdateSettings({ ...settings, mode });
  };

  const handleComplexityChange = (complexity: BlockComplexity) => {
    onUpdateSettings({ ...settings, complexity });
  };

  const handleFontSizeChange = (fontSize: 'normal' | 'large' | 'huge') => {
    onUpdateSettings({ ...settings, fontSize });
  };

  const toggleSound = () => {
    const next = !settings.soundEnabled;
    onUpdateSettings({ ...settings, soundEnabled: next });
    soundManager.updateConfig(next, settings.voiceEnabled, settings.volume);
    if (next) soundManager.playTone(440, 0.15);
  };

  const toggleVoice = () => {
    const next = !settings.voiceEnabled;
    onUpdateSettings({ ...settings, voiceEnabled: next });
    soundManager.updateConfig(settings.soundEnabled, next, settings.volume);
    if (next) soundManager.speakEncouragement('음성 칭찬이 켜졌습니다.');
  };

  const toggleHighContrast = () => {
    onUpdateSettings({ ...settings, highContrast: !settings.highContrast });
  };

  const toggleGhost = () => {
    onUpdateSettings({ ...settings, showGhost: !settings.showGhost });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border-4 border-stone-300 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center">
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-stone-900">
                어르신 맞춤 편의 설정
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-stone-500">
                편안한 속도와 눈이 편한 화면으로 변경하세요.
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

        {/* 1. Game Speed Modes */}
        <div className="flex flex-col gap-2">
          <label className="text-sm sm:text-base font-black text-stone-900 flex items-center gap-2">
            <Gauge className="w-5 h-5 text-emerald-600" />
            <span>블록 떨어지는 속도</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleModeChange('turn')}
              className={`p-3 rounded-2xl border-2 text-left flex flex-col gap-1 transition-all ${
                settings.mode === 'turn'
                  ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-500/20'
                  : 'border-stone-200 bg-stone-50 hover:bg-stone-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm sm:text-base font-black text-stone-900">
                  턴제 (시간제한 없음)
                </span>
                <span className="text-xs bg-emerald-600 text-white font-bold px-1.5 py-0.5 rounded">
                  추천
                </span>
              </div>
              <span className="text-xs text-stone-600">
                내가 내리기 버튼을 누를 때만 내려옵니다.
              </span>
            </button>

            <button
              onClick={() => handleModeChange('relaxed')}
              className={`p-3 rounded-2xl border-2 text-left flex flex-col gap-1 transition-all ${
                settings.mode === 'relaxed'
                  ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-500/20'
                  : 'border-stone-200 bg-stone-50 hover:bg-stone-100'
              }`}
            >
              <span className="text-sm sm:text-base font-black text-stone-900">
                아주 느리게
              </span>
              <span className="text-xs text-stone-600">
                2.8초에 한 칸씩 천천히 떨어집니다.
              </span>
            </button>

            <button
              onClick={() => handleModeChange('normal')}
              className={`p-3 rounded-2xl border-2 text-left flex flex-col gap-1 transition-all ${
                settings.mode === 'normal'
                  ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-500/20'
                  : 'border-stone-200 bg-stone-50 hover:bg-stone-100'
              }`}
            >
              <span className="text-sm sm:text-base font-black text-stone-900">
                보통 느림
              </span>
              <span className="text-xs text-stone-600">
                1.6초에 한 칸씩 내려옵니다.
              </span>
            </button>

            <button
              onClick={() => handleModeChange('active')}
              className={`p-3 rounded-2xl border-2 text-left flex flex-col gap-1 transition-all ${
                settings.mode === 'active'
                  ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-500/20'
                  : 'border-stone-200 bg-stone-50 hover:bg-stone-100'
              }`}
            >
              <span className="text-sm sm:text-base font-black text-stone-900">
                활기찬 두뇌
              </span>
              <span className="text-xs text-stone-600">
                1.0초에 한 칸씩 내려옵니다.
              </span>
            </button>
          </div>
        </div>

        {/* 2. Block Complexity */}
        <div className="flex flex-col gap-2">
          <label className="text-sm sm:text-base font-black text-stone-900 flex items-center gap-2">
            <Eye className="w-5 h-5 text-indigo-600" />
            <span>블록 크기 및 난이도</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleComplexityChange('beginner')}
              className={`p-3 rounded-2xl border-2 text-left flex flex-col gap-1 transition-all ${
                settings.complexity === 'beginner'
                  ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-500/20'
                  : 'border-stone-200 bg-stone-50 hover:bg-stone-100'
              }`}
            >
              <span className="text-sm sm:text-base font-black text-stone-900">
                쉬운 블록 (2~3칸)
              </span>
              <span className="text-xs text-stone-600">
                작고 맞추기 쉬운 블록으로 편안하게 연습
              </span>
            </button>

            <button
              onClick={() => handleComplexityChange('standard')}
              className={`p-3 rounded-2xl border-2 text-left flex flex-col gap-1 transition-all ${
                settings.complexity === 'standard'
                  ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-500/20'
                  : 'border-stone-200 bg-stone-50 hover:bg-stone-100'
              }`}
            >
              <span className="text-sm sm:text-base font-black text-stone-900">
                표준 테트리스 (4칸)
              </span>
              <span className="text-xs text-stone-600">
                전통적인 7가지 모양의 블록 퍼즐
              </span>
            </button>
          </div>
        </div>

        {/* 3. Font Size */}
        <div className="flex flex-col gap-2">
          <label className="text-sm sm:text-base font-black text-stone-900 flex items-center gap-2">
            <Type className="w-5 h-5 text-stone-700" />
            <span>글자 크기</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['normal', 'large', 'huge'] as const).map(size => (
              <button
                key={size}
                onClick={() => handleFontSizeChange(size)}
                className={`py-2.5 px-3 rounded-xl border-2 font-bold transition-all ${
                  settings.fontSize === size
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                    : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                {size === 'normal' && '보통'}
                {size === 'large' && '크게'}
                {size === 'huge' && '아주 크게'}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Display & Sound Toggles */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={toggleVoice}
            className={`p-3 rounded-2xl border-2 flex items-center justify-between text-left transition-all ${
              settings.voiceEnabled
                ? 'border-emerald-600 bg-emerald-50'
                : 'border-stone-200 bg-stone-50 text-stone-500'
            }`}
          >
            <div>
              <span className="text-sm font-bold block text-stone-900">
                음성 칭찬 안내
              </span>
              <span className="text-xs text-stone-500">
                {settings.voiceEnabled ? '켜짐' : '꺼짐'}
              </span>
            </div>
            {settings.voiceEnabled ? (
              <Volume2 className="w-5 h-5 text-emerald-700" />
            ) : (
              <VolumeX className="w-5 h-5 text-stone-400" />
            )}
          </button>

          <button
            onClick={toggleSound}
            className={`p-3 rounded-2xl border-2 flex items-center justify-between text-left transition-all ${
              settings.soundEnabled
                ? 'border-emerald-600 bg-emerald-50'
                : 'border-stone-200 bg-stone-50 text-stone-500'
            }`}
          >
            <div>
              <span className="text-sm font-bold block text-stone-900">
                부드러운 효과음
              </span>
              <span className="text-xs text-stone-500">
                {settings.soundEnabled ? '켜짐' : '꺼짐'}
              </span>
            </div>
            {settings.soundEnabled ? (
              <Volume2 className="w-5 h-5 text-emerald-700" />
            ) : (
              <VolumeX className="w-5 h-5 text-stone-400" />
            )}
          </button>

          <button
            onClick={toggleHighContrast}
            className={`p-3 rounded-2xl border-2 flex items-center justify-between text-left transition-all ${
              settings.highContrast
                ? 'border-purple-600 bg-purple-50 text-purple-900'
                : 'border-stone-200 bg-stone-50 text-stone-700'
            }`}
          >
            <div>
              <span className="text-sm font-bold block text-stone-900">
                고대비 화면
              </span>
              <span className="text-xs text-stone-500">
                눈이 침침할 때 선명하게
              </span>
            </div>
            <Eye className="w-5 h-5 text-purple-700" />
          </button>

          <button
            onClick={toggleGhost}
            className={`p-3 rounded-2xl border-2 flex items-center justify-between text-left transition-all ${
              settings.showGhost
                ? 'border-blue-600 bg-blue-50 text-blue-900'
                : 'border-stone-200 bg-stone-50 text-stone-500'
            }`}
          >
            <div>
              <span className="text-sm font-bold block text-stone-900">
                착지 그림자 가이드
              </span>
              <span className="text-xs text-stone-500">
                떨어질 위치 미리보기
              </span>
            </div>
            <Eye className="w-5 h-5 text-blue-700" />
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black text-base sm:text-lg rounded-2xl transition-all shadow-md mt-2"
        >
          설정 저장하고 돌아가기
        </button>
      </div>
    </div>
  );
};
