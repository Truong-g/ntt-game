const gameDataModel = require("../../games/quickGuessQuickWinGameDataModel");
const sendByQuickGuessQuickWinChannelName = require("../send-methods/sendByQuickGuessQuickWinChannelName");
module.exports = function (ws, channelName) {
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
  const username = ws.username;
  const isHostLeave = data.members.some(
    (member) => member.username === username && member.isHost
  );
  if (isHostLeave) {
    sendByQuickGuessQuickWinChannelName(data.channelName, {
      type: "channel-deleted",
    });
    gameDataModel.delete(data.channelName);
    return;
  }
  const newData = { ...data };
  newData.status = "player-shortage";
  newData.generalData.questions = [];
  newData.generalData.correctAnswers = [];
  newData.generalData.answers = [];
  newData.generalData.currentNumber = [];
  newData.members = newData.members.filter(
    (item) => item.username !== username
  );
  for (let index = 0; index < newData.members.length; index++) {
    newData.members[index].timeCountDown = newData.generalData.timeCountDown;
  }
  delete newData.ansewerData;
  gameDataModel.update(newData);
  sendByQuickGuessQuickWinChannelName(newData.channelName, {
    type: "update-success",
    payload: newData,
  });
};
