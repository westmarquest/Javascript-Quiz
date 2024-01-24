// Declare variables at the beginning to ensure they have global scope
const startBtn = document.getElementById("start-btn");
const quizContainer = document.getElementById("quiz-container");
const submitBtn = document.getElementById("submit-btn");
const leaveBtn = document.getElementById("leave-btn");
const rightSound = document.getElementById("rightSound");
const wrongSound = document.getElementById("wrongSound");

const timerDisplay = document.getElementById("timer");
let timer;
const totalTime = 60;

const scoreboard = document.createElement("div");
scoreboard.classList.add("scoreboard");
document.body.appendChild(scoreboard);

let currentQuestionIndex = 0;
let score = 0;
let quizStarted = false;
const timeLimitInSeconds = 60;

// Retrieve user's score from local storage
const userScore = localStorage.getItem("userScore");
if (userScore) {
  score = parseInt(userScore, 10);
}

const questions = [
  {
    question: "What is JavaScript?",
    options: [
      "A programming language",
      "A type of coffee",
      "A new dance move",
      "A car brand",
    ],
    correctAnswer: 0,
  },
  {
    question:
      "What is the purpose of the 'use strict' directive in JavaScript?",
    options: [
      "Enforce a more strict parsing and error handling of the code",
      "Allow the use of new ECMAScript features",
      "Indicate the use of a strict mode for better performance",
      "It has no specific purpose",
    ],
    correctAnswer: 0,
  },
  {
    question:
      "Which method is used to remove the last element from an array in JavaScript?",
    options: ["pop()", "removeLast()", "deleteLast()", "splice()"],
    correctAnswer: 0,
  },
  {
    question:
      "What is the purpose of the 'localStorage' object in web development?",
    options: [
      "To store data that has no expiration time",
      "To store data with a specific expiration time",
      "To store data on the server",
      "To store temporary data during a session",
    ],
    correctAnswer: 0,
  },
  {
    question: "What is the output of the following code: console.log(1 + '1')?",
    options: ["2", "11", "undefined", "Error"],
    correctAnswer: 1,
  },
  {
    question: "In JavaScript, what does the 'this' keyword refer to?",
    options: [
      "The current function being executed",
      "The global object",
      "The object that owns the function",
      "A reference to the previous object",
    ],
    correctAnswer: 2,
  },
  {
    question: "What does the acronym AJAX stand for?",
    options: [
      "Asynchronous JavaScript and XML",
      "All JavaScript and XML",
      "Active JavaScript and XML",
      "Asynchronous JavaScript and XHTML",
    ],
    correctAnswer: 0,
  },
  {
    question:
      "Which method is used to add a new element to the end of an array in JavaScript?",
    options: ["push()", "append()", "addToEnd()", "insertLast()"],
    correctAnswer: 0,
  },
  {
    question: "What is the purpose of the 'bind' method in JavaScript?",
    options: [
      "To create a new function with a specified 'this' value",
      "To concatenate two strings",
      "To remove an element from an array",
      "To execute a function after a delay",
    ],
    correctAnswer: 0,
  },
  {
    question:
      "Which keyword is used to declare a constant variable in JavaScript?",
    options: ["var", "let", "const", "static"],
    correctAnswer: 2,
  },
  {
    question: "What is the result of the expression: 5 + '5' in JavaScript?",
    options: ["55", "10", "Error", "undefined"],
    correctAnswer: 0,
  },
  {
    question: "What is the purpose of the 'map' method in JavaScript?",
    options: [
      "To create a new array with the results of calling a provided function on every element in the array",
      "To remove elements from an array",
      "To check if a particular element is present in an array",
      "To concatenate two arrays",
    ],
    correctAnswer: 0,
  },
  {
    question: "What does the term 'hoisting' refer to in JavaScript?",
    options: [
      "The process of lifting weights in the gym",
      "The process of moving declarations to the top of the code",
      "The process of optimizing code for better performance",
      "The process of handling asynchronous events",
    ],
    correctAnswer: 1,
  },
  {
    question:
      "Which function is used to convert a string to an integer in JavaScript?",
    options: ["parseInt()", "parseFloat()", "toFixed()", "toString()"],
    correctAnswer: 0,
  },
  {
    question:
      "What is the purpose of the 'event.preventDefault()' method in JavaScript?",
    options: [
      "To prevent the default behavior of an HTML element",
      "To stop the propagation of an event",
      "To remove an event listener",
      "To trigger a default behavior for an HTML element",
    ],
    correctAnswer: 0,
  },
  {
    question:
      "Which operator is used for strict equality comparison in JavaScript?",
    options: ["==", "===", "!=", "!=="],
    correctAnswer: 1,
  },
  {
    question:
      "What is the role of the 'JSON.stringify()' method in JavaScript?",
    options: [
      "To parse a JSON string",
      "To convert a JavaScript object to a JSON string",
      "To stringify a JavaScript array",
      "To create a JSON object",
    ],
    correctAnswer: 1,
  },
  {
    question: "What is the purpose of the 'async' keyword in JavaScript?",
    options: [
      "To define a function that always returns a promise",
      "To indicate that a function is asynchronous and returns a promise",
      "To create an asynchronous loop",
      "To handle errors in asynchronous code",
    ],
    correctAnswer: 1,
  },
  {
    question:
      "Which method is used to remove the first element from an array in JavaScript?",
    options: ["shift()", "removeFirst()", "deleteFirst()", "pop()"],
    correctAnswer: 0,
  },
];

