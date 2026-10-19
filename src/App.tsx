import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  CellValue,
  GameMode,
  GameSettings,
  GameStats,
  Piece,
  AIHint,
} from './types/game';
import {
  BOARD_COLS,
  BOARD_ROWS,
  createEmptyBoard,
  getRandomPiece,
  checkCollision,
  getGhostPieceY,
  rotateMatrix,
  mergePieceToBoard,
  clearLines,
  rescueClearBottomRows,
  calculateBestPlacement,
} from './utils/tetris';
import { soundManager, ENCOURAGEMENT_PHRASES, getRandomPhrase } from './utils/audio';
import { HeaderBar } from './components/HeaderBar';
import { GameBoard } from './components/GameBoard';
import { ControlPad } from './components/ControlPad';
import { SideStatusPanel } from './components/SideStatusPanel';
import { BrainStatsModal } from './components/BrainStatsModal';
import { SettingsModal } from './components/SettingsModal';
import { TutorialModal } from './components/TutorialModal';
import { GameOverModal } from './components/GameOverModal';
import { Sparkles, HeartHandshake, ShieldCheck, HelpCircle } from 'lucide-react';

interface HistorySnapshot {
  board: CellValue[][];
  currentPiece: Piece | null;
  score: number;
  lines: number;
}

const DEFAULT_SETTINGS: GameSettings = {
  mode: 'turn', // Default to turn-based for seniors to eliminate time pressure!
  complexity: 'standard',
  highContrast: false,
  fontSize: 'large', // Senior-friendly default
  soundEnabled: true,
  voiceEnabled: true,
  showGhost: true,
  showGridLines: true,
  autoHint: false,
  vibration: true,
  volume: 0.7,
};

const STATS_STORAGE_KEY = 'senior_tetris_stats_v1';
const SETTINGS_STORAGE_KEY = 'senior_tetris_settings_v1';

