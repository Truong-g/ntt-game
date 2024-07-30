const caroGameDataModel = require("../../games/caroGameDataModel");
const db = require("../../configs/database");
const sendCaroChannelName = require("../send-methods/sendCaroChannelName");

module.exports = async function (ws, channelName) {
  try {
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

    const [user] = await db.execute(
      `
                SELECT * FROM players WHERE username = ?
                `,
      [ws.username]
    );
    data.secondPlayer = {
      isHost: false,
      fullName: user[0].fullName,
      username: user[0].username,
      gameType: null,
    };
    data.status = "non-start";
    caroGameDataModel.update(data);
    sendCaroChannelName(channelName, {
      type: "update-caro-success",
      payload: data,
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
