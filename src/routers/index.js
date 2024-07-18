const Router = require("koa-router");
const authRoutes = require("./authRoutes");
const authMiddleware = require("../middlewares/authMiddleware");
const questionRoutes = require("./questionRoutes");
const userRoutes = require("./userRoutes");
const playerRoutes = require("./playerRoutes");
const gameRoutes = require("./gameRoutes");
module.exports = function initialRoutes() {
  const router = new Router();
  authRoutes(router);
  playerRoutes(router);
  gameRoutes(router);

  router.use(authMiddleware);
  userRoutes(router);
  questionRoutes(router);
  return router;
};
