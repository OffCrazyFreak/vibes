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
