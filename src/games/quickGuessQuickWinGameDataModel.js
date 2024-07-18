const { cache } = require("../caches/config");

const gameDataModel = {
  get(channelName) {
    let gameData = cache.get("quick-guess-quick-win-game-data");
    if (gameData) {
      const found = gameData.find((item) => item.channelName === channelName);
      return found;
    }
    return null;
  },
  update(data) {
    let gameData = cache.get("quick-guess-quick-win-game-data");
    if (gameData) {
      const index = gameData.findIndex(
        (gameDataItem) => gameDataItem.channelName === data.channelName
      );
      if (index > -1) {
        const list = [...gameData];
        list[index] = data;
        cache.set("quick-guess-quick-win-game-data", list);
      }
    }
  },
  add(data) {
    let gameData = cache.get("quick-guess-quick-win-game-data");
    if (!gameData) {
      gameData = [data];
      cache.set("quick-guess-quick-win-game-data", gameData);
    } else {
      gameData.push(data);
      cache.set("quick-guess-quick-win-game-data", gameData);
    }
  },
  delete(channelName) {
    let gameData = cache.get("quick-guess-quick-win-game-data");
    if (gameData) {
      gameData = gameData.filter((item) => item.channelName !== channelName);
      cache.set("quick-guess-quick-win-game-data", gameData);
    }
  },
};

module.exports = gameDataModel;
