const config = require('./gameConfig');
const Board = require('./board');

class ConwayGame {
  constructor() {
    this.numOfRows = config.BOARD_NUM_OF_ROWS;
    this.numOfColumns = config.BOARD_NUM_OF_COLUMNS;
    this.board = new Board(this);
    this.players = [];
    this.winner = null;
    this.currentPlayer = 0; // Track whose turn it is
    this.board.updateMap();
  }

  addPlayer(playerData) {
    if (this.players.length >= 2) {
      throw new Error('Maximum number of players reached');
    }
    const player = {
      id: playerData.id,
      name: playerData.name,
      color: this.players.length === 0 ? 'blue' : 'red',
      score: 0,
      cells: new Set() // Track cells owned by this player
    };
    this.players.push(player);
    this.board.updateMap();
  }

  processMoves(moves) {
    moves.forEach(move => {
      const player = this.players.find(p => p.id === move.playerId);
      if (!player) return;
      
      // Process cell placement
      const cell = { row: move.row, column: move.column };
      if (this.isValidCell(cell)) {
        this.board.setCell(cell.row, cell.column, {
          type: 'live',
          playerName: player.name,
          color: player.color
        });
        player.cells.add(`${cell.row},${cell.column}`);
      }
    });

    // Apply Conway's rules and update the board
    this.evolveBoard();
    this.updateScores();
    this.checkGameOver();
    this.board.updateMap();
  }

  evolveBoard() {
    const newBoard = Array(this.numOfRows).fill(null)
      .map(() => Array(this.numOfColumns).fill(null));

    for (let row = 0; row < this.numOfRows; row++) {
      for (let col = 0; col < this.numOfColumns; col++) {
        const neighbors = this.countNeighbors(row, col);
        const currentCell = this.board.getCell(row, col);
        
        if (currentCell && currentCell.type === 'live') {
          // Survival rules
          if (neighbors.total === 2 || neighbors.total === 3) {
            newBoard[row][col] = {
              type: 'live',
              playerName: currentCell.playerName,
              color: currentCell.color
            };
          }
        } else {
          // Birth rules
          if (neighbors.total === 3) {
            // Determine cell ownership based on majority
            const dominantPlayer = this.getDominantPlayer(neighbors);
            if (dominantPlayer) {
              newBoard[row][col] = {
                type: 'live',
                playerName: dominantPlayer.name,
                color: dominantPlayer.color
              };
            }
          }
        }
      }
    }

    // Update the board state
    this.board.map = newBoard;
  }

  countNeighbors(row, col) {
    const neighbors = {
      total: 0,
      [this.players[0].name]: 0,
      [this.players[1].name]: 0
    };

    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;

        const newRow = row + i;
        const newCol = col + j;

        if (this.isValidPosition(newRow, newCol)) {
          const cell = this.board.getCell(newRow, newCol);
          if (cell && cell.type === 'live') {
            neighbors.total++;
            neighbors[cell.playerName]++;
          }
        }
      }
    }

    return neighbors;
  }

  getDominantPlayer(neighbors) {
    if (neighbors[this.players[0].name] > neighbors[this.players[1].name]) {
      return this.players[0];
    } else if (neighbors[this.players[1].name] > neighbors[this.players[0].name]) {
      return this.players[1];
    }
    return null; // No dominant player
  }

  updateScores() {
    // Reset scores and recalculate based on current board state
    this.players.forEach(player => {
      player.score = 0;
      player.cells.clear();
    });

    for (let row = 0; row < this.numOfRows; row++) {
      for (let col = 0; col < this.numOfColumns; col++) {
        const cell = this.board.getCell(row, col);
        if (cell && cell.type === 'live') {
          const player = this.players.find(p => p.name === cell.playerName);
          if (player) {
            player.score++;
            player.cells.add(`${row},${col}`);
          }
        }
      }
    }
  }

  checkGameOver() {
    // Game ends if one player has no living cells or after a certain number of moves
    const deadPlayer = this.players.find(player => player.score === 0);
    if (deadPlayer) {
      this.winner = this.players.find(player => player.id !== deadPlayer.id).name;
    }
  }

  isValidCell(cell) {
    return this.isValidPosition(cell.row, cell.column) &&
           !this.board.getCell(cell.row, cell.column);
  }

  isValidPosition(row, col) {
    return row >= 0 && row < this.numOfRows &&
           col >= 0 && col < this.numOfColumns;
  }
}

module.exports = {
  ConwayGame
};
