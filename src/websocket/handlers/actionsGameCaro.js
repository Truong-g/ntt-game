const caroGameDataModel = require("../../games/caroGameDataModel");
const sendCaroChannelName = require("../send-methods/sendCaroChannelName");

module.exports = function (ws, channelName, payload) {
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

  switch (payload.subType) {
    case "pick-type": {
      if (
        data.firstPlayer.username === ws.username &&
        data.firstPlayer.gameType
      ) {
        ws.send(
          JSON.stringify({
            type: "error",
            message: "Bạn đã chọn rồi",
          })
        );
        break;
      }
      if (
        data.secondPlayer.username === ws.username &&
        data.secondPlayer.gameType
      ) {
        ws.send(
          JSON.stringify({
            type: "error",
            message: "Bạn đã chọn rồi",
          })
        );
        break;
      }
      if (ws.username === data.firstPlayer.username) {
        data.firstPlayer.gameType = payload.gameType;
      }
      if (ws.username === data.secondPlayer?.username) {
        data.secondPlayer.gameType = payload.gameType;
      }
      caroGameDataModel.update(data);
      sendCaroChannelName(channelName, {
        type: "update-caro-success",
        payload: data,
      });
      break;
    }
    case "first-play": {
      data.status = "playing";
      data.currentPlayer = data.firstPlayer.username;
      caroGameDataModel.update(data);
      sendCaroChannelName(channelName, {
        type: "update-caro-success",
        payload: data,
      });
      break;
    }
    case "check-cell": {
      data.currentPlayer =
        data.firstPlayer.username === data.currentPlayer
          ? data.secondPlayer.username
          : data.firstPlayer.username;
      caroGameDataModel.update(data);
      sendCaroChannelName(channelName, {
        type: "update-caro-success",
        payload: data,
      });
      sendCaroChannelName(channelName, {
        type: "check-cell-caro-success",
        payload: {
          ...payload,
          createdByUsername: ws.username,
        },
      });
      break;
    }
    case "win-game": {
      data.firstPlayer.score =
        data.firstPlayer.username === payload.winner
          ? data.firstPlayer.score + 1
          : data.firstPlayer.score;
      data.secondPlayer.score =
        data.secondPlayer.username === payload.winner
          ? data.secondPlayer.score + 1
          : data.secondPlayer.score;
      caroGameDataModel.update(data);
      sendCaroChannelName(channelName, {
        type: "update-caro-success",
        payload: data,
      });
      break;
    }
    case "restart-game": {
      data.currentPlayer = payload.loseUser;
      caroGameDataModel.update(data);
      sendCaroChannelName(channelName, {
        type: "update-caro-success",
        payload: data,
      });
      sendCaroChannelName(channelName, {
        type: "restart-game-success",
        payload: {},
      });
      break;
    }
    default:
      break;
  }
};
