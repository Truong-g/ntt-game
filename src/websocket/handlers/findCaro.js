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
  if (data.secondPlayer) {
    ws.send(
      JSON.stringify({
        transaction,
        type: "error",
        message: "Phòng này đã có người tham gia",
      })
    );
    return;
  }
  ws.send(
    JSON.stringify({
      transaction,
      type: "find-caro-game-success",
      payload: {
        channelName: data.channelName,
        host: data.firstPlayer.username,
      },
    })
  );
};
