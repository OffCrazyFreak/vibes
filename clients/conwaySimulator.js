// Conway's Game of Life PVP Simulator
// This standalone simulator allows testing the Conway's Game of Life PVP implementation
// without requiring the server to be running

const { ConwayGame } = require("../logic/conwayGame");

// Create a new game instance
const game = new ConwayGame();

// Add two players
game.addPlayer({ id: "player1", name: "Player 1" });
game.addPlayer({ id: "player2", name: "Player 2" });

// Generate initial cell placements for both players
const player1Cells = generateInitialCellPlacement(true);
const player2Cells = generateInitialCellPlacement(false);

// Place cells for both players
console.log("Player 1 placing cells:", player1Cells);
game.placeCells("player1", player1Cells);

console.log("Player 2 placing cells:", player2Cells);
game.placeCells("player2", player2Cells);

// Display initial board state
console.log("\nInitial Board State:");
displayBoard(game);

// Run simulation for a set number of generations or until game over
const maxGenerations = 100;
let generation = 0;

const simulationInterval = setInterval(() => {
  // Process the next generation
  game.processTick();
  generation++;
  
  // Display the current board state
  console.log(`\nGeneration ${generation}:`);
  displayBoard(game);
  
  // Display cell counts
  const cellCounts = game.getPlayerCellCounts();
  console.log("Cell counts:", cellCounts);
  
  // Check if game is over
  if (game.winner !== null || generation >= maxGenerations) {
    clearInterval(simulationInterval);
    
    if (game.winner !== null) {
      console.log(`Game over! ${game.winner === -1 ? 'Draw!' : `Winner: ${game.winner}`}`);
    } else {
      console.log(`Simulation ended after ${maxGenerations} generations.`);
      // Determine winner based on cell count
      game.determineWinnerByCellCount();
      console.log(`Final result: ${game.winner === -1 ? 'Draw!' : `Winner: ${game.winner}`}`);
    }
  }
}, 500); // Update every 500ms for visibility

/**
 * Generates the initial cell placement for a player
 * @param {boolean} isFirstPlayer - Whether this is the first player
 * @returns {Array<Object>} Array of cell positions
 */
function generateInitialCellPlacement(isFirstPlayer) {
  const cellPositions = [];
  const numOfRows = game.numOfRows;
  const numOfColumns = game.numOfColumns;
  
  // Determine the valid column range based on which player we are
  const minCol = isFirstPlayer ? 0 : Math.floor(numOfColumns / 2);
  const maxCol = isFirstPlayer ? Math.floor(numOfColumns / 2) - 1 : numOfColumns - 1;
  
  // Simple strategy: Place cells in a glider pattern if possible, otherwise random
  if (isFirstPlayer) {
    // Left side player - place a glider moving right
    if (numOfRows >= 5 && (maxCol - minCol) >= 5) {
      // Place a glider in the top-left corner
      cellPositions.push({ row: 1, column: 2 });
      cellPositions.push({ row: 2, column: 3 });
      cellPositions.push({ row: 3, column: 1 });
      cellPositions.push({ row: 3, column: 2 });
      cellPositions.push({ row: 3, column: 3 });
      
      // Place a glider in the middle-left
      cellPositions.push({ row: Math.floor(numOfRows / 2) - 1, column: 2 });
      cellPositions.push({ row: Math.floor(numOfRows / 2), column: 3 });
      cellPositions.push({ row: Math.floor(numOfRows / 2) + 1, column: 1 });
      cellPositions.push({ row: Math.floor(numOfRows / 2) + 1, column: 2 });
      cellPositions.push({ row: Math.floor(numOfRows / 2) + 1, column: 3 });
      
      // Place a block pattern (stable)
      cellPositions.push({ row: numOfRows - 4, column: 1 });
      cellPositions.push({ row: numOfRows - 4, column: 2 });
      cellPositions.push({ row: numOfRows - 3, column: 1 });
      cellPositions.push({ row: numOfRows - 3, column: 2 });
      
      // Place a blinker pattern (oscillator)
      cellPositions.push({ row: numOfRows - 7, column: 5 });
      cellPositions.push({ row: numOfRows - 6, column: 5 });
      cellPositions.push({ row: numOfRows - 5, column: 5 });
      
      // Fill remaining cells randomly
      while (cellPositions.length < game.startingCells) {
        const row = Math.floor(Math.random() * numOfRows);
        const column = minCol + Math.floor(Math.random() * (maxCol - minCol + 1));
        
        // Check if this position is already used
        if (!cellPositions.some(pos => pos.row === row && pos.column === column)) {
          cellPositions.push({ row, column });
        }
      }
    } else {
      // Board is too small for patterns, place randomly
      placeRandomCells(cellPositions, minCol, maxCol);
    }
  } else {
    // Right side player - place a glider moving left
    if (numOfRows >= 5 && (maxCol - minCol) >= 5) {
      // Place a glider in the top-right corner
      cellPositions.push({ row: 1, column: maxCol - 2 });
      cellPositions.push({ row: 2, column: maxCol - 3 });
      cellPositions.push({ row: 3, column: maxCol - 1 });
      cellPositions.push({ row: 3, column: maxCol - 2 });
      cellPositions.push({ row: 3, column: maxCol - 3 });
      
      // Place a glider in the middle-right
      cellPositions.push({ row: Math.floor(numOfRows / 2) - 1, column: maxCol - 2 });
      cellPositions.push({ row: Math.floor(numOfRows / 2), column: maxCol - 3 });
      cellPositions.push({ row: Math.floor(numOfRows / 2) + 1, column: maxCol - 1 });
      cellPositions.push({ row: Math.floor(numOfRows / 2) + 1, column: maxCol - 2 });
      cellPositions.push({ row: Math.floor(numOfRows / 2) + 1, column: maxCol - 3 });
      
      // Place a block pattern (stable)
      cellPositions.push({ row: numOfRows - 4, column: maxCol - 1 });
      cellPositions.push({ row: numOfRows - 4, column: maxCol - 2 });
      cellPositions.push({ row: numOfRows - 3, column: maxCol - 1 });
      cellPositions.push({ row: numOfRows - 3, column: maxCol - 2 });
      
      // Place a blinker pattern (oscillator)
      cellPositions.push({ row: numOfRows - 7, column: maxCol - 5 });
      cellPositions.push({ row: numOfRows - 6, column: maxCol - 5 });
      cellPositions.push({ row: numOfRows - 5, column: maxCol - 5 });
      
      // Fill remaining cells randomly
      while (cellPositions.length < game.startingCells) {
        const row = Math.floor(Math.random() * numOfRows);
        const column = minCol + Math.floor(Math.random() * (maxCol - minCol + 1));
        
        // Check if this position is already used
        if (!cellPositions.some(pos => pos.row === row && pos.column === column)) {
          cellPositions.push({ row, column });
        }
      }
    } else {
      // Board is too small for patterns, place randomly
      placeRandomCells(cellPositions, minCol, maxCol);
    }
  }
  
  return cellPositions;
}

