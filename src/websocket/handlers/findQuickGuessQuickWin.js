const gameDataModel = require("../../games/quickGuessQuickWinGameDataModel");

module.exports = function (ws, channelName, transaction) {
  const data = gameDataModel.get(channelName);
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

  if (data.members.length >= 2) {
    ws.send(
      JSON.stringify({
        transaction,
        type: "error",
        message: "Phòng đã đủ thành viên",
      })
    );
    return;
  }

  const host = data.members.find((member) => member.isHost);
  ws.send(
    JSON.stringify({
      transaction,
      type: "find-success",
      payload: {
        channelName: data.channelName,
        host: host.username,
        timeCountDown: data.generalData.timeCountDown,
      },
    })
  );
};
