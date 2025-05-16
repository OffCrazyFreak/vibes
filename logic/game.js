const config = require("./gameConfig");

/**
 * Conway's Game of Life PVP implementation
 * Two players each start with 50 cells on their half of the board
 * After initial placement, cells evolve according to Conway's rules
 */
class ConwayGame {
  /**
   * Creates a new ConwayGame instance and initializes game components
   */
  constructor() {
    this.numOfRows = config.BOARD_NUM_OF_ROWS;
    this.numOfColumns = config.BOARD_NUM_OF_COLUMNS;

    // Create the board as a 2D array
    this.board = Array.from({ length: this.numOfRows }, () =>
      Array.from({ length: this.numOfColumns }, () => null)
    );

    this.generationCount = 0;
    this.players = [];
    this.winner = null;
  }

  /**
   * Adds a new player to the game
   * @param {Object} playerData - Data for the new player
   * @param {string} playerData.id - Unique identifier for the player
   * @param {string} playerData.name - Display name for the player
   */
  addPlayer(playerData) {
    // Enforce exactly two players
    if (this.players.length >= 2) {
      throw new Error(
        "Cannot add more players. Game is limited to exactly 2 players."
      );
      return false;
    }

    const player = {
      id: playerData.id,
      name: playerData.name,
      cells: [],
    };

    this.players.push(player);
    return true;
  }

  /**
   * Places cells for a player during the setup phase
   * @param {string} playerId - ID of the player placing cells
   * @param {Array<Object>} placements - Array of cell positions to place
   * @param {number} placements[].row - Row coordinate
   * @param {number} placements[].column - Column coordinate
   * @returns {boolean} True if placement was successful, false otherwise
   */
  placeCells(playerId, placements) {
    const player = this.players.find((p) => p.id === playerId);

    // Place the cells
    placements.forEach((pos, index) => {
      if (
        index <= config.CELLS_TO_PLACE &&
        this.board[pos.row][pos.column] === null
      ) {
        this.board[pos.row][pos.column] = {
          type: "cell",
          playerId: player.id,
          playerName: player.name,
        };
      }
    });
  }

  /**
   * Processes a game tick, applying Conway's Game of Life rules
   */
  processMoves(moves) {
    if (
      this.generationCount % config.GENERATION_CYCLE === 0 &&
      this.generationCount <= config.GAME_MAX_MOVES / 2
    ) {
      // Changed condition
      moves.forEach((move) => {
        this.placeCells(move.playerId, move.placements);
      });
    }

    this.generationCount++;

    // Create a copy of the current board state
    const nextBoard = Array.from({ length: this.numOfRows }, () =>
      Array.from({ length: this.numOfColumns }, () => null)
    );

    // Apply Conway's rules to determine the next state
    for (let row = 0; row < this.numOfRows; row++) {
      for (let col = 0; col < this.numOfColumns; col++) {
        const neighbors = this.countNeighbors(row, col);
        const currentCell = this.board[row][col];

        // Rule 1: Any live cell with fewer than two live neighbors dies (underpopulation)
        // Rule 2: Any live cell with two or three live neighbors lives on
        // Rule 3: Any live cell with more than three live neighbors dies (overpopulation)
        if (currentCell !== null) {
          if (neighbors.total === 2 || neighbors.total === 3) {
            // Cell survives
            nextBoard[row][col] = currentCell;
          }
        }
        // Rule 4: Any dead cell with exactly three live neighbors becomes a live cell (reproduction)
        else if (neighbors.total === 3) {
          // Determine which player gets the new cell based on majority or random on tie
          let newCellPlayerId = null;
          let maxCount = 0;
          let tiedPlayers = [];

          for (const [playerId, count] of Object.entries(neighbors.byPlayer)) {
            if (count > maxCount) {
              maxCount = count;
              newCellPlayerId = playerId;
              tiedPlayers = [playerId];
            } else if (count === maxCount) {
              tiedPlayers.push(playerId);
            }
          }

          // If there's a tie, randomly select one of the tied players
          if (tiedPlayers.length > 1) {
            const randomIndex = Math.floor(Math.random() * tiedPlayers.length);
            newCellPlayerId = tiedPlayers[randomIndex];
          }

          if (newCellPlayerId) {
            const player = this.players.find((p) => p.id === newCellPlayerId);
            nextBoard[row][col] = {
              type: "cell",
              playerId: newCellPlayerId,
              playerName: player.name,
            };
          }
        }
      }
    }

    // Update the board and player cell tracking
    this.board = nextBoard;

    this.updatePlayerCells();

    if (this.generationCount % config.GENERATION_CYCLE === 0) {
      this.checkGameOver();
    }
  }

