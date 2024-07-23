const { getQuickGuessQuickWinList, createQuickGuessQuickWinList, deleteQuickGuessQuickWinList } = require("../controllers/management.controller");


module.exports = function (router) {
    router.get("/api/quick-guess-quick-win", getQuickGuessQuickWinList);
    router.post("/api/quick-guess-quick-win", createQuickGuessQuickWinList);
    router.post("/api/quick-guess-quick-win/delete", deleteQuickGuessQuickWinList);
  };
  