const db = require("../../configs/database");
const caroGameDataModel = require("../../games/caroGameDataModel");

module.exports = async function (ws, channelName, payload) {
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
      settings: {
        blockBothEndsRule: payload.blockBothEndsRule,
        timeCountDown: payload.timeCountDown,
      },
      firstPlayer: {
        isHost: true,
        fullName: user[0].fullName,
        username: user[0].username,
        gameType: null,
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
