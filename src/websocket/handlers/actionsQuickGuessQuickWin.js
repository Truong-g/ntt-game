const gameDataModel = require("../../games/quickGuessQuickWinGameDataModel");
const { generateRandomRoom, shuffleWords } = require("../../utils");
const sendByQuickGuessQuickWinChannelName = require("../send-methods/sendByQuickGuessQuickWinChannelName");
module.exports = function (
  ws,
  subType,
  channelName,
  question,
  timeCountDownUpdate
) {
  const data = gameDataModel.get(channelName);
  if (!data) {
    ws.send(
      JSON.stringify({
        type: "error",
        message: "Không tìm thấy phòng",
      })
    );
    return;
  }

  switch (subType) {
    case "first-play": {
      const newData = { ...data };
      newData.status = "playing";
      const username = ws.username;
      for (let index = 0; index < newData.members.length; index++) {
        if (newData.members[index].username === username) {
          newData.members[index].isPlaying = true;
        } else {
          newData.members[index].isPlaying = false;
        }
      }
      const _newData = { ...newData };
      delete _newData.ansewerData;
      sendByQuickGuessQuickWinChannelName(_newData.channelName, {
        type: "update-success",
        payload: _newData,
      });
      break;
    }
    case "next-play": {
      const newData = { ...data };
      const username = ws.username;
      if (timeCountDownUpdate && timeCountDownUpdate?.length) {
        console.log(timeCountDownUpdate);
        for (let index = 0; index < newData.members.length; index++) {
          if (newData.members[index].username === username) {
            newData.members[index].isPlaying = true;
          } else {
            newData.members[index].isPlaying = false;
          }
          for (let j = 0; j < timeCountDownUpdate.length; j++) {
            if (
              newData.members[index].username ===
              timeCountDownUpdate[j].username
            ) {
              newData.members[index].timeCountDown =
                timeCountDownUpdate[j].timeCountDown;
            }
          }
        }
      }
      const currentNumber = newData.generalData.currentNumber + 1;
      newData.generalData.currentNumber = currentNumber;
      let currentAnswers = newData.ansewerData[currentNumber];
      currentAnswers = currentAnswers.content
        .split(" ")
        .map((item) => ({ id: generateRandomRoom(), content: item }));
      const currentQuestions = shuffleWords([...currentAnswers]);
      newData.generalData.questions = currentQuestions;
      newData.generalData.correctAnswers = currentAnswers;
      newData.generalData.answers = [];
      gameDataModel.update(newData);
      const _newData = { ...newData };
      delete _newData.ansewerData;
      sendByQuickGuessQuickWinChannelName(_newData.channelName, {
        type: "update-success",
        payload: _newData,
      });
      break;
    }
    case "pick-question": {
      const newData = { ...data };
      newData.status = "playing";
      newData.generalData.answers.push(question);
      gameDataModel.update(newData);
      const _newData = { ...newData };
      delete _newData.ansewerData;
      sendByQuickGuessQuickWinChannelName(_newData.channelName, {
        type: "update-success",
        payload: _newData,
      });
      break;
    }
    case "pick-answer": {
      const newData = { ...data };
      const answers = newData.generalData.answers.filter(
        (answer) => answer.id !== question.id
      );
      newData.generalData.answers = answers;
      gameDataModel.update(newData);
      const _newData = { ...newData };
      delete _newData.ansewerData;
      sendByQuickGuessQuickWinChannelName(_newData.channelName, {
        type: "update-success",
        payload: _newData,
      });
      break;
    }
    case "clear-answer": {
      const newData = { ...data };
      newData.generalData.answers = [];
      gameDataModel.update(newData);
      const _newData = { ...newData };
      delete _newData.ansewerData;
      sendByQuickGuessQuickWinChannelName(_newData.channelName, {
        type: "update-success",
        payload: _newData,
      });
      break;
    }
    case "game-over": {
      const newData = { ...data };
      newData.status = "playing";
      if (timeCountDownUpdate && timeCountDownUpdate?.length) {
        for (let index = 0; index < newData.members.length; index++) {
          newData.members[index].isPlaying = false;
          for (let j = 0; j < timeCountDownUpdate.length; j++) {
            if (
              newData.members[index].username ===
              timeCountDownUpdate[j].username
            ) {
              newData.members[index].timeCountDown =
                timeCountDownUpdate[j].timeCountDown;
            }
          }
        }
      }
      gameDataModel.update(newData);
      const _newData = { ...newData };
      delete _newData.ansewerData;
      sendByQuickGuessQuickWinChannelName(_newData.channelName, {
        type: "update-success",
        payload: _newData,
      });
      sendByQuickGuessQuickWinChannelName(_newData.channelName, {
        type: "game-over",
        payload: {
          loseUsername: ws.username,
          correctAnswer: _newData.generalData.correctAnswers
            .map((item) => item.content)
            .join(" "),
        },
      });
      break;
    }
    case "re-play": {
      const newData = { ...data };
      newData.status = "non-start";
      newData.generalData.questions = [];
      newData.generalData.correctAnswers = [];
      newData.generalData.answers = [];
      newData.generalData.currentNumber = 0;
      delete newData.ansewerData;
      for (let index = 0; index < newData.members.length; index++) {
        newData.members[index].isPlaying = false;
        newData.members[index].timeCountDown =
          newData.generalData.timeCountDown;
      }
      gameDataModel.update(newData);
      sendByQuickGuessQuickWinChannelName(newData.channelName, {
        type: "update-success",
        payload: newData,
      });
      break;
    }
    default:
      ws.send(
        JSON.stringify({
          type: "error",
          message: "Không tìm thấy phòng",
        })
      );
      break;
  }
};
