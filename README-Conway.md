# Conway's Game of Life PVP

This is a PVP implementation of Conway's Game of Life where two players compete against each other. Each player starts with 20 cells to distribute on their half of the board. After the initial placement, the cells evolve according to Conway's Game of Life rules, and the player with the most cells at the end wins.

## Game Rules

1. Each player starts with 20 cells to place on their half of the board.
2. Players take turns placing their cells (in the current implementation, this happens automatically).
3. After all cells are placed, the game progresses according to Conway's Game of Life rules:
   - Any live cell with fewer than two live neighbors dies (underpopulation)
   - Any live cell with two or three live neighbors lives on to the next generation
   - Any live cell with more than three live neighbors dies (overpopulation)
   - Any dead cell with exactly three live neighbors becomes a live cell (reproduction)
4. When a new cell is born from cells of different players, it belongs to the player who contributed the majority of the neighboring cells.
5. The game ends when one player has no cells left or after a maximum number of generations.
6. The player with the most cells at the end wins.

## How to Run

### Standalone Simulator

To run the standalone simulator without requiring the server:

```bash
node clients/conwaySimulator.js
```

This will start a simulation that runs for 100 generations or until one player has no cells left. The board state is displayed in the console after each generation.

### Client-Server Mode

To run the game with the server (not yet fully implemented):

1. Start the server:
   ```bash
   node server/server.js
   ```

2. Start two client instances in separate terminals:
   ```bash
   node clients/conwayAgent.js player1
   node clients/conwayAgent.js player2
   ```

## Implementation Details

### Files

- `logic/conwayGame.js`: Core game logic implementing Conway's Game of Life rules with PVP mechanics
- `clients/conwayAgent.js`: Client implementation for connecting to the server
- `clients/conwaySimulator.js`: Standalone simulator for testing the game logic

### Cell Placement Strategies

The current implementation includes some basic strategies for cell placement:

- Glider patterns that move toward the opponent
- Block patterns (stable 2x2 squares)
- Blinker patterns (oscillating 3-cell lines)
- Random placement for remaining cells

You can modify these strategies in the `generateInitialCellPlacement` function in both client files.

## Future Improvements

- Add visual interface beyond console display
- Implement manual cell placement for players
- Add more sophisticated placement strategies
- Add game variations with different rules
- Implement tournament mode for multiple games