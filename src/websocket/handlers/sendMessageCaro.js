const sendCaroChannelName = require("../send-methods/sendCaroChannelName");

module.exports = function (channelName, payload) {
  sendCaroChannelName(channelName, {
    type: "send-message-caro-success",
    payload: { ...payload, timestamp: Date.now() },
  });
};
