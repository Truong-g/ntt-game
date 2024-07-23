const gameDataModel = require("../../games/quickGuessQuickWinGameDataModel");
const sendByQuickGuessQuickWinChannelName = require("../send-methods/sendByQuickGuessQuickWinChannelName");
const db = require("../../configs/database");

module.exports = async function (ws, channelName) {
  try {
    const data = gameDataModel.get(channelName);
    if (!data) {
      ws.send(
        JSON.stringify({
          type: "error",
          message: "Không tìm thấy phòng",
        })
      );
      return;
    }
    if (data.members.length === data.limitMember) {
      ws.send(
        JSON.stringify({
          type: "error",
          message: "Phòng đã đầy",
        })
      );
      return;
    }
    const [user] = await db.execute(
      `
                SELECT * FROM players WHERE username = ?
                `,
      [ws.username]
    );
    const newData = { ...data };
    newData.status = "non-start";
    newData.members.push({
      isHost: false,
      username: ws.username,
      fullName: user[0].fullName,
      selectedAvatar: "avatar-1",
      isPlaying: false,
      timeCountDown: newData.generalData.timeCountDown,
    });
    gameDataModel.update(newData);
    sendByQuickGuessQuickWinChannelName(newData.channelName, {
      type: "update-success",
      payload: newData,
    });
  } catch (error) {
    ws.send(
      JSON.stringify({
        type: "error",
        message: error.message,
      })
    );
  }
};
