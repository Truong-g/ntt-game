const { cache } = require("../caches/config");
const wsChannelModel = require("../websocket/models/wsChannelModel");

const getQuickGuessQuickWinGame = async (ctx) => {
  try {
    const result = cache.get("quick-guess-quick-win-game-data") || [];
    ctx.body = result;
  } catch (error) {
    ctx.throw(500, error.message);
  }
};


const getCaroGame = async (ctx) => {
  try {
    const result = cache.get("caro-game-data") || [];
    ctx.body = result;
  } catch (error) {
    ctx.throw(500, error.message);
  }
};

const createChannel = async (ctx) => {
  try {
    const { roomName, createdBy } = ctx.request.body;
    const creatingWsChannel = wsChannelModel.add({
      channelName: roomName,
      memberLimit: 2,
      createdBy: createdBy,
    });
    ctx.body = creatingWsChannel;
  } catch (error) {
    ctx.throw(500, error.message);
  }
};

const joinChannel = async (ctx) => {
  try {
    const { roomName, username } = ctx.request.body;
    wsChannelModel.join({ channelName: roomName, username });
    const foundChannel = cache
      .get("ws-channel-list")
      ?.find((wsChannelItem) => wsChannelItem.channelName === roomName);
    ctx.body = foundChannel;
  } catch (error) {
    ctx.throw(500, error.message);
  }
};

const getChannels = async (ctx) => {
  try {
    const wsChannelList = cache.get("ws-channel-list") || [];
    ctx.body = wsChannelList;
  } catch (error) {
    ctx.throw(500, error.message);
  }
};

const getUserOnline = async (ctx) => {
  try {
    const wsConnectingList = cache.get("ws-connecting-list") || [];
    ctx.body = wsConnectingList;
  } catch (error) {
    ctx.throw(500, error.message);
  }
};

module.exports = {
  getUserOnline,
  getChannels,
  createChannel,
  getQuickGuessQuickWinGame,
  joinChannel,
  getCaroGame
};
