const { cache } = require("../caches/config");

const caroGameDataModel = {
  get(channelName) {
    let gameData = cache.get("caro-game-data");
    if (gameData) {
      const found = gameData.find((item) => item.channelName === channelName);
      return found;
    }
    return null;
  },
  add(data) {
    let gameData = cache.get("caro-game-data");
    if (!gameData) {
      gameData = [data];
      cache.set("caro-game-data", gameData);
    } else {
      gameData.push(data);
      cache.set("caro-game-data", gameData);
    }
  },
  update(data) {
    let gameData = cache.get("caro-game-data");
    if (gameData) {
      const index = gameData.findIndex(
        (gameDataItem) => gameDataItem.channelName === data.channelName
      );
      if (index > -1) {
        const list = [...gameData];
        list[index] = data;
        cache.set("caro-game-data", list);
      }
    }
  },
};

module.exports = caroGameDataModel;
