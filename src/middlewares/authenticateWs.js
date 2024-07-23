const db = require("../configs/database");
const { convertWebsocketIdToObject } = require("../websocket/config");

module.exports = async function (request, next) {
  try {
    const secWsProtocol = request.headers["sec-websocket-protocol"];
    if (!secWsProtocol) {
      next(true, null);
      return;
    }

    const requestWs = convertWebsocketIdToObject(secWsProtocol);
    const username = requestWs.username;
    const [rows] = await db.execute(
      `SELECT * FROM players WHERE username = ?`,
      [username]
    );
    if (!rows.length) {
      console.error("authenWs: ", rows);
      next(true, null);
      return;
    }
    next(false, requestWs);
  } catch (error) {
    console.error("authenWs: ", error);
    next(true, null);
  }
};
