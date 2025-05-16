// Game configuration constants
// Maximum number of moves before forcing game end. Will be set to ~1000 in production.
const GAME_MAX_MOVES = 200;
// Number of rows in the game grid (MUST BE AN ODD NUMBER). Will be set to ~25 in production.
const BOARD_NUM_OF_ROWS = 25;
// Number of columns in the game grid. Will be set to ~60 in production.
const BOARD_NUM_OF_COLUMNS = 50;

const CELLS_TO_PLACE = 60;
const GENERATION_CYCLE = 10;

// Map shrinkage configuration
const START_SHRINKING_MAP_AFTER_MOVES = 100; // Number of moves after which the map starts shrinking. Will be set to ~100 in production.
const SHRINK_MAP_MOVE_INTERVAL = 10; // Number of moves between each shrinkage.  Will be set to 10 in production.
const MINIMUM_BOARD_SIZE = 20; // Number of columns left after which the map stops shrinking. Will be set to ~20 in production.

// Spawn a item approximately 1 in X moves. Will be set to X=~20 in production.
const MODIFIER_SPAWN_CHANCE = 1 / 10;

module.exports = {
  GAME_MAX_MOVES,
  BOARD_NUM_OF_ROWS,
  BOARD_NUM_OF_COLUMNS,
  CELLS_TO_PLACE,
  GENERATION_CYCLE,
  START_SHRINKING_MAP_AFTER_MOVES,
  SHRINK_MAP_MOVE_INTERVAL,
  MINIMUM_BOARD_SIZE,
  MODIFIER_SPAWN_CHANCE,
};
