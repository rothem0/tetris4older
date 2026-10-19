import { AIHint, BlockComplexity, CellValue, Piece } from '../types/game';

export const BOARD_COLS = 10;
export const BOARD_ROWS = 16; // 16 rows is ideal for senior screens (fits neatly in viewport with large controls)

// Standard 7 Tetrominoes with High-Contrast Colors, clear borders, and tactile symbols
export const STANDARD_PIECES = [
  {
    name: 'I',
    symbol: '●', // Circle
    color: '#0284C7', // Vivid Sky Blue
    borderColor: '#0369A1',
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ]
  },
  {
    name: 'O',
    symbol: '■', // Square
    color: '#EAB308', // Warm Amber/Yellow
    borderColor: '#CA8A04',
    shape: [
      [1, 1],
      [1, 1]
    ]
  },
  {
    name: 'T',
    symbol: '▲', // Triangle
    color: '#9333EA', // Vivid Purple
    borderColor: '#7E22CE',
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0]
    ]
  },
  {
    name: 'L',
    symbol: '★', // Star
    color: '#EA580C', // Bright Orange
    borderColor: '#C2410C',
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0]
    ]
  },
  {
    name: 'J',
    symbol: '◆', // Diamond
    color: '#2563EB', // Royal Blue
    borderColor: '#1D4ED8',
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0]
    ]
  },
  {
    name: 'S',
    symbol: '♥', // Heart
    color: '#16A34A', // Forest Green
    borderColor: '#15803D',
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0]
    ]
  },
  {
    name: 'Z',
    symbol: '♣', // Clover
    color: '#DC2626', // Crimson Red
    borderColor: '#B91C1C',
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0]
    ]
  }
];

// Beginner Friendly 2~3 cell blocks for mild cognitive impairment & easy learning
export const BEGINNER_PIECES = [
  {
    name: 'Domino-H',
    symbol: '●',
    color: '#0284C7',
    borderColor: '#0369A1',
    shape: [
      [1, 1]
    ]
  },
  {
    name: 'Domino-V',
    symbol: '■',
    color: '#EAB308',
    borderColor: '#CA8A04',
    shape: [
      [1],
      [1]
    ]
  },
  {
    name: 'Trio-Bar',
    symbol: '★',
    color: '#16A34A',
    borderColor: '#15803D',
    shape: [
      [1, 1, 1]
    ]
  },
  {
    name: 'Trio-Corner',
    symbol: '♥',
    color: '#DC2626',
    borderColor: '#B91C1C',
    shape: [
      [1, 0],
      [1, 1]
    ]
  },
  {
    name: 'Square-2x2',
    symbol: '◆',
    color: '#9333EA',
    borderColor: '#7E22CE',
    shape: [
      [1, 1],
      [1, 1]
    ]
  },
  {
    name: 'Single',
    symbol: '▲',
    color: '#0D9488',
    borderColor: '#0F766E',
    shape: [
      [1]
    ]
  }
];

export function createEmptyBoard(rows = BOARD_ROWS, cols = BOARD_COLS): CellValue[][] {
  return Array.from({ length: rows }, () => Array(cols).fill(null));
}

export function getRandomPiece(complexity: BlockComplexity = 'standard'): Piece {
  const pieceDefs = complexity === 'beginner' ? BEGINNER_PIECES : STANDARD_PIECES;
  const def = pieceDefs[Math.floor(Math.random() * pieceDefs.length)];
  
  // Center horizontally
  const x = Math.floor((BOARD_COLS - def.shape[0].length) / 2);
  const y = 0;

  return {
    shape: def.shape.map(row => [...row]),
    color: def.color,
    borderColor: def.borderColor,
    symbol: def.symbol,
    name: def.name,
    x,
    y
  };
}

export function rotateMatrix(matrix: number[][]): number[][] {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const result: number[][] = [];

  for (let c = 0; c < cols; c++) {
    const newRow: number[] = [];
    for (let r = rows - 1; r >= 0; r--) {
      newRow.push(matrix[r][c]);
    }
    result.push(newRow);
  }

  return result;
}

export function checkCollision(piece: Piece, board: CellValue[][], offset = { x: 0, y: 0 }): boolean {
  const shape = piece.shape;
  const targetX = piece.x + offset.x;
  const targetY = piece.y + offset.y;

  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c] !== 0) {
        const boardX = targetX + c;
        const boardY = targetY + r;

        // Check horizontal bounds
        if (boardX < 0 || boardX >= BOARD_COLS) {
          return true;
        }

        // Check vertical bounds
        if (boardY >= BOARD_ROWS) {
          return true;
        }

        // Check collision with placed blocks (if boardY >= 0)
        if (boardY >= 0 && board[boardY] && board[boardY][boardX] !== null) {
          return true;
        }
      }
    }
  }

  return false;
}

/**
 * Calculates ghost position where the piece will land
 */
export function getGhostPieceY(piece: Piece, board: CellValue[][]): number {
  let ghostY = piece.y;
  while (!checkCollision(piece, board, { x: 0, y: ghostY - piece.y + 1 })) {
    ghostY++;
  }
  return ghostY;
}

/**
 * Merges piece into board
 */
export function mergePieceToBoard(piece: Piece, board: CellValue[][]): CellValue[][] {
  const newBoard = board.map(row => [...row]);

  for (let r = 0; r < piece.shape.length; r++) {
    for (let c = 0; c < piece.shape[r].length; c++) {
      if (piece.shape[r][c] !== 0) {
        const boardY = piece.y + r;
        const boardX = piece.x + c;
        if (boardY >= 0 && boardY < BOARD_ROWS && boardX >= 0 && boardX < BOARD_COLS) {
          newBoard[boardY][boardX] = {
            filled: true,
            color: piece.color,
            borderColor: piece.borderColor,
            symbol: piece.symbol
          };
        }
      }
    }
  }

  return newBoard;
}

/**
 * Clears full lines and returns new board and cleared count
 */
export function clearLines(board: CellValue[][]): { newBoard: CellValue[][]; linesCleared: number } {
  const remainingRows = board.filter(row => row.some(cell => cell === null));
  const linesCleared = BOARD_ROWS - remainingRows.length;

  if (linesCleared === 0) {
    return { newBoard: board, linesCleared: 0 };
  }

  const emptyRows = Array.from({ length: linesCleared }, () => Array(BOARD_COLS).fill(null));
  const newBoard = [...emptyRows, ...remainingRows];

  return { newBoard, linesCleared };
}

/**
 * Senior rescue: clears bottom row or bottom-most occupied row to alleviate stress
 */
export function rescueClearBottomRows(board: CellValue[][], count = 1): CellValue[][] {
  const newBoard = board.map(row => [...row]);
  // Find rows with blocks and remove bottom-most
  let removed = 0;
  for (let r = BOARD_ROWS - 1; r >= 0 && removed < count; r--) {
    if (newBoard[r].some(cell => cell !== null)) {
      newBoard.splice(r, 1);
      newBoard.unshift(Array(BOARD_COLS).fill(null));
      removed++;
      r++; // recheck same index as rows shifted
    }
  }
  return newBoard;
}

/**
 * AI Hint Solver: Evaluates positions to provide senior assistance
 */
export function calculateBestPlacement(piece: Piece, board: CellValue[][]): AIHint | null {
  let bestScore = -Infinity;
  let bestHint: AIHint | null = null;

  // Test up to 4 rotations
  let currentShape = piece.shape.map(r => [...r]);
  for (let rot = 0; rot < 4; rot++) {
    const pieceWidth = currentShape[0].length;

    for (let x = -2; x <= BOARD_COLS - pieceWidth + 2; x++) {
      const testPiece: Piece = {
        ...piece,
        shape: currentShape,
        x,
        y: 0
      };

      if (checkCollision(testPiece, board, { x: 0, y: 0 })) {
        continue;
      }

      // Drop to bottom
      const landY = getGhostPieceY(testPiece, board);
      const landedPiece = { ...testPiece, y: landY };

      // Evaluate board score if placed here
      const tempBoard = mergePieceToBoard(landedPiece, board);
      const score = evaluateBoardState(tempBoard);

      if (score > bestScore) {
        bestScore = score;
        bestHint = {
          x,
          rotation: rot,
          score
        };
      }
    }

    currentShape = rotateMatrix(currentShape);
  }

  return bestHint;
}

function evaluateBoardState(board: CellValue[][]): number {
  let linesCleared = 0;
  let aggregateHeight = 0;
  let holes = 0;
  let bumpiness = 0;

  const columnHeights = Array(BOARD_COLS).fill(0);

  // Compute column heights and line clears
  for (let c = 0; c < BOARD_COLS; c++) {
    for (let r = 0; r < BOARD_ROWS; r++) {
      if (board[r][c] !== null) {
        columnHeights[c] = BOARD_ROWS - r;
        break;
      }
    }
  }

  // Count holes (empty cell beneath a filled cell)
  for (let c = 0; c < BOARD_COLS; c++) {
    let blockFound = false;
    for (let r = 0; r < BOARD_ROWS; r++) {
      if (board[r][c] !== null) {
        blockFound = true;
      } else if (blockFound && board[r][c] === null) {
        holes++;
      }
    }
  }

  // Count full lines
  for (let r = 0; r < BOARD_ROWS; r++) {
    if (board[r].every(cell => cell !== null)) {
      linesCleared++;
    }
  }

  // Aggregate height & bumpiness
  for (let c = 0; c < BOARD_COLS; c++) {
    aggregateHeight += columnHeights[c];
    if (c < BOARD_COLS - 1) {
      bumpiness += Math.abs(columnHeights[c] - columnHeights[c + 1]);
    }
  }

  // Heuristic weights tuned for clean, easy stacking
  return (
    linesCleared * 120 -
    aggregateHeight * 4.5 -
    holes * 38 -
    bumpiness * 3.5
  );
}
