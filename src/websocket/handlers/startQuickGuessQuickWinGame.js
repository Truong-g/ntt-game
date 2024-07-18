const db = require("../../configs/database");
const gameDataModel = require("../../games/quickGuessQuickWinGameDataModel");
const { generateRandomRoom, shuffleWords } = require("../../utils");
const sendByQuickGuessQuickWinChannelName = require("../send-methods/sendByQuickGuessQuickWinChannelName");

module.exports = async function (ws, channelName, subType) {
  try {
    const data = gameDataModel.get(channelName);
    switch (subType) {
      case "wheel-player": {
        const newData = { ...data };
        newData.status = "wheel-player";

        newData.others = {
          wheelPlayerResult: 0.7,
        };

        gameDataModel.update(newData);
        sendByQuickGuessQuickWinChannelName(newData.channelName, {
          type: "update-success",
          payload: newData,
        });
        const [ansewerData] = await db.execute(
          "SELECT * FROM quick_guess_quick_win_answers"
        );
        newData.ansewerData = ansewerData;
        const currentNumber = newData.generalData.currentNumber
          ? newData.generalData.currentNumber
          : 0;
        newData.generalData.currentNumber = currentNumber;
        let currentAnswers = newData.ansewerData[currentNumber];
        currentAnswers = currentAnswers.content
          .split(" ")
          .map((item) => ({ id: generateRandomRoom(), content: item }));
        const currentQuestions = shuffleWords([...currentAnswers]);
        newData.generalData.questions = currentQuestions;
        newData.generalData.correctAnswers = currentAnswers;
        gameDataModel.update(newData);
        break;
      }
      case "starting": {
        const newData = { ...data };
        newData.status = "starting";
        gameDataModel.update(newData);
        const _newData = { ...newData };
        delete _newData.ansewerData;
        sendByQuickGuessQuickWinChannelName(_newData.channelName, {
          type: "update-success",
          payload: _newData,
        });
        break;
      }
      default:
        ws.send(
          JSON.stringify({
            type: "error",
            message: "Không có subType phù hợp",
          })
        );
        break;
    }
  } catch (error) {
    ws.send(
      JSON.stringify({
        type: "error",
        message: error.message,
      })
    );
  }
};
