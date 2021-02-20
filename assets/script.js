// initailizers
$("#highscore-page").hide();
$("#question-1").hide();
$("#question-2").hide();
$("#question-3").hide();
$("#question-4").hide();

// event listeners for page navigation
$("#go-back").click(function () {
  $("#quiz-page").show();
  $("#highscore-page").hide();
});

$("#view-highscores").click(function () {
  $("#quiz-page").hide();
  $("#highscore-page").show();
});

// populate highscores
let placeHolderHighscores = localStorage.getItem("highscores") || [
  {
    score: 25,
    initials: "TW",
  },
  {
    score: 24,
    initials: "JS",
  },
];

let olEl = placeHolderHighscores.map(function (highscore, index) {
  return `<li>${highscore.initials} - ${highscore.score}</li>`;
});

$("#userscores").empty().html(olEl);

// reset highscores
$("#reset-highscores").click(function () {
  $("#userscores").empty();
});

// timer
let interval;

function timer(action) {
  let isStop = action === "stop";
  let isStart = action === "start";

  if (isStart) {
    interval = setInterval(function () {
      let timerValue = parseInt($("#timer-value").text());
      if (timerValue > 0) {
        $("#timer-value").text(timerValue - 1);
      } else {
        timer("stop");
      }
    }, 1000);
  } else if (isStop) {
    clearInterval(interval);
  }
}

// start quiz event listener
$("#start-quiz").click(function () {
  timer("start");
  $("#header-container").hide();
  $("#question-1").show();
  initQuestionEventListenersFor(1, 4);
});

// score initiator
let playerScore = 100;

//answer event listeners
function initQuestionEventListenersFor(questionNum, correctAnswer) {
  console.log(questionNum, correctAnswer);
  if (questionNum > 1) {
    for (let x = 1; x <= 4; x++) {
      $(`#question-${questionNum - 1}-${x}`).off();
    }
  }
  for (let x = 1; x <= 4; x++) {
    console.log(x);
    if (x === correctAnswer) {
      $(`#question-${questionNum}-${x}`).click(function () {
        answer("correct", questionNum);
      });
    } else {
      $(`#question-${questionNum}-${x}`).click(function () {
        answer("wrong", questionNum);
      });
    }
  }
}

// right answer wrong answer function
function answer(action, questionNum) {
  let isCorrect = action === "correct";
  let isWrong = action === "wrong";
  function getCorrectAnswer() {
    switch (questionNum) {
      case 1:
        return 4;
      case 2:
        return 3;
      case 3:
        return 1;
      case 4:
        return 4;
    }
  }

  if (isCorrect) {
    $(`#question-${questionNum}`).hide();
    if (questionNum < 4) {
      $(`#question-${questionNum + 1}`).show();
      initQuestionEventListenersFor(questionNum + 1, getCorrectAnswer());
    } else {
      //show highscore page
      console.log(playerScore);
    }
  } else if (isWrong) {
    $(`#question-${questionNum}`).hide();
    if (questionNum < 4) {
      $(`#question-${questionNum + 1}`).show();
      playerScore = playerScore - 25;
      initQuestionEventListenersFor(questionNum + 1, getCorrectAnswer());
    } else {
      //show highscore page
      console.log(playerScore);
    }
  }
}
