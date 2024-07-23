const gameDataModel = require("../../games/quickGuessQuickWinGameDataModel");
const db = require("../../configs/database");

module.exports = async function (ws, channelName, timeCountDown) {
  try {
    const [user] = await db.execute(
      `
              SELECT * FROM players WHERE username = ?
              `,
      [ws.username]
    );
    
    const gameData = {
      channelName: channelName,
      generalData: {
        questions: [],
        correctAnswers: [],
        answers: [],
        timeCountDown: timeCountDown,
        currentNumber: 0
      },
      status: "player-shortage",
      members: [
        {
          isHost: true,
          username: ws.username,
          fullName: user[0].fullName,
          selectedAvatar: "avatar-1",
          isPlaying: false,
          timeCountDown: timeCountDown,
        },
      ],
      limitMember: 2
    };
    gameDataModel.add(gameData);
    ws.send(
      JSON.stringify({
        type: "create-success",
        payload: gameData,
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