// Declare functions
function startQuiz() {
  quizStarted = true;
  currentQuestionIndex = 0;
  score = 0;
  startBtn.style.display = "none";
  submitBtn.style.display = "block";
  leaveBtn.style.display = "block";

  console.log("Before timer update:", timerDisplay.innerHTML);

  // Update the timer display
  timerDisplay.innerHTML = formatTime(totalTime);

  // Log to check the order of execution
  console.log("After timer update:", timerDisplay.innerHTML);

  loadQuestion();
  startTimer();
  displayPreviousScores(false);
}

function shuffleQuestions() {
  for (let i = questions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questions[i], questions[j]] = [questions[j], questions[i]];
  }
}

function leaveQuiz() {
  scoreboard.innerHTML = `Score: ${score} out of ${questions.length}`;
  quizStarted = false;
  currentQuestionIndex = 0;
  score = 0;
  quizContainer.innerHTML = "";
  submitBtn.style.display = "none";
  leaveBtn.style.display = "none";
}

function loadQuestion() {
  const currentQuestion = questions[currentQuestionIndex];
  quizContainer.innerHTML = `
    <h2>${currentQuestion.question}</h2>
    <ul id="answer-list">
      ${currentQuestion.options
        .map((option, index) => `<li>${option}</li>`)
        .join("")}
    </ul>
  `;

  const options = document.querySelectorAll("#answer-list li");
  options.forEach((option, index) => {
    option.addEventListener("click", () => selectAnswer(index));
  });

  submitBtn.style.display = "none";
}

function selectAnswer(index) {
  const options = document.querySelectorAll("#answer-list li");
  options.forEach((option) => option.classList.remove("active", "selected"));
  options[index].classList.add("active", "selected");
  submitBtn.style.display = "block";
}

function submitAnswer() {
  const selectedAnswer = document.querySelector("#answer-list li.active");
  if (selectedAnswer) {
    const answerText = selectedAnswer.textContent;
    const correctAnswer =
      questions[currentQuestionIndex].options[
        questions[currentQuestionIndex].correctAnswer
      ];

    if (answerText === correctAnswer) {
      showFeedback(true);
    } else {
      showFeedback(false);
      // Adjust the timer if needed on incorrect answers
      // For example, subtract 10 seconds:
      subtractTime(5);
    }

    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
      loadQuestion();
      submitBtn.style.display = "none";
    } else {
      // nextBtn.style.display = "block";
      endGame();
    }
  }
}

function subtractTime(seconds) {
  let currentTime =
    parseInt(timerDisplay.innerHTML.split(":")[0]) * 60 +
    parseInt(timerDisplay.innerHTML.split(":")[1]);
  currentTime -= seconds;
  timerDisplay.innerHTML = formatTime(currentTime);
}

function nextQuestion() {
  console.log("next");
  scoreboard.innerHTML = "";
  if (currentQuestionIndex < questions.length) {
    loadQuestion();
    submitBtn.style.display = "none";
    nextBtn.style.display = "none"; // Hide the next button initially
  } else {
    endGame();
  }
}

function endGame() {
  scoreboard.innerHTML = `Your final score is ${score} out of ${questions.length}.`;
  const userInitials = prompt("Enter your initials:");

  // Save user's initials and score to local storage
  saveScore(userInitials, score);

  // Display previous scores
  displayPreviousScores(true);

  submitBtn.style.display = "none";

  leaveBtn.style.display = "none";

  leaveQuiz();
}

function saveScore(initials, score) {
  clearInterval(timer);
  // Retrieve previous scores from local storage
  const previousScores =
    JSON.parse(localStorage.getItem("previousScores")) || [];

  // Add current score to the list
  previousScores.push({ initials, score });

  // Save updated scores to local storage
  localStorage.setItem("previousScores", JSON.stringify(previousScores));

  leaveQuiz();
  startBtn.style.display = "block";
  displayPreviousScores(true);
}

const previousScoresDiv = document.createElement("div");
previousScoresDiv.id = "previous-scores-div";
previousScoresDiv.style.overflow = "auto";
previousScoresDiv.style.position = "fixed";
previousScoresDiv.style.bottom = "0";
previousScoresDiv.style.width = "100%";
previousScoresDiv.style.maxHeight = "250px";
previousScoresDiv.style.border = "1px solid #ccc"; // Border style
previousScoresDiv.style.padding = "10px";
document.body.appendChild(previousScoresDiv);

function displayPreviousScores(show) {
  const previousScoresContainer = document.getElementById(
    "previous-scores-div"
  );

  if (show) {
    // Retrieve previous scores from local storage
    const previousScores =
      JSON.parse(localStorage.getItem("previousScores")) || [];

    const filteredScores = previousScores.filter(
      (entry) => entry.initials !== null
    );

    // Display previous scores
    previousScoresContainer.innerHTML = "<h3>Previous Scores:</h3>";
    previousScores.forEach((entry) => {
      const entryElement = document.createElement("p");
      entryElement.textContent = `${entry.initials}: ${entry.score} out of ${questions.length}`;
      previousScoresContainer.appendChild(entryElement);
    });
  } else {
    // Hide previous scores
    previousScoresContainer.innerHTML = "";
  }
}

function showFeedback(isCorrect) {
  const feedback = document.createElement("div");
  feedback.classList.add("feedback");
  feedback.textContent = isCorrect ? "Correct! 🎉" : "Wrong! 😞";
  document.body.appendChild(feedback);

  if (isCorrect) {
    score++; // Increment the score only if the answer is correct
  }

  scoreboard.innerHTML = `Correct Answers: ${score} out of 20`;

  if (isCorrect) {
    rightSound.play();
  } else {
    wrongSound.play();
  }

  setTimeout(function () {
    document.body.removeChild(feedback);

    // Check if the game has ended and update the scoreboard accordingly
    if (currentQuestionIndex >= questions.length) {
      scoreboard.innerHTML = `Your final score is ${score} out of ${questions.length}.`;
    }
  }, 1500);
}

function startTimer() {
  let timeRemaining = timeLimitInSeconds;
  timer = setInterval(function () {
    timeRemaining--;
    if (timeRemaining >= 0) {
      timerDisplay.innerHTML = formatTime(timeRemaining); // Update the timer display
    } else {
      clearInterval(timer);
      endGame();
    }
  }, 1000);
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");
  return `${formattedMinutes}:${formattedSeconds}`;
}

// Event listeners
startBtn.addEventListener("click", startQuiz);
submitBtn.addEventListener("click", submitAnswer);
leaveBtn.addEventListener("click", leaveQuiz);

displayPreviousScores(questions.length > 0);
