const config = require("./gameConfig");

/**
 * Conway's Game of Life PVP implementation
 * Two players each start with 20 cells on their half of the board
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
    
    this.moveCount = 0;
    this.players = [];
    this.winner = null;
    
    // Each player starts with 20 cells to place
    this.startingCells = 20;
    
    // Track which cells belong to which player
    this.playerCells = {};
    
    // Track board states for stability detection
    this.previousStates = [];
    this.stableGenerationCount = 0;
    this.STABILITY_THRESHOLD = 3; // Number of identical generations to consider stable
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
      console.log('Cannot add more players. Game is limited to exactly 2 players.');
      return false;
    }
    
    const player = {
      id: playerData.id,
      name: playerData.name,
      cellsToPlace: this.startingCells,
      hasPlacedCells: false
    };
    
    this.players.push(player);
    this.playerCells[player.id] = [];
    return true;
  }
  
  /**
   * Places cells for a player during the setup phase
   * @param {string} playerId - ID of the player placing cells
   * @param {Array<Object>} cellPositions - Array of cell positions to place
   * @param {number} cellPositions[].row - Row coordinate
   * @param {number} cellPositions[].column - Column coordinate
   * @returns {boolean} True if placement was successful, false otherwise
   */
  placeCells(playerId, cellPositions) {
    const player = this.players.find(p => p.id === playerId);
    
    // Check if player exists and hasn't placed cells yet
    if (!player || player.hasPlacedCells) {
      return false;
    }
    
    // Check if player is trying to place the correct number of cells
    if (cellPositions.length !== player.cellsToPlace) {
      console.log(`Player ${player.name} tried to place ${cellPositions.length} cells instead of ${player.cellsToPlace}`);
      return false;
    }
    
    // Check if all cells are in the player's half of the board
    const isFirstPlayer = this.players.indexOf(player) === 0;
    const validHalf = isFirstPlayer ? 
      (pos) => pos.column < this.numOfColumns / 2 : 
      (pos) => pos.column >= this.numOfColumns / 2;
    
    if (!cellPositions.every(validHalf)) {
      console.log(`Player ${player.name} tried to place cells outside their half of the board`);
      return false;
    }
    
    // Check if all positions are valid and empty
    if (!cellPositions.every(pos => this.isValidPosition(pos) && this.board[pos.row][pos.column] === null)) {
      console.log(`Player ${player.name} tried to place cells in invalid or occupied positions`);
      return false;
    }
    
    // Place the cells
    cellPositions.forEach(pos => {
      this.board[pos.row][pos.column] = {
        type: 'cell',
        playerId: player.id,
        playerName: player.name
      };
      
      this.playerCells[player.id].push({ row: pos.row, column: pos.column });
    });
    
    player.hasPlacedCells = true;
    player.cellsToPlace = 0;
    
    return true;
  }
  
  /**
   * Processes a game tick, applying Conway's Game of Life rules
   */
  processTick() {
    // Check if all players have placed their cells
    if (!this.players.every(p => p.hasPlacedCells)) {
      return;
    }
    
    this.moveCount++;
    
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
            const player = this.players.find(p => p.id === newCellPlayerId);
            nextBoard[row][col] = {
              type: 'cell',
              playerId: newCellPlayerId,
              playerName: player.name
            };
          }
        }
      }
    }
    
    // Update the board and player cell tracking
    this.board = nextBoard;
    
    // Update player cell counts
    this.updatePlayerCells();
    
    // Check if game is over
    this.checkGameOver();
  }
  
  /**
   * Updates the tracking of which cells belong to which player
   */
  updatePlayerCells() {
    // Reset player cells
    this.players.forEach(player => {
      this.playerCells[player.id] = [];
    });
    
    // Count cells for each player
    for (let row = 0; row < this.numOfRows; row++) {
      for (let col = 0; col < this.numOfColumns; col++) {
        const cell = this.board[row][col];
        if (cell !== null) {
          this.playerCells[cell.playerId].push({ row, column: col });
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
      byPlayer: {}
    };
    
    // Initialize player counts
    this.players.forEach(player => {
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
        if (this.isValidPosition({ row: newRow, column: newCol }) && 
            this.board[newRow][newCol] !== null) {
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
    const playersWithCells = this.players.filter(player => 
      this.playerCells[player.id].length > 0
    );
    
    if (playersWithCells.length === 1) {
      this.winner = playersWithCells[0].name;
      console.log(`Game Over! Player ${this.winner} wins!`);
      return true;
    }
    
    // Check for board stability
    const currentState = this.getBoardStateString();
    if (this.previousStates.length > 0 && currentState === this.previousStates[this.previousStates.length - 1]) {
      this.stableGenerationCount++;
      if (this.stableGenerationCount >= this.STABILITY_THRESHOLD) {
        console.log('Game Over! Board has stabilized.');
        this.determineWinnerByCellCount();
        return true;
      }
    } else {
      this.stableGenerationCount = 0;
    }
    this.previousStates.push(currentState);
    if (this.previousStates.length > this.STABILITY_THRESHOLD) {
      this.previousStates.shift();
    }
    
    // Game is over if move limit is reached
    if (this.moveCount >= config.GAME_MAX_MOVES) {
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
    const player1CellCount = this.playerCells[player1.id].length;
    const player2CellCount = this.playerCells[player2.id].length;
    
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
  
  /**
   * Gets the current board state for display
   * @returns {Array<Array>} 2D array representing the board
   */
  getBoardState() {
    return this.board;
  }

  /**
   * Creates a string representation of the current board state for stability comparison
   * @returns {string} A string representing the current board state
   * @private
   */
  getBoardStateString() {
    return this.board.map(row =>
      row.map(cell => {
        if (!cell) return '0';
        return cell.playerId;
      }).join('')
    ).join('|');
  }
  
  /**
   * Gets the cell counts for each player
   * @returns {Object} Object with player IDs as keys and cell counts as values
   */
  getPlayerCellCounts() {
    const counts = {};
    this.players.forEach(player => {
      counts[player.id] = this.playerCells[player.id].length;
    });
    return counts;
  }
}

module.exports = {
  ConwayGame,
};