const { cache } = require("../../caches/config");
const disconnectQuickGuessQuickWinGame = require("../disconnectHandleEffect/disconnectQuickGuessQuickWinGame");

const wsConnectingModel = {
  add(params, destroy, onSuccess) {
    const timestamp = Date.now();
    let wsConnectingList = cache.get("ws-connecting-list");
    if (!wsConnectingList || wsConnectingList?.length === 0) {
      wsConnectingList = [{ ...params, timestamp }];
      cache.set("ws-connecting-list", wsConnectingList);
      onSuccess({ ...params, timestamp }, 1);
    } else {
      const existsWsId = wsConnectingList.some(
        (wsConnectingItem) => wsConnectingItem.wsId === params.wsId
      );
      if (existsWsId) {
        destroy();
        return;
      }
      wsConnectingList.unshift({ ...params, timestamp });
      cache.set("ws-connecting-list", wsConnectingList);
      const numberConnections = wsConnectingList.filter(
        (wsConnectingItem) => wsConnectingItem.username === params.username
      );
      onSuccess({ ...params, timestamp }, numberConnections.length);
    }
  },
  del(params, onSuccess) {
    const wsConnectingList = cache.get("ws-connecting-list");
    if (wsConnectingList && wsConnectingList?.length) {
      const _wsConnectingList = wsConnectingList.filter(
        (wsConnectingItem) => wsConnectingItem.wsId !== params.wsId
      );

      disconnectQuickGuessQuickWinGame(params.username, (channelList) => {
        console.log(channelList);
      });

      cache.set("ws-connecting-list", _wsConnectingList);
      onSuccess(_wsConnectingList);
    }
  },
};

module.exports = wsConnectingModel;
