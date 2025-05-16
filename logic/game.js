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
    this.generation = 0; // Track current generation
    this.maxGenerations = 1000; // Game ends after 1000 generations
    this.cellsPerTurn = 5; // Number of cells each player can place per turn
    this.board.updateMap();
    console.log('Game initialized - Players can place', this.cellsPerTurn, 'cells per turn');
    this.startingCells = config.STARTING_CELLS || 50;
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
    // Group moves by player
    const movesByPlayer = {};
    moves.forEach(move => {
      if (!movesByPlayer[move.playerId]) {
        movesByPlayer[move.playerId] = [];
      }
      movesByPlayer[move.playerId].push(move);
    });

    // Determine the order of processing based on the current turn
    const playerOrder = this.generation % 2 === 0 ? this.players : [...this.players].reverse();

    // Process moves for each player, respecting cell placement limit
    playerOrder.forEach(player => {
      const playerMoves = movesByPlayer[player.id] || [];
      console.log(`Processing moves for ${player.name}:`);

      // Only process up to the cell placement limit
      const validMoves = playerMoves.slice(0, this.cellsPerTurn);
      if (playerMoves.length > this.cellsPerTurn) {
        console.log(`Warning: ${player.name} attempted to place ${playerMoves.length} cells, limit is ${this.cellsPerTurn}`);
      }

      validMoves.forEach(move => {
        const cell = { row: move.row, column: move.column };
        if (this.isValidCell(cell)) {
          this.board.setCell(cell.row, cell.column, {
            type: 'live',
            playerName: player.name,
            color: player.color
          });
          player.cells.add(`${cell.row},${cell.column}`);
          console.log(`- Cell placed at (${cell.row}, ${cell.column})`);
        } else {
          console.log(`- Invalid cell placement attempted at (${cell.row}, ${cell.column})`);
        }
      });
    });

    // Update the current player
    this.currentPlayer = (this.currentPlayer + 1) % this.players.length;

    // Apply Conway's rules and update the board
    this.generation++;
    console.log(`\nGeneration ${this.generation} of ${this.maxGenerations}:`);

    this.evolveBoard();
    this.updateScores();

    // Log current scores
    this.players.forEach(player => {
      console.log(`${player.name}'s score: ${player.score} cells`);
    });

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
      byPlayer: {}
    };

    // Initialize player counts
    this.players.forEach(player => {
      neighbors.byPlayer[player.name] = 0;
    });

    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;

        const newRow = row + i;
        const newCol = col + j;

        if (this.isValidPosition(newRow, newCol)) {
          const cell = this.board.getCell(newRow, newCol);
          if (cell && cell.type === 'live') {
            neighbors.total++;
            neighbors.byPlayer[cell.playerName]++;
          }
        }
      }
    }

    return neighbors;
  }

  getDominantPlayer(neighbors) {
    if (neighbors.byPlayer[this.players[0].name] > neighbors.byPlayer[this.players[1].name]) {
      return this.players[0];
    } else if (neighbors.byPlayer[this.players[1].name] > neighbors.byPlayer[this.players[0].name]) {
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
    // Game ends if one player has no living cells or after max generations
    const deadPlayer = this.players.find(player => player.score === 0);
    const allDead = this.players.every(player => player.score === 0);
    if (allDead) {
      this.winner = 'tie';
      console.log(`\nGame Over! It's a tie - both players have no living cells`);
    } else if (deadPlayer) {
      this.winner = this.players.find(player => player.id !== deadPlayer.id).name;
      console.log(`\nGame Over! ${this.winner} wins - opponent has no living cells`);
    } else if (this.generation >= this.maxGenerations) {
      // Determine winner based on cell count after 1000 generations
      const [player1, player2] = this.players;
      if (player1.score > player2.score) {
        this.winner = player1.name;
      } else if (player2.score > player1.score) {
        this.winner = player2.name;
      } else {
        this.winner = 'tie';
      }
      console.log(`\nGame Over! After ${this.maxGenerations} generations:`);
      console.log(`Final scores: ${player1.name}: ${player1.score}, ${player2.name}: ${player2.score}`);
      console.log(`Winner: ${this.winner === 'tie' ? "It's a tie!" : this.winner}`);
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
