const WebSocket = require("ws");

// Configuration
const CONFIG = {
  defaultId: "k",
  wsUrl: "ws://localhost:3000",
  gridRows: 30,
  gridCols: 80,
  cellsPerTurn: 100,
};

// Get the agentId from command line or use default
const agentId = process.argv[2] || CONFIG.defaultId;

// Function to generate random positions
function generateRandomPlacements() {
  const placements = [];

  // Determine which side of the board to place cells based on agent ID
  const sideOfBoard = agentId === "k" ? 0 : Math.floor(CONFIG.gridCols / 2);
  const maxColumns = Math.floor(CONFIG.gridCols / 2); // Half of the board width

  for (let i = 0; i < CONFIG.cellsPerTurn; i++) {
    placements.push({
      row: Math.floor(Math.random() * CONFIG.gridRows),
      column: Math.floor(Math.random() * maxColumns) + sideOfBoard,
    });
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
  // console.log("Received game state:", gameState);

  if (gameState.message === "Waiting for players to connect") {
    return;
  }

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
    // console.log("Sent move:", move);
  }
});