/**
 * Places cells randomly within the valid column range
 * @param {Array<Object>} cellPositions - Array to fill with cell positions
 * @param {number} minCol - Minimum valid column
 * @param {number} maxCol - Maximum valid column
 */
function placeRandomCells(cellPositions, minCol, maxCol) {
  const numOfRows = game.numOfRows;
  
  while (cellPositions.length < game.startingCells) {
    const row = Math.floor(Math.random() * numOfRows);
    const column = minCol + Math.floor(Math.random() * (maxCol - minCol + 1));
    
    // Check if this position is already used
    if (!cellPositions.some(pos => pos.row === row && pos.column === column)) {
      cellPositions.push({ row, column });
    }
  }
}

/**
 * Displays the current board state in the console
 * @param {ConwayGame} game - The game instance
 */
function displayBoard(game) {
  const board = game.board;
  const numOfRows = game.numOfRows;
  const numOfColumns = game.numOfColumns;
  
  // Print column numbers
  process.stdout.write("   ");
  for (let col = 0; col < numOfColumns; col++) {
    process.stdout.write(`${col % 10}`);
  }
  console.log();
  
  // Print top border
  process.stdout.write("   ");
  for (let col = 0; col < numOfColumns; col++) {
    process.stdout.write("-");
  }
  console.log();
  
  // Print board rows
  for (let row = 0; row < numOfRows; row++) {
    process.stdout.write(`${row.toString().padStart(2, ' ')}|`);
    
    for (let col = 0; col < numOfColumns; col++) {
      const cell = board[row][col];
      
      if (cell === null) {
        process.stdout.write(" ");
      } else if (cell.type === 'cell') {
        // First player cells are 'X', second player cells are 'O'
        const isFirstPlayer = game.players[0].id === cell.playerId;
        process.stdout.write(isFirstPlayer ? "X" : "O");
      } else {
        // For any other cell types
        process.stdout.write("?");
      }
    }
    
    process.stdout.write("|");
    console.log();
  }
  
  // Print bottom border
  process.stdout.write("   ");
  for (let col = 0; col < numOfColumns; col++) {
    process.stdout.write("-");
  }
  console.log();
}