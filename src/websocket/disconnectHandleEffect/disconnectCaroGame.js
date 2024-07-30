const { cache } = require("../../caches/config");

module.exports = function (username) {
  let gameData = cache.get("caro-game-data");
  if (gameData) {
    for (let index = 0; index < gameData.length; index++) {
      if (gameData[index].secondPlayer.username === username) {
        delete gameData[index].secondPlayer;
      }
    }
    const tmpArr = [];
    for (let index = 0; index < gameData.length; index++) {
      if (gameData[index].firstPlayer.username === username) {
        tmpArr.push(gameData[index]);
      }
    }
    gameData = gameData.filter((item) => {
      return tmpArr.every((_item) => _item.channelName !== item.channelName);
    });
    cache.set("caro-game-data", gameData);
  }
};
