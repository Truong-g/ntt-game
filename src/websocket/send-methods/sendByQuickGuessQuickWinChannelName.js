const { wss } = require("..");
const { cache } = require("../../caches/config");

module.exports = function (channelName, data) {
  const root = cache.get("quick-guess-quick-win-game-data") || [];
  if (root) {
    const found = root.find(
      (membersItem) => membersItem.channelName === channelName
    );
    if (found) {
      const filteredMembers = found.members;
      Array.from(wss.clients).forEach((client) => {
        if (
          filteredMembers.some(
            (filteredMember) => filteredMember.username === client.username
          )
        ) {
          client.send(JSON.stringify(data));
        }
      });
    }
  }
};
