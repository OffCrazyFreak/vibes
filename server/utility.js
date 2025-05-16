function serializeGameState(game) {
  return {
    map: game.board.map,
    players: game.players.map((player) => ({
      name: player.name,
      body: player.body,
    })),
    winner: game.winner,
    generationCount: game.generationCount,
  };
}

module.exports = { serializeGameState };