  /**
   * Updates the tracking of which cells belong to which player
   */
  updatePlayerCells() {
    // Reset player cells
    this.players.forEach((player) => {
      player.cells = [];
    });

    // Count cells for each player
    for (let row = 0; row < this.numOfRows; row++) {
      for (let col = 0; col < this.numOfColumns; col++) {
        const cell = this.board[row][col];
        if (cell !== null) {
          const player = this.players.find((p) => p.id === cell.playerId);
          if (player) {
            player.cells.push({ row: row, column: col });
          }
        }
      }
    }
  }

  /**
   * Counts the live neighbors around a cell and tracks which player they belong to
   * @param {number} row - Row coordinate
   * @param {number} col - Column coordinate
   * @returns {Object} Object containing total count and count by player
   */
  countNeighbors(row, col) {
    const neighbors = {
      total: 0,
      byPlayer: {},
    };

    // Initialize player counts
    this.players.forEach((player) => {
      neighbors.byPlayer[player.id] = 0;
    });

    // Check all 8 surrounding cells
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        // Skip the center cell
        if (i === 0 && j === 0) continue;

        const newRow = row + i;
        const newCol = col + j;

        // Check if the position is valid and contains a live cell
        if (
          this.isValidPosition({ row: newRow, column: newCol }) &&
          this.board[newRow][newCol] !== null
        ) {
          neighbors.total++;

          const playerId = this.board[newRow][newCol].playerId;
          neighbors.byPlayer[playerId]++;
        }
      }
    }

    return neighbors;
  }

  /**
   * Checks if the game is over based on player cell counts
   */
  checkGameOver() {
    // Game is over if one player has no cells left
    const playersWithCells = this.players.filter(
      (player) => player.cells.length > 0
    );

    if (playersWithCells.length === 1) {
      this.winner = playersWithCells[0].name;
      console.log(`Game Over! Player ${this.winner} wins!`);
      return true;
    }

    // Game is over if move limit is reached
    if (this.generationCount >= config.GAME_MAX_MOVES) {
      this.determineWinnerByCellCount();
      return true;
    }

    return false;
  }

  /**
   * Determines the winner based on cell count when game ends due to move limit
   */
  determineWinnerByCellCount() {
    const [player1, player2] = this.players;
    const player1CellCount = player1.cells.length; // Access cells directly from player object
    const player2CellCount = player2.cells.length; // Access cells directly from player object

    if (player1CellCount > player2CellCount) {
      this.winner = player1.name;
      console.log(`Game Over! Player ${this.winner} wins with more cells!`);
    } else if (player2CellCount > player1CellCount) {
      this.winner = player2.name;
      console.log(`Game Over! Player ${this.winner} wins with more cells!`);
    } else {
      this.winner = -1; // Draw
      console.log(`Game Over! Draw! Equal number of cells`);
    }
  }

  /**
   * Checks if a position is valid within the game board dimensions
   * @param {Object} position - The position to validate
   * @param {number} position.row - Row coordinate
   * @param {number} position.column - Column coordinate
   * @returns {boolean} True if position is valid, false otherwise
   */
  isValidPosition(position) {
    return (
      position &&
      position.row >= 0 &&
      position.row < this.numOfRows &&
      position.column >= 0 &&
      position.column < this.numOfColumns
    );
  }
}

module.exports = {
  ConwayGame,
};