export default function App() {
  // Settings & Modals
  const [settings, setSettings] = useState<GameSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [stats, setStats] = useState<GameStats>(() => {
    try {
      const saved = localStorage.getItem(STATS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      score: 0,
      linesCleared: 0,
      playTimeSeconds: 0,
      undosUsed: 0,
      hintsUsed: 0,
      gamesPlayed: 0,
      highestScore: 0,
      todayDate: new Date().toISOString().split('T')[0],
      stampsCount: 1,
    };
  });

  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

  // Core Game State
  const [board, setBoard] = useState<CellValue[][]>(() => createEmptyBoard());
  const [currentPiece, setCurrentPiece] = useState<Piece | null>(null);
  const [nextPiece, setNextPiece] = useState<Piece | null>(null);
  const [ghostY, setGhostY] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [clearingRows, setClearingRows] = useState<number[]>([]);
  const [hint, setHint] = useState<AIHint | null>(null);
  const [toastMessage, setToastMessage] = useState<string>('오늘도 즐겁고 건강하게 시작하세요!');

  // History for Undo (up to 6 steps)
  const historyRef = useRef<HistorySnapshot[]>([]);

  // Update soundManager config on setting changes
  useEffect(() => {
    soundManager.updateConfig(settings.soundEnabled, settings.voiceEnabled, settings.volume);
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  // Save cumulative stats
  useEffect(() => {
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
  }, [stats]);

  // Timer for play focus time tracking
  useEffect(() => {
    if (isPaused || isGameOver) return;
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        playTimeSeconds: prev.playTimeSeconds + 1,
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused, isGameOver]);

  // Compute ghost piece position whenever currentPiece or board changes
  useEffect(() => {
    if (currentPiece) {
      const y = getGhostPieceY(currentPiece, board);
      setGhostY(y);
    } else {
      setGhostY(null);
    }
  }, [currentPiece, board]);

  // Show a gentle toast encouragement message
  const triggerToast = useCallback((msg: string) => {
    setToastMessage(msg);
  }, []);

  // Save snapshot to history stack
  const saveSnapshot = useCallback(() => {
    historyRef.current.push({
      board: board.map(row => [...row]),
      currentPiece: currentPiece ? { ...currentPiece, shape: currentPiece.shape.map(r => [...r]) } : null,
      score,
      lines,
    });
    if (historyRef.current.length > 6) {
      historyRef.current.shift();
    }
  }, [board, currentPiece, score, lines]);

  // Start / Restart Game
  const startNewGame = useCallback(() => {
    const firstPiece = getRandomPiece(settings.complexity);
    const upcomingPiece = getRandomPiece(settings.complexity);

    setBoard(createEmptyBoard());
    setCurrentPiece(firstPiece);
    setNextPiece(upcomingPiece);
    setScore(0);
    setLines(0);
    setStreak(0);
    setIsPaused(false);
    setIsGameOver(false);
    setClearingRows([]);
    setHint(null);
    historyRef.current = [];

    setStats(prev => ({
      ...prev,
      gamesPlayed: prev.gamesPlayed + 1,
    }));

    const welcomeMsg = getRandomPhrase(ENCOURAGEMENT_PHRASES.start);
    triggerToast(welcomeMsg);
    soundManager.playCelebration();
    soundManager.speakEncouragement(welcomeMsg);
  }, [settings.complexity, triggerToast]);

  // Initialize on mount
  useEffect(() => {
    startNewGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Lock Piece & check line clears
  const lockPiece = useCallback(() => {
    if (!currentPiece) return;

    soundManager.playDrop();
    saveSnapshot();

    const mergedBoard = mergePieceToBoard(currentPiece, board);

    // Identify full lines
    const fullRows: number[] = [];
    for (let r = 0; r < BOARD_ROWS; r++) {
      if (mergedBoard[r].every(cell => cell !== null)) {
        fullRows.push(r);
      }
    }

    if (fullRows.length > 0) {
      // Line clear celebration!
      setClearingRows(fullRows);
      soundManager.playLineClear(fullRows.length);

      const phrase =
        fullRows.length > 1
          ? getRandomPhrase(ENCOURAGEMENT_PHRASES.lineClearMulti)
          : getRandomPhrase(ENCOURAGEMENT_PHRASES.lineClearSingle);

      triggerToast(phrase);
      soundManager.speakEncouragement(phrase);

      setTimeout(() => {
        const { newBoard, linesCleared } = clearLines(mergedBoard);
        setBoard(newBoard);
        setClearingRows([]);

        const points = linesCleared * 100 * (streak + 1);
        setScore(prev => {
          const newScore = prev + points;
          setStats(s => ({
            ...s,
            highestScore: Math.max(s.highestScore, newScore),
            linesCleared: s.linesCleared + linesCleared,
          }));
          return newScore;
        });
        setLines(prev => prev + linesCleared);
        setStreak(prev => prev + 1);

        // Spawn next piece
        spawnNextPiece(newBoard);
      }, 250);
    } else {
      setStreak(0);
      setBoard(mergedBoard);
      spawnNextPiece(mergedBoard);
    }
  }, [currentPiece, board, saveSnapshot, streak, triggerToast]);

  // Spawn Next Piece
  const spawnNextPiece = useCallback(
    (currentBoard: CellValue[][]) => {
      const next = nextPiece || getRandomPiece(settings.complexity);
      const upcoming = getRandomPiece(settings.complexity);

      // Check if top row blocked (game over condition)
      if (checkCollision(next, currentBoard, { x: 0, y: 0 })) {
        setIsGameOver(true);
        soundManager.playCelebration();
        soundManager.speakEncouragement('오늘의 두뇌 체조를 훌륭하게 마치셨습니다! 참 잘하셨습니다.');
        return;
      }

      setCurrentPiece(next);
      setNextPiece(upcoming);
      setHint(null);
    },
    [nextPiece, settings.complexity]
  );

  // Movement Handlers
  const handleMoveLeft = useCallback(() => {
    if (!currentPiece || isPaused || isGameOver) return;
    if (!checkCollision(currentPiece, board, { x: -1, y: 0 })) {
      setCurrentPiece(prev => prev ? { ...prev, x: prev.x - 1 } : null);
      soundManager.playMove();
    }
  }, [currentPiece, board, isPaused, isGameOver]);

  const handleMoveRight = useCallback(() => {
    if (!currentPiece || isPaused || isGameOver) return;
    if (!checkCollision(currentPiece, board, { x: 1, y: 0 })) {
      setCurrentPiece(prev => prev ? { ...prev, x: prev.x + 1 } : null);
      soundManager.playMove();
    }
  }, [currentPiece, board, isPaused, isGameOver]);

  const handleRotate = useCallback(() => {
    if (!currentPiece || isPaused || isGameOver) return;

    const rotatedShape = rotateMatrix(currentPiece.shape);
    const rotatedPiece: Piece = {
      ...currentPiece,
      shape: rotatedShape,
    };

    // Try normal rotation
    if (!checkCollision(rotatedPiece, board, { x: 0, y: 0 })) {
      setCurrentPiece(rotatedPiece);
      soundManager.playRotate();
      return;
    }

    // Wall kick left
    if (!checkCollision(rotatedPiece, board, { x: -1, y: 0 })) {
      setCurrentPiece({ ...rotatedPiece, x: rotatedPiece.x - 1 });
      soundManager.playRotate();
      return;
    }

    // Wall kick right
    if (!checkCollision(rotatedPiece, board, { x: 1, y: 0 })) {
      setCurrentPiece({ ...rotatedPiece, x: rotatedPiece.x + 1 });
      soundManager.playRotate();
      return;
    }
  }, [currentPiece, board, isPaused, isGameOver]);

  const handleSoftDrop = useCallback(() => {
    if (!currentPiece || isPaused || isGameOver) return;

    if (!checkCollision(currentPiece, board, { x: 0, y: 1 })) {
      setCurrentPiece(prev => prev ? { ...prev, y: prev.y + 1 } : null);
      soundManager.playMove();
    } else {
      lockPiece();
    }
  }, [currentPiece, board, isPaused, isGameOver, lockPiece]);

  const handleHardDrop = useCallback(() => {
    if (!currentPiece || isPaused || isGameOver || ghostY === null) return;
    setCurrentPiece({ ...currentPiece, y: ghostY });
    setTimeout(() => {
      lockPiece();
    }, 40);
  }, [currentPiece, isPaused, isGameOver, ghostY, lockPiece]);

  // Undo (한 수 무르기)
  const handleUndo = useCallback(() => {
    if (historyRef.current.length === 0 || isPaused || isGameOver) return;
    const last = historyRef.current.pop();
    if (last) {
      setBoard(last.board);
      setCurrentPiece(last.currentPiece);
      setScore(last.score);
      setLines(last.lines);
      setHint(null);

      setStats(prev => ({
        ...prev,
        undosUsed: prev.undosUsed + 1,
      }));

      soundManager.playUndo();
      const phrase = getRandomPhrase(ENCOURAGEMENT_PHRASES.undoUsed);
      triggerToast(phrase);
      soundManager.speakEncouragement(phrase);
    }
  }, [isPaused, isGameOver, triggerToast]);

  // AI Hint (추천 위치 힌트)
  const handleHint = useCallback(() => {
    if (!currentPiece || isPaused || isGameOver) return;

    const bestPlacement = calculateBestPlacement(currentPiece, board);
    if (bestPlacement) {
      setHint(bestPlacement);

      // Rotate shape to the recommended rotation
      let recommendedShape = currentPiece.shape;
      for (let r = 0; r < bestPlacement.rotation; r++) {
        recommendedShape = rotateMatrix(recommendedShape);
      }

      // Position the piece directly above the best placement for the senior
      setCurrentPiece({
        ...currentPiece,
        shape: recommendedShape,
        x: bestPlacement.x,
      });

      setStats(prev => ({
        ...prev,
        hintsUsed: prev.hintsUsed + 1,
      }));

      soundManager.playHint();
      const phrase = getRandomPhrase(ENCOURAGEMENT_PHRASES.hintUsed);
      triggerToast(`추천 자리로 맞추었습니다! 편하게 내려보세요.`);
      soundManager.speakEncouragement(phrase);
    }
  }, [currentPiece, board, isPaused, isGameOver, triggerToast]);

  // Emergency Rescue (두뇌 활력 찬스 - 맨 아래 줄 비우기)
  const handleRescue = useCallback(() => {
    if (isPaused || isGameOver) return;
    const rescuedBoard = rescueClearBottomRows(board, 2);
    setBoard(rescuedBoard);
    soundManager.playLineClear(1);
    const phrase = getRandomPhrase(ENCOURAGEMENT_PHRASES.rescueUsed);
    triggerToast(phrase);
    soundManager.speakEncouragement(phrase);
  }, [board, isPaused, isGameOver, triggerToast]);

  // Pause / Resume
  const handleTogglePause = useCallback(() => {
    setIsPaused(prev => {
      const next = !prev;
      if (next) {
        soundManager.speakEncouragement('잠시 멈추었습니다. 편안히 쉬어가세요.');
      }
      return next;
    });
  }, []);

  // Automatic Fall Loop (if not in turn-based mode)
  useEffect(() => {
    if (settings.mode === 'turn' || isPaused || isGameOver || !currentPiece) {
      return;
    }

    let intervalMs = 2800; // default relaxed
    if (settings.mode === 'relaxed') intervalMs = 2800;
    else if (settings.mode === 'normal') intervalMs = 1600;
    else if (settings.mode === 'active') intervalMs = 1000;

    const timer = setInterval(() => {
      handleSoftDrop();
    }, intervalMs);

    return () => clearInterval(timer);
  }, [settings.mode, isPaused, isGameOver, currentPiece, handleSoftDrop]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isGameOver) return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          handleMoveLeft();
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleMoveRight();
          break;
        case 'ArrowUp':
        case 'z':
        case 'Z':
          e.preventDefault();
          handleRotate();
          break;
        case 'ArrowDown':
          e.preventDefault();
          handleSoftDrop();
          break;
        case ' ':
          e.preventDefault();
          handleHardDrop();
          break;
        case 'u':
        case 'U':
          e.preventDefault();
          handleUndo();
          break;
        case 'h':
        case 'H':
          e.preventDefault();
          handleHint();
          break;
        case 'p':
        case 'P':
          e.preventDefault();
          handleTogglePause();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isGameOver,
    handleMoveLeft,
    handleMoveRight,
    handleRotate,
    handleSoftDrop,
    handleHardDrop,
    handleUndo,
    handleHint,
    handleTogglePause,
  ]);

  // Dynamic root font scale based on settings
  const getFontSizeClass = () => {
    if (settings.fontSize === 'huge') return 'text-xl';
    if (settings.fontSize === 'large') return 'text-lg';
    return 'text-base';
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors ${
        settings.highContrast
          ? 'bg-black text-white'
          : 'bg-stone-100 text-stone-900'
      } ${getFontSizeClass()}`}
    >
      {/* 3-Zone Header Bar compliant with Top Bar Contract */}
      <HeaderBar
        onOpenStats={() => setIsStatsOpen(true)}
        onOpenTutorial={() => setIsTutorialOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onRestartGame={startNewGame}
      />

      {/* Warm Floating Encouragement Banner */}
      <div className="w-full bg-emerald-700 text-white py-2 px-4 shadow-sm flex items-center justify-center text-center gap-2">
        <Sparkles className="w-5 h-5 text-amber-300 shrink-0 fill-current" />
        <span className="font-extrabold text-sm sm:text-base tracking-wide">
          {toastMessage}
        </span>
      </div>

      {/* Main Play Area */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-6 flex flex-col items-center justify-between">
        <div className="w-full flex flex-col lg:flex-row items-center lg:items-start justify-center gap-6 sm:gap-10">
          {/* Left/Center: Main Board */}
          <div className="flex flex-col items-center">
            {isPaused && (
              <div className="mb-2 px-4 py-1.5 bg-blue-100 text-blue-900 rounded-full text-sm font-black flex items-center gap-1.5">
                <span>⏸ 편안히 쉬시는 중입니다. 준비되면 계속하기를 누르세요.</span>
              </div>
            )}
            <GameBoard
              board={board}
              currentPiece={currentPiece}
              ghostY={ghostY}
              hint={hint}
              showGhost={settings.showGhost}
              clearingRows={clearingRows}
              highContrast={settings.highContrast}
            />
          </div>

          {/* Right: Side Status & Large Touch Controls */}
          <div className="w-full max-w-md flex flex-col items-center lg:items-start gap-4">
            {/* Quick Status Bar on mobile / Full side panel on desktop */}
            <div className="w-full flex justify-center">
              <SideStatusPanel
                nextPiece={nextPiece}
                score={score}
                lines={lines}
                mode={settings.mode}
                playTimeMinutes={Math.floor(stats.playTimeSeconds / 60)}
                streak={streak}
                onOpenSettings={() => setIsSettingsOpen(true)}
              />
            </div>

            {/* Giant Senior-Friendly Touch Control Pad */}
            <ControlPad
              onMoveLeft={handleMoveLeft}
              onMoveRight={handleMoveRight}
              onRotate={handleRotate}
              onSoftDrop={handleSoftDrop}
              onHardDrop={handleHardDrop}
              onUndo={handleUndo}
              onHint={handleHint}
              onRescue={handleRescue}
              onTogglePause={handleTogglePause}
              isPaused={isPaused}
              canUndo={historyRef.current.length > 0}
              isTurnMode={settings.mode === 'turn'}
            />
          </div>
        </div>

        {/* Gentle Senior Reassurance Footer */}
        <footer className="mt-6 w-full max-w-3xl pt-4 border-t border-stone-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-stone-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>어르신의 눈과 마음에 맞춘 편안한 인지 활력 공간입니다.</span>
          </div>
          <div className="flex items-center gap-4 font-semibold">
            <button
              onClick={() => setIsTutorialOpen(true)}
              className="hover:text-emerald-700 transition-colors"
            >
              놀이 방법 다시보기
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsStatsOpen(true)}
              className="hover:text-emerald-700 transition-colors"
            >
              오늘의 두뇌 건강 도장
            </button>
          </div>
        </footer>
      </main>

      {/* Modals */}
      <BrainStatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        stats={stats}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
      />

      <TutorialModal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
      />

      <GameOverModal
        isOpen={isGameOver}
        score={score}
        lines={lines}
        playTimeMinutes={Math.floor(stats.playTimeSeconds / 60)}
        onRestart={startNewGame}
        onViewStats={() => {
          setIsGameOver(false);
          setIsStatsOpen(true);
        }}
      />
    </div>
  );
}
