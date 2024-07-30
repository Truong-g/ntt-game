const caroGameDataModel = require("../../games/caroGameDataModel");

module.exports = function (ws, channelName, transaction) {
  const data = caroGameDataModel.get(channelName);
  if (!data) {
    ws.send(
      JSON.stringify({
        transaction,
        type: "error",
        message: "Không tìm thấy phòng",
      })
    );
    return;
  }
  ws.send(
    JSON.stringify({
      transaction,
      type: "find-caro-game-success",
      payload: {
        blockBothEndsRule: data.settings.blockBothEndsRule,
        channelName: data.channelName,
        host: data.firstPlayer.username,
        timeCountDown: data.settings.timeCountDown,
      },
    })
  );
};
