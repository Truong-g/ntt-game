const { cache } = require("../../caches/config");
const gameDataModel = require("../../games/quickGuessQuickWinGameDataModel");
const sendByQuickGuessQuickWinChannelName = require("../send-methods/sendByQuickGuessQuickWinChannelName");

module.exports = function (username, onSend) {
  let gameData = cache.get("quick-guess-quick-win-game-data");
  if (gameData) {
    const channelList = [];
    const _channelList = [];
    for (let index = 0; index < gameData.length; index++) {
      const members = gameData[index].members;
      if (
        members.some((member) => member.username === username && member.isHost)
      ) {
        channelList.push(gameData[index].channelName);
      } else if (
        members.some((member) => member.username === username && !member.isHost)
      ) {
        _channelList.push(gameData[index].channelName);
      }
    }

    if (channelList.length) {
      gameData = gameData.filter((item) => {
        return !channelList.includes(item.channelName);
      });
      for (let index = 0; index < channelList.length; index++) {
        const channelItem = channelList[index];
        sendByQuickGuessQuickWinChannelName(channelItem, {
          type: "channel-deleted",
        });
      }
      cache.set("quick-guess-quick-win-game-data", gameData);
    } else {
      gameData = gameData.map((item) => {
        const members = item.members.filter(
          (member) => member.username !== username
        );
        return {
          ...item,
          members: members,
        };
      });
      onSend(_channelList);
      cache.set("quick-guess-quick-win-game-data", gameData);
    }

    // for (let index = 0; index < members.length; index++) {
    //   if (members[index].username === username && members[index].isHost) {
    //     sendByQuickGuessQuickWinChannelName(channelName, {
    //       type: "channel-deleted",
    //     });
    //     gameDataModel.delete(channelName);
    //     return;
    //   }
    // }
  }
};
