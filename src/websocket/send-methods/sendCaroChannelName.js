

const { wss } = require("..");
const { cache } = require("../../caches/config");

module.exports = function (channelName, data) {
  const root = cache.get("caro-game-data") || [];
  if (root) {
    const found = root.find(
      (membersItem) => membersItem.channelName === channelName
    );
    console.log(found);
    if (found) {
      const filteredMembers = [found.firstPlayer.username, found.secondPlayer.username]
      console.log(filteredMembers);
      Array.from(wss.clients).forEach((client) => {
        if (
          filteredMembers.some(
            (filteredMember) => filteredMember === client.username
          )
        ) {
          client.send(JSON.stringify(data));
        }
      });
    }
  }
};
