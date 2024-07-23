const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const initialRoutes = require("./src/routers/index");
const cors = require("@koa/cors");
const http = require("http");
const onSocketError = require("./src/exceptions/onSocketError");
const authenticateWs = require("./src/middlewares/authenticateWs");
const { wss } = require("./src/websocket");
const wsConnectingModel = require("./src/websocket/models/wsConnectingModel");
const createQuickGuessQuickWin = require("./src/websocket/handlers/createQuickGuessQuickWin");
const findQuickGuessQuickWin = require("./src/websocket/handlers/findQuickGuessQuickWin");
const joinQuickGuessQuickWin = require("./src/websocket/handlers/joinQuickGuessQuickWin");
const startQuickGuessQuickWinGame = require("./src/websocket/handlers/startQuickGuessQuickWinGame");
const actionsQuickGuessQuickWin = require("./src/websocket/handlers/actionsQuickGuessQuickWin");
const leaveQuickGuessQuickWin = require("./src/websocket/handlers/leaveQuickGuessQuickWin");
require("./src/caches/config");

const app = new Koa();
const router = initialRoutes();

//cors
app.use(cors());

// Middleware
app.use(bodyParser());

// Use the routes defined
app.use(router.routes()).use(router.allowedMethods());

const server = http.createServer(app.callback());

wss.on("connection", (ws, rquest, client) => {
  ws.username = client.username;
  wsConnectingModel.add(
    client,
    () => {
      ws.close();
      ws.destroy();
    },
    (currentValue, numberConnections) => {
      ws.send(
        JSON.stringify({
          type: "connected",
          wsId: currentValue.wsId,
          username: currentValue.username,
          timestamp: currentValue.timestamp,
          numberConnections: numberConnections,
        })
      );
    }
  );
  ws.on("message", (message) => {
    const data = JSON.parse(message.toString());
    switch (data.type) {
      case "create-quick-guess-quick-win-game": {
        createQuickGuessQuickWin(ws, data.channelName, data.timeCountDown);
        break;
      }
      case "find-quick-guess-quick-win-game": {
        findQuickGuessQuickWin(ws, data.channelName, data.transaction);
        break;
      }
      case "join-quick-guess-quick-win-game": {
        joinQuickGuessQuickWin(ws, data.channelName);
        break;
      }
      case "start-quick-guess-quick-win-game": {
        startQuickGuessQuickWinGame(ws, data.channelName, data.subType);
        break;
      }
      case "actions-quick-guess-quick-win-game": {
        actionsQuickGuessQuickWin(
          ws,
          data.subType,
          data.channelName,
          data.answer,
          data.timeCountDownUpdate,
          data.currentMessage
        );
        break;
      }
      case "leave-quick-guess-quick-win-game": {
        leaveQuickGuessQuickWin(ws, data.channelName);
        break;
      }
      default:
        break;
    }
  });
  ws.on("close", () => {
    wsConnectingModel.del(client, (_wsConnectingList) => {
      // console.log("DEL SUCCESS: ", client, _wsConnectingList);
    });
  });
});
server.on("upgrade", function (request, socket, head) {
  socket.on("error", onSocketError);
  authenticateWs(request, function next(err, client) {
    if (err || !client) {
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
      socket.destroy();
      return;
    }
    socket.removeListener("error", onSocketError);
    wss.handleUpgrade(request, socket, head, function done(ws) {
      wss.emit("connection", ws, request, client);
    });
  });
});

// Start the server
const PORT = 8000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
