// Conway's Game of Life PVP console client
const WebSocket = require("ws");
const { ConwayGame } = require("../logic/conwayGame");

// Configuration
const CONFIG = {
  defaultId: "player1",
  wsUrl: "ws://localhost:3000",
};

// Game state
const gameState = {
  agentId: process.argv[2] || CONFIG.defaultId,
  game: null,
  playerName: null,
  isFirstPlayer: false,
};

// Initialize the game
gameState.game = new ConwayGame();

// Connect to the server
const ws = new WebSocket(CONFIG.wsUrl);

ws.on("open", function open() {
  console.log(`Connected to server as ${gameState.agentId}`);
  
  // Register with the server
  ws.send(JSON.stringify({
    type: "register",
    id: gameState.agentId,
  }));
});

ws.on("message", function incoming(data) {
  const message = JSON.parse(data);
  
  switch (message.type) {
    case "register_response":
      handleRegisterResponse(message);
      break;
    case "game_start":
      handleGameStart(message);
      break;
    case "your_turn":
      handleYourTurn(message);
      break;
    case "game_state":
      handleGameState(message);
      break;
    case "game_over":
      handleGameOver(message);
      break;
    default:
      console.log("Unknown message type:", message.type);
  }
});

ws.on("close", function close() {
  console.log("Disconnected from server");
  process.exit(0);
});

ws.on("error", function error(err) {
  console.error("WebSocket error:", err);
  process.exit(1);
});

/**
 * Handles the register response from the server
 * @param {Object} message - The register response message
 */
function handleRegisterResponse(message) {
  gameState.playerName = message.name || gameState.agentId;
  console.log(`Registered as player: ${gameState.playerName}`);
}

/**
 * Handles the game start message from the server
 * @param {Object} message - The game start message
 */
function handleGameStart(message) {
  console.log("Game started!");
  console.log("Players:", message.players);
  
  // Determine if we're the first player
  gameState.isFirstPlayer = message.players[0].id === gameState.agentId;
  
  // Add players to our local game instance
  message.players.forEach(player => {
    gameState.game.addPlayer(player);
  });
  
  console.log(`You are playing on the ${gameState.isFirstPlayer ? 'left' : 'right'} side of the board`);
  console.log(`You have ${gameState.game.startingCells} cells to place`);
}

/**
 * Handles the your turn message from the server
 * @param {Object} message - The your turn message
 */
function handleYourTurn(message) {
  console.log("Your turn!");
  
  const player = gameState.game.players.find(p => p.id === gameState.agentId);
  
  if (!player.hasPlacedCells) {
    // Initial cell placement
    const cellPositions = generateInitialCellPlacement();
    
    console.log("Placing initial cells:", cellPositions);
    
    // Send the move to the server
    ws.send(JSON.stringify({
      type: "place_cells",
      playerId: gameState.agentId,
      cellPositions: cellPositions
    }));
    
    // Update our local game state
    gameState.game.placeCells(gameState.agentId, cellPositions);
  } else {
    // After initial placement, there are no more moves to make
    // The game will automatically progress based on Conway's rules
    console.log("Waiting for game to progress...");
    
    // Send an empty move to acknowledge the turn
    ws.send(JSON.stringify({
      type: "no_move",
      playerId: gameState.agentId
    }));
  }
}

/**
 * Generates the initial cell placement for the player
 * @returns {Array<Object>} Array of cell positions
 */
function generateInitialCellPlacement() {
  const cellPositions = [];
  const numOfRows = Math.max(gameState.game.numOfRows, 8);
  const numOfColumns = gameState.game.numOfColumns;
  const maxAttempts = 1000; // Set a reasonable retry limit
  let attempts = 0;

  // Determine the valid column range based on which player we are
  const minCol = gameState.isFirstPlayer ? 0 : Math.floor(numOfColumns / 2);
  const maxCol = gameState.isFirstPlayer ? Math.floor(numOfColumns / 2) - 1 : numOfColumns - 1;

  // Calculate the maximum number of free cells
  const maxFreeCells = (numOfRows * (maxCol - minCol + 1)) - cellPositions.length;
  const cellsToPlace = Math.min(gameState.game.startingCells, maxFreeCells);

  // Simple strategy: Place cells in a glider pattern if possible, otherwise random
  while (cellPositions.length < cellsToPlace && attempts < maxAttempts) {
    const row = Math.floor(Math.random() * numOfRows);
    const column = Math.floor(Math.random() * (maxCol - minCol + 1)) + minCol;

    const position = { row, column };

    if (!cellPositions.some(existingPos => existingPos.row === position.row && existingPos.column === position.column)) {
      cellPositions.push(position);
    }

    attempts++;
  }

  if (attempts >= maxAttempts) {
    console.warn('Reached maximum attempts to place cells. Some cells may not be placed.');
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
  const numOfRows = gameState.game.numOfRows;
  
  while (cellPositions.length < gameState.game.startingCells) {
    const row = Math.floor(Math.random() * numOfRows);
    const column = minCol + Math.floor(Math.random() * (maxCol - minCol + 1));
    
    // Check if this position is already used
    if (!cellPositions.some(pos => pos.row === row && pos.column === column)) {
      cellPositions.push({ row, column });
    }
  }
}

/**
 * Handles the game state update from the server
 * @param {Object} message - The game state message
 */
function handleGameState(message) {
  // Update our local game state
  if (message.board) {
    gameState.game.board = message.board;
    gameState.game.updatePlayerCells();
  }
  
  // Display the current board state
  displayBoard();
  
  // Display cell counts
  const cellCounts = gameState.game.getPlayerCellCounts();
  console.log("Cell counts:", cellCounts);
}

/**
 * Handles the game over message from the server
 * @param {Object} message - The game over message
 */
function handleGameOver(message) {
  console.log("Game over!");
  console.log("Winner:", message.winner);
  
  // Display final board state
  displayBoard();
  
  // Display final cell counts
  const cellCounts = gameState.game.getPlayerCellCounts();
  console.log("Final cell counts:", cellCounts);
  
  // Close the connection
  ws.close();
}

/**
 * Displays the current board state in the console
 */
function displayBoard() {
  const board = gameState.game.board;
  const numOfRows = gameState.game.numOfRows;
  const numOfColumns = gameState.game.numOfColumns;
  
  console.log("\nCurrent Board State:");
  
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
      } else {
        // First player cells are 'X', second player cells are 'O'
        const isFirstPlayer = gameState.game.players[0].id === cell.playerId;
        process.stdout.write(isFirstPlayer ? "X" : "O");
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