const {
  getUserOnline,
  getChannels,
  createChannel,
  getQuickGuessQuickWinGame,
  joinChannel,
} = require("../controllers/games.controller");

module.exports = function (router) {
  router.get("/api/get-user-online", getUserOnline);
  router.get("/api/get-channels", getChannels);
  router.get(
    "/api/get-quick-guess-quick-win-game-data",
    getQuickGuessQuickWinGame
  );
  router.post("/api/create-channel", createChannel);
  router.post("/api/join-channel", joinChannel);
};
