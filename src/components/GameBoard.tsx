import React from 'react';
import { AIHint, CellValue, Piece } from '../types/game';
import { BOARD_COLS, BOARD_ROWS } from '../utils/tetris';

interface GameBoardProps {
  board: CellValue[][];
  currentPiece: Piece | null;
  ghostY: number | null;
  hint: AIHint | null;
  showGhost: boolean;
  clearingRows: number[];
  highContrast: boolean;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  board,
  currentPiece,
  ghostY,
  hint,
  showGhost,
  clearingRows,
  highContrast,
}) => {
  // Render grid cell matrix
  const renderCell = (r: number, c: number) => {
    let cellColor = '';
    let cellBorder = '';
    let cellSymbol = '';
    let isCurrent = false;
    let isGhost = false;
    let isHint = false;
    const isClearing = clearingRows.includes(r);

    // 1. Check current piece cell
    if (currentPiece) {
      const pieceY = r - currentPiece.y;
      const pieceX = c - currentPiece.x;
      if (
        pieceY >= 0 &&
        pieceY < currentPiece.shape.length &&
        pieceX >= 0 &&
        pieceX < currentPiece.shape[pieceY].length &&
        currentPiece.shape[pieceY][pieceX] !== 0
      ) {
        cellColor = currentPiece.color;
        cellBorder = currentPiece.borderColor;
        cellSymbol = currentPiece.symbol;
        isCurrent = true;
      }
    }

    // 2. Check ghost piece cell
    if (!isCurrent && showGhost && currentPiece && ghostY !== null && ghostY !== currentPiece.y) {
      const ghostPieceY = r - ghostY;
      const ghostPieceX = c - currentPiece.x;
      if (
        ghostPieceY >= 0 &&
        ghostPieceY < currentPiece.shape.length &&
        ghostPieceX >= 0 &&
        ghostPieceX < currentPiece.shape[ghostPieceY].length &&
        currentPiece.shape[ghostPieceY][ghostPieceX] !== 0
      ) {
        isGhost = true;
        cellSymbol = currentPiece.symbol;
      }
    }

    // 3. Check hint cell (if hint active)
    if (!isCurrent && !isGhost && hint && currentPiece) {
      // The hint specifies rotation and x.
      // If hint is visible, we can display a gentle guide outline
    }

    // 4. Check placed board cell
    const placedCell = board[r][c];
    if (placedCell && !isCurrent) {
      cellColor = placedCell.color;
      cellBorder = placedCell.borderColor;
      cellSymbol = placedCell.symbol;
    }

    const hasBlock = Boolean(cellColor || isGhost);

    return (
      <div
        key={`${r}-${c}`}
        className={`relative aspect-square flex items-center justify-center rounded-md select-none transition-colors duration-150 ${
          isClearing
            ? 'bg-amber-300 animate-pulse scale-95 shadow-lg'
            : isCurrent
            ? 'shadow-md ring-1 ring-white/50'
            : isGhost
            ? 'bg-emerald-50/70 border-2 border-dashed border-emerald-500/60'
            : hasBlock
            ? 'shadow-sm'
            : highContrast
            ? 'bg-stone-900 border border-stone-800'
            : 'bg-stone-100/80 border border-stone-200/60'
        }`}
        style={{
          backgroundColor: isClearing
            ? undefined
            : isGhost
            ? undefined
            : cellColor || undefined,
          borderColor: isGhost
            ? undefined
            : highContrast && cellBorder
            ? '#FFFFFF'
            : cellBorder || undefined,
        }}
      >
        {cellSymbol && (
          <span
            className={`font-black pointer-events-none ${
              isGhost
                ? 'text-emerald-700/60 text-sm sm:text-base font-bold'
                : 'text-white text-base sm:text-lg drop-shadow-md'
            }`}
          >
            {cellSymbol}
          </span>
        )}

        {/* Tactile block top-edge highlight for clarity */}
        {hasBlock && !isGhost && (
          <div className="absolute top-0 inset-x-0 h-1 bg-white/30 rounded-t-md pointer-events-none" />
        )}
      </div>
    );
  };

  // Check if pile is getting high (rows 0..3 occupied)
  const isNearDanger = board.slice(0, 4).some(row => row.some(cell => cell !== null));

  return (
    <div className="relative flex flex-col items-center">
      {/* Visual danger warning if pile is high */}
      {isNearDanger && (
        <div className="mb-2 px-3 py-1 bg-amber-100 text-amber-900 rounded-lg text-sm font-bold flex items-center gap-1.5 animate-bounce">
          <span>⚠️ 블록이 높이 쌓였습니다! 아래 '활력 찬스'를 눌러 줄을 비워보세요.</span>
        </div>
      )}

      {/* Main Board Container with tactile wooden/slate border */}
      <div
        className={`p-2.5 sm:p-3.5 rounded-2xl border-4 ${
          highContrast
            ? 'bg-black border-stone-700 ring-2 ring-emerald-400'
            : 'bg-stone-50 border-stone-300 shadow-xl'
        }`}
      >
        <div
          className="grid gap-1 sm:gap-1.5"
          style={{
            gridTemplateColumns: `repeat(${BOARD_COLS}, minmax(0, 1fr))`,
            width: 'min(86vw, 360px)',
          }}
        >
          {Array.from({ length: BOARD_ROWS }).map((_, r) =>
            Array.from({ length: BOARD_COLS }).map((_, c) => renderCell(r, c))
          )}
        </div>
      </div>
    </div>
  );
};
