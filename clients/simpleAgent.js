const WebSocket = require("ws");

// Configuration
const CONFIG = {
  defaultId: "k",
  wsUrl: "ws://localhost:3000",
  gridRows: 50,
  gridCols: 100,
  cellsPerTurn: 30,
};

// Get the agentId from command line or use default
const agentId = process.argv[2] || CONFIG.defaultId;

// Function to generate random positions
function generateRandomPlacements() {
  const placements = [];
  while (placements.length < CONFIG.cellsPerTurn) {
    const position = {
      row: Math.floor(Math.random() * CONFIG.gridRows),
      column: Math.floor(Math.random() * CONFIG.gridCols),
    };
    const isOccupied = gameState.players.some(player =>
      player.cells.some(cell => cell.row === position.row && cell.column === position.column)
    );
    if (!isOccupied) {
      placements.push(position);
    }
  }
  return placements;
}

// Connect to WebSocket server
const ws = new WebSocket(`${CONFIG.wsUrl}?id=${agentId}`);

ws.on("open", () => console.log("Connected to WebSocket server"));
ws.on("error", (error) => console.error("WebSocket error:", error));
ws.on("close", () => console.log("Disconnected from WebSocket server"));

ws.on("message", (data) => {
  const gameState = JSON.parse(data.toString("utf-8"));
  console.log("Received game state:", gameState);

  // Only make a move if the game isn't over
  if (gameState.winner === null || gameState.winner === undefined) {
    // Generate random positions for this turn
    const placements = generateRandomPlacements();

    // Create the move object
    const move = {
      playerId: agentId,
      placements: placements,
    };

    // Send the move
    ws.send(JSON.stringify(move));
    console.log("Sent move:", move);
  }
});
