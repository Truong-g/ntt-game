const { cache } = require("../../caches/config");

const wsChannelModel = {
  add(params) {
    const timestamp = Date.now();
    let wsMemberList = cache.get("ws-member-list");
    if (!wsMemberList || wsMemberList?.length === 0) {
      wsMemberList = [
        {
          channelName: params.channelName,
          username: params.createdBy,
          timestamp,
        },
      ];
      cache.set("ws-member-list", wsMemberList);
    } else {
      wsMemberList.push({
        channelName: params.channelName,
        username: params.createdBy,
        timestamp,
      });
      cache.set("ws-member-list", wsMemberList);
    }
    let wsChannelList = cache.get("ws-channel-list");
    const newWsChannelItem = { ...params, timestamp };
    if (!wsChannelList || wsChannelList?.length === 0) {
      wsChannelList = [newWsChannelItem];
      cache.set("ws-channel-list", wsChannelList);
      return newWsChannelItem;
    } else {
      const existsChannel = wsChannelList.some(
        (wsChannelItem) => wsChannelItem.channelName === params.channelName
      );
      if (existsChannel) {
        throw new Error("Phòng đã tồn tại");
      }
      wsChannelList.push(newWsChannelItem);
      cache.set("ws-channel-list", wsChannelList);
      return newWsChannelItem;
    }
  },
  join(params) {
    const timestamp = Date.now();
    const wsMemberList = cache.get("ws-member-list");
    if (wsMemberList) {
      wsMemberList.push({
        channelName: params.channelName,
        username: params.username,
        timestamp,
      });
      cache.set("ws-member-list", wsMemberList);
    }
  },
  del(params, onSuccess) {},
  delByOwnerLeft(username) {
    let wsChannelList = cache.get("ws-channel-list");
    if (wsChannelList && wsChannelList?.length) {
      const _wsChannelList = wsChannelList.filter(
        (wsChannelItem) => wsChannelItem.createdBy === username
      );

      let wsMemberList = cache.get("ws-member-list");
      if (wsMemberList && wsMemberList?.length) {
        wsMemberList = wsMemberList.filter((wsMemberItem) => {
          return _wsChannelList.every(
            (_wsChannelItem) =>
              _wsChannelItem.channelName !== wsMemberItem.channelName
          );
        });
        cache.set("ws-member-list", wsMemberList);
      }
      wsChannelList = wsChannelList.filter(
        (wsChannelItem) => wsChannelItem.createdBy !== username
      );
      cache.set("ws-channel-list", wsChannelList);
    }
  },
};

module.exports = wsChannelModel;
