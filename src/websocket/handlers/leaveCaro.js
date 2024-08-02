const caroGameDataModel = require("../../games/caroGameDataModel");
const sendCaroChannelName = require("../send-methods/sendCaroChannelName");

module.exports = function (ws, channelName) {
  const data = caroGameDataModel.get(channelName);
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
  if (data.secondPlayer?.username === username) {
    data.status = "player-shortage";
    data.currentPlayer = null;
    data.firstPlayer.gameType = null;
    data.firstPlayer.score = 0;
    delete data.secondPlayer;
    caroGameDataModel.update(data);
    sendCaroChannelName(channelName, {
      type: "update-caro-success",
      payload: data,
    });
  } else if (data.firstPlayer.username === username) {
    sendCaroChannelName(channelName, {
      type: "deleted-channel",
      payload: {
        sender: ws.username,
      },
    });
    caroGameDataModel.delete(channelName);
  }
};
