const db = require("../../configs/database");
const caroGameDataModel = require("../../games/caroGameDataModel");

module.exports = async function (ws, channelName) {
  try {
    const [user] = await db.execute(
      `
                  SELECT * FROM players WHERE username = ?
                  `,
      [ws.username]
    );

    const gamePayload = {
      channelName,
      status: "player-shortage",
      firstPlayer: {
        isHost: true,
        fullName: user[0].fullName,
        username: user[0].username,
        gameType: null,
        score: 0
      },
      currentPlayer:null
    };
    caroGameDataModel.add(gamePayload);
    ws.send(
      JSON.stringify({
        type: "create-caro-game-success",
        payload: gamePayload,
      })
    );
  } catch (error) {
    ws.send(
      JSON.stringify({
        type: "error",
        message: error.message,
      })
    );
  }
};
