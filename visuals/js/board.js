// Initialize grid on page load
document.addEventListener("DOMContentLoaded", () => {
  createGrid(50, 100);
});

/**
 * Initializes the game board grid with the specified number of rows and columns.
 *
 * Replaces any existing grid inside the element with id "gameBoard" and creates a new grid layout using CSS grid, where each cell is a div with a unique id in the format "cell-{row}-{col}".
 *
 * @param {number} [rows=150] - Number of rows to create in the grid.
 * @param {number} [cols=350] - Number of columns to create in the grid.
 */
function createGrid(rows = 150, cols = 350) {
  const board = document.getElementById("gameBoard");
  board.style.gridTemplateColumns = `repeat(${cols}, 0.375rem)`;
  board.innerHTML = ""; // Clear existing grid

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.id = `cell-${i}-${j}`;
      board.appendChild(cell);
    }
  }
}

/**
 * Updates the visual state of the game board grid based on the provided game data.
 *
 * If the grid dimensions differ from the data, the grid is recreated. Each cell is updated to reflect player positions or unknown states. When a winner is present, the grid applies a grayscale effect to indicate a draw or highlight the losing player's cells.
 *
 * @param {Object} data - Game state data containing a `map` array and optional `winner` and `players` information.
 */
function updateGrid(data) {
  if (!data.map || !Array.isArray(data.map) || data.map.length === 0) {
    console.error("Invalid map data");
    return;
  }

  const rows = data.map.length;
  const cols = data.map[0].length;

  const board = document.getElementById("gameBoard");
  const currentRows = board.style.gridTemplateRows.match(/repeat\((\d+)/)?.[1];
  const currentCols =
    board.style.gridTemplateColumns.match(/repeat\((\d+)/)?.[1];

  // Only recreate grid if dimensions changed
  if (currentRows != rows || currentCols != cols) {
    createGrid(rows, cols);
  }

  // Update cells
  if (data.map) {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        // probably can be optimised using player.cells instead of iterating over map

        const cell = document.getElementById(`cell-${i}-${j}`);
        cell.classList.remove("Uno", "Duo");

        if (data.map[i][j] !== null) {
          if (data.map[i][j].playerName === "Uno") {
            cell.classList.add("player1");
          } else if (data.map[i][j].playerName === "Duo") {
            cell.classList.add("player2");
          } else {
            cell.classList.add("unknown");
          }
        }
      }
    }
  }

  if (data.winner) {
    if (data.winner === -1) {
      // draw - grayscale all cells
      const allCells = document.querySelectorAll(".cell");
      allCells.forEach((cell) => {
        cell.style.filter = "grayscale(100%)";
      });
    } else {
      // grayscale the losing cell
      const losingPlayer = data.players.find(
        (player) => player.name !== data.winner
      );

      // find index of losing player
      const losingPlayerIndex = data.players.findIndex(
        (player) => player.name === losingPlayer.name
      );

      const losingCells = document.querySelectorAll(
        `.player${losingPlayerIndex + 1}`
      );
      losingCells.forEach((cell) => {
        cell.style.filter = "grayscale(100%)";
      });
    }
  }
}

// Export functions for use in other files
window.boardUtils = {
  updateGrid,
};
