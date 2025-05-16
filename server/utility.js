/**
 * Creates a serialized snapshot of the current game state.
 *
 * Returns an object containing the map, a simplified list of players (with only their names and bodies), the winner, and the generation count.
 *
 * @param {Object} game - The game instance to serialize.
 * @returns {Object} An object representing the serialized game state.
 */
function serializeGameState(game) {
  return {
    map: game.board,
    players: game.players.map((player) => ({
      name: player.name,
      cells: player.cells,
    })),
    winner: game.winner,
    generationCount: game.generationCount,
  };
}

module.exports = { serializeGameState };
