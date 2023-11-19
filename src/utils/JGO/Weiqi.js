class Weiqi {
  constructor(size) {
    this.boardSize = size;
    this.board = Array(size)
      .fill(null)
      .map(() => Array(size).fill(0));
    this.currentPlayer = 1;
    this.nextBoard = Array(size)
      .fill(null)
      .map(() => Array(size).fill(0));
    this.previousBoards = [null, null];
  }
  // Add a method to deep copy the board
  copyBoard(board) {
    return board.map((row) => row.slice());
  }

  setBoard(board) {
    this.board = board;
  }

  setCurrentPlayer(currentPlayer) {
    this.currentPlayer = currentPlayer;
  }

  compareBoards(board1, board2) {
    for (let row = 0; row < this.boardSize; row++) {
      for (let col = 0; col < this.boardSize; col++) {
        if (board1[row][col] !== board2[row][col]) {
          return false;
        }
      }
    }
    return true;
  }

  captureOpponentStone(row, col) {
    const opponentPlayer = -this.currentPlayer;
    let capturedStones = 0;

    // 檢查四周是否有對手棋子
    const neighbors = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];
    for (const [dx, dy] of neighbors) {
      const r = row + dx;
      const c = col + dy;
      if (r < 0 || r >= this.boardSize || c < 0 || c >= this.boardSize) {
        continue; // 超出邊界
      }
      if (this.nextBoard[r][c] === opponentPlayer) {
        const [group, liberties] = this.getGroupAndLiberties(r, c);
        if (liberties === 0) {
          // 被提子了
          capturedStones += group.length;
          for (const [r, c] of group) {
            this.nextBoard[r][c] = 0;
          }
        }
      }
    }

    return capturedStones;
  }

  getGroupAndLiberties(row, col) {
    const player = this.nextBoard[row][col];
    const visited = Array(this.boardSize)
      .fill(false)
      .map(() => Array(this.boardSize).fill(false));
    const queue = [[row, col]];
    const group = [];
    let liberties = 0;

    while (queue.length > 0) {
      const [r, c] = queue.shift();
      if (visited[r][c]) {
        continue;
      }
      visited[r][c] = true;
      if (this.nextBoard[r][c] === 0) {
        liberties++;
      } else if (this.nextBoard[r][c] === player) {
        group.push([r, c]);
        queue.push(...this.getNeighbors(r, c));
      }
    }

    return [group, liberties];
  }

  getNeighbors(row, col) {
    const neighbors = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];
    const result = [];
    for (const [dx, dy] of neighbors) {
      const r = row + dx;
      const c = col + dy;
      if (r >= 0 && r < this.boardSize && c >= 0 && c < this.boardSize) {
        result.push([r, c]);
      }
    }
    return result;
  }

  placeStone(row, col) {
    if (
      row >= 0 &&
      row < this.boardSize &&
      col >= 0 &&
      col < this.boardSize &&
      this.board[row][col] === 0
    ) {
      this.nextBoard = this.copyBoard(this.board); // Use the copyBoard method
      this.nextBoard[row][col] = this.currentPlayer;

      // 判定提子
      const capturedStones = this.captureOpponentStone(row, col);
      if (capturedStones === 0) {
        const [_, liberties] = this.getGroupAndLiberties(row, col);
        if (liberties === 0) {
          // 落子無效，因為會造成自殺
          return false;
        }
      }

      if (
        this.previousBoards[0] &&
        this.compareBoards(this.nextBoard, this.previousBoards[0])
      ) {
        // Board state has been repeated
        return false;
      }

      this.previousBoards.shift(); // Remove the oldest previous board state
      this.previousBoards.push(this.nextBoard); // Add the current board state to the previousBoards array

      this.board = this.nextBoard;
      this.currentPlayer = -this.currentPlayer;
      return true;
    }
    return false;
  }

  getBoard() {
    return this.board;
  }

  getCurrentPlayer() {
    return this.currentPlayer;
  }
}

export default Weiqi;
