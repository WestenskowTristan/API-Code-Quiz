// initailizers
$("#highscore-page").hide();
$("#question-1").hide();
$("#question-2").hide();
$("#question-3").hide();
$("#question-4").hide();
$("#is-correct").hide();
$("#is-wrong").hide();
$("#enter-highscore").hide();

//show highscore page
function showHighscorePage() {
  $("#quiz-page").hide();
  $("#highscore-page").show();
  $("#enter-highscore").hide();
  $("#header-container").show();
  $("#quiz-questions").hide();
  timer("stop");
  $("#timer-value").text(60);

  // populate highscores
  let placeHolderHighscores =
    JSON.parse(localStorage.getItem("highscores")) ?? [];
  let olEl = placeHolderHighscores.map(function (highscore, index) {
    return `<li>${highscore.initials} - ${highscore.score}</li>`;
  });

  $("#userscores").empty().html(olEl);

  // event listeners for page navigation
  $("#go-back")
    .off()
    .click(function () {
      $("#quiz-page").show();
      $("#highscore-page").hide();
    });

  // reset highscores
  $("#reset-highscores")
    .off()
    .click(function () {
      $("#userscores").empty();
      localStorage.setItem("highscores", "[]");
    });
  for (let x = 1; x <= 4; x++) {
    $(`#question-${x}`).hide();
  }
}
$("#view-highscores").click(function () {
  showHighscorePage();
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

//get correct answer
function getCorrectAnswer(questionNum) {
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

// start quiz event listener
$("#start-quiz")
  .off()
  .click(function () {
    timer("start");
    $("#header-container").hide();
    $("#quiz-questions").show();
    $("#question-1").show();
    initQuestionEventListenersFor(1);
  });

//answer event listeners
function initQuestionEventListenersFor(questionNum) {
  let correctAnswer = getCorrectAnswer(questionNum);
  if (questionNum > 1) {
    for (let x = 1; x <= 4; x++) {
      $(`#question-${questionNum - 1}-${x}`).off();
    }
  }
  for (let x = 1; x <= 4; x++) {
    if (x === correctAnswer) {
      $(`#question-${questionNum}-${x}`)
        .off()
        .click(function () {
          answer("correct", questionNum);
        });
    } else {
      $(`#question-${questionNum}-${x}`)
        .off()
        .click(function () {
          answer("wrong", questionNum);
        });
    }
  }
}

// show initails page
function showInitailsPage() {
  let timerValue = parseInt($("#timer-value").text());
  $("#enter-highscore").show();
  $("#final-score").text(`your highscore is ${timerValue}`);
  setTimeout(function () {
    $("#is-correct, #is-wrong").hide();
  }, 1000);
}

// right answer wrong answer function
function answer(action, questionNum) {
  let isCorrect = action === "correct";
  let isWrong = action === "wrong";
  let timerValue = parseInt($("#timer-value").text());
  if (timerValue === 0) {
    timer("stop");
    showInitailsPage();
    for (let x = 1; x <= 4; x++) {
      $(`#question-${x}`).hide();
    }
  } else {
    if (isCorrect) {
      $(`#question-${questionNum}`).hide();
      $("#is-correct").show();
      $("#is-wrong").hide();
      if (questionNum < 4) {
        $(`#question-${questionNum + 1}`).show();
        initQuestionEventListenersFor(questionNum + 1);
      } else {
        //show highscore page
        console.log(timerValue);
        timer("stop");
        showInitailsPage();
      }
    } else if (isWrong) {
      $(`#question-${questionNum}`).hide();
      $("#is-wrong").show();
      $("#is-correct").hide();
      if (questionNum < 4) {
        $(`#question-${questionNum + 1}`).show();
        $("#timer-value").text(timerValue - 15);
        initQuestionEventListenersFor(questionNum + 1);
      } else {
        //show highscore page
        console.log(timerValue);
        timer("stop");
        showInitailsPage();
      }
    }
  }
}

// sumbitting highscore input to highscore page
$("#highscore-submit-button").click(function () {
  let inputValue = $("#highscore-input").val();
  let timerValue = parseInt($("#timer-value").text());
  if (inputValue !== "") {
    $("#highscore-input").val("");
    let currentHighscores =
      JSON.parse(localStorage.getItem("highscores")) ?? [];
    let newHighscore = {
      score: timerValue,
      initials: inputValue,
    };
    currentHighscores.push(newHighscore);
    localStorage.setItem("highscores", JSON.stringify(currentHighscores));
    showHighscorePage();
    $("#enter-highscore").hide();
  } else {
    alert("Type in initials.");
  }
});
