// -----------------------------------------------
// Changable Parameters
// -----------------------------------------------

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("sw.js")
    .then((reg) => console.log("Registered Successfuly ", reg))
    .catch((err) => console.log("Not Registered ", err));
}

// Allowed number of words are divisble by 3
// (3, 6, 9, 12, 18 ,..)
const numWords = 6;
const WORDS = {
  3: [
    "age",
    "bee",
    "ant",
    "cat",
    "old",
    "new",
    "all",
    "any",
    "how",
    "day",
    "jet",
    "one",
    "boy",
    "way",
    "zoo",
    "log",
    "vet",
    "well",
    "yet",
    "air",
    "bag",
    "far",
    "hey",
    "hug",
    "ice",
    "sky",
    "eye",
  ],

  4: [
    "love",
    "life",
    "ring",
    "near",
    "five",
    "king",
    "time",
    "star",
    "city",
    "soul",
    "duck",
    "rain",
    "ball",
    "cake",
    "care",
    "wild",
    "tree",
    "drop",
    "kite",
    "plane",
    "sand",
    "dust",
    "wind",
    "hair",
    "bear",
    "bird",
    "girl",
    "fast",
  ],

  5: [
    "world",
    "seven",
    "about",
    "again",
    "heart",
    "water",
    "month",
    "happy",
    "dream",
    "laugh",
    "faith",
    "earth",
    "piano",
    "peace",
    "house",
    "watch",
    "smile",
    "storm",
    "light",
    "grass",
    "cloud",
    "quick",
  ],
};

const motivatingWords = [
  "Amazing!",
  "Great Job!",
  "So Good!",
  "Wonderful!",
  "Pretty Awesome!",
  "Fabulous!",
  "Out Standing!",
  "There you go!",
  "Keep it up!",
  "You can do it!",
];

const onCompleteWords = [
  "You did it!",
  "Congrats!",
  "You have done it!",
  "Finally!",
];

// -----------------------------------------------
// Constants and Global variables
// -----------------------------------------------

const directions = [
  "left",
  "right",
  "top",
  "bottom",
  "drt",
  "drb",
  "dlt",
  "dlb",
];

const alphabet = "abcdefghijklmnopqrstuvwxyz";

const ROWS = 12;
const COLS = 12;
const addBtn = document.querySelector(".add-btn");
const addInput = document.querySelector(".add-input");
const hintsList = document.querySelector(".hints-list");
const msg = document.querySelector(".message");
const boardElement = document.querySelector(".board");

let foundCounter = 0;
let correctWords = [];
let occupiedPaths = [];
let userLetters = [];
let userPath = [];
let userNewWord = "";

let i = 0;

// Section 1 -- Placing onto Board
// Section 2 -- User Input
// Section 3 -- Board Construction

// ---------------------------------------------------
// Section 1 -- Placing correct words onto the board
// ---------------------------------------------------

const isOccupied = (row, col) => {
  // Detects whether a cell is already occupied by a letter or not according to "occupiedPaths"
  // Inputs: row, col -- the current point to check
  // Outputs: boolean (occupied or not)

  let occupied = false;
  occupiedPaths.forEach((occupiedPath) => {
    if (occupiedPath[0] == row && occupiedPath[1] == col) {
      occupied = true;
    }
  });
  return occupied;
};

const findClearPath = (length) => {
  // Finds a empty path (series of cells) to place a correct word in
  // Uses the "isOccupied" function
  // Inputs: length -- the length of the word
  // Output: A new empty path to place the word in,
  //         or an empty array [] in case the path is occupied

  let path = [];
  // pick a random starting cell
  let rowStart = Math.floor(Math.random() * ROWS);
  let colStart = Math.floor(Math.random() * COLS);
  // pick a random direction
  let newDirection = directions[Math.floor(Math.random() * directions.length)];

  for (let i = 0; i < length; i++) {
    // Checks if the current cell is already occupied
    if (!isOccupied(rowStart, colStart)) {
      path.push([rowStart, colStart]);
      if (newDirection == "right") {
        // save the cell in case it's not occupied
        // Return [] if we  exceed the board size
        colStart++;
        if (colStart > COLS) return [];
      } else if (newDirection == "left") {
        colStart--;
      } else if (newDirection == "top") {
        rowStart--;
      } else if (newDirection == "bottom") {
        rowStart++;
      } else if (newDirection == "drt") {
        rowStart--;
        colStart++;
      } else if (newDirection == "drb") {
        rowStart++;
        colStart++;
      } else if (newDirection == "dlt") {
        rowStart--;
        colStart--;
      } else if (newDirection == "dlb") {
        rowStart++;
        colStart--;
      }
      if (rowStart > ROWS || colStart > COLS || rowStart < 0 || colStart < 0)
        return [];
    } else return [];
  }
  return path;
};

const addWordFromPath = (word, path) => {
  // Placing the word on the board according  to a path
  // Inputs: word -- the word to place
  //         path -- the free path

  word.split("").forEach((letter) => {
    let nextCell = path.pop();
    document.querySelector(
      `[data-row="${nextCell[0]}"][data-col="${nextCell[1]}"]`
    ).innerHTML = letter;
  });
};

const placeCorrect = () => {
  // Places the correct words on the board by finding empty paths for them
  // Uses the "findClearPath" and "addWordFromPath" functions

  occupiedPaths = [];

  correctWords.forEach((word) => {
    let path = [];
    let trials = 0;
    let wordPut = true;

    do {
      path = findClearPath(word.length);
      trials++;
      if (trials > 400) {
        // If the code fails at placing the word many times
        // it will skip it and inform the player
        wordPut = false;
        break;
      }
    } while (path.length == 0);
    if (!wordPut) {
      msg.innerHTML = "Word can't be placed!";
    } else {
      occupiedPaths.push(...path);
      addWordFromPath(word, path);
    }
  });

  // Adding the inputted word by the user
  let word = userNewWord;
  if (word) {
    let path = [];
    let trials = 0;
    let wordPut = true;
    do {
      path = findClearPath(word.length);
      trials++;
      if (trials > 400) {
        wordPut = false;
        break;
      }
    } while (path.length == 0);
    if (!wordPut) {
      msg.innerHTML = "Word can't be placed!";
    } else {
      occupiedPaths.push(...path);
      addWordFromPath(word, path);
      correctWords.push(word);
      let newHint = document.createElement("li");
      newHint.classList.add("hint-item");
      newHint.innerHTML = word;
      hintsList.appendChild(newHint);
    }
  }
};

function detectLeftButton(evt) {
  evt = evt || window.event;
  if ("buttons" in evt) {
    return evt.buttons == 1;
  }
  var button = evt.which || evt.button;
  return button == 1;
}

const constructBoard = () => {
  // Constructs an empty board according to a number of rows and columns
  // Changing the rows and cols will require changing the widths and heights

  for (let i = 0; i < ROWS; i++) {
    let newRow = document.createElement("ul");
    // Creates a new row in the board
    newRow.setAttribute("style", `width: ${600}px; height: ${50}px;`);

    for (let j = 0; j < COLS; j++) {
      let newChild = document.createElement("li");
      newChild.dataset.row = i;
      newChild.dataset.col = j;
      newChild.classList.add("cell");

      newChild.addEventListener("mousedown", (e) => {
        clickedCell(e);
      });

      newChild.addEventListener("mouseenter", (e) => {
        if (detectLeftButton(e)) clickedCell(e);
      });

      newRow.appendChild(newChild);
    }
    boardElement.appendChild(newRow);
  }
};

// ---------------------------------------------------
// Section 2 -- Handling User Input (Clicking a cell)
// ---------------------------------------------------

// Checks if all elements of an array are equal
const areAllEqual = (rows) => rows.every((v) => v === rows[0]);

// Checks if all elements of an array are followups (incrementing or decrementing)
const areAllFollowUps = (arr) => {
  for (let i = 1; i < arr.length; i++) {
    if (arr[i - 1] + 1 != arr[i]) return false;
  }
  return true;
};

const isValidPath = (userPath) => {
  // Detects whether a user-selected path is valid or not (connected or not)
  // Uses the "areAllEqual" and "areAllFollowups" functions
  // Inputs: userPath -- the path created by the user (selected cells)

  let rows = userPath.map((point) => parseInt(point[0])).sort((a, b) => a - b);
  let cols = userPath.map((point) => parseInt(point[1])).sort((a, b) => a - b);

  if (areAllEqual(rows) && areAllFollowUps(cols)) return true;
  else if (areAllFollowUps(rows) && areAllEqual(cols)) return true;
  else if (areAllFollowUps(rows) && areAllFollowUps(cols)) return true;
  return false;
};

const unselectPoint = (userPath, row, col) => {
  // Unselects a cell when the user re-clicks it
  // Inputs: userPath -- the path to remove the cell from
  //         row, col -- the cell coordinates

  return userPath.filter(
    (point) =>
      parseInt(point[0]) != parseInt(row) || parseInt(point[1]) != parseInt(col)
  );
};

const reverseString = (str) => {
  // Reverses a String
  return str.split("").reverse().join("");
};

const getWord = (userPath) => {
  // Gets a word from the user-selected path
  // Handles all possible combinations and strange user behavior

  let userStrings = [];

  let userArray = [];
  // separating rows and columns and sorting them
  let rows = userPath.map((point) => parseInt(point[0])).sort((a, b) => a - b);
  let cols = userPath.map((point) => parseInt(point[1])).sort((a, b) => a - b);
  for (let i = 0; i < rows.length; i++) {
    userArray.push(
      document
        .querySelector(`[data-row="${rows[i]}"][data-col="${cols[i]}"]`)
        .innerHTML.toLowerCase()
    );
  }
  userStrings.push(userArray.join(""), reverseString(userArray.join("")));

  userArray = [];
  // separating rows and columns and sorting them
  rows = userPath.map((point) => parseInt(point[0])).sort((a, b) => b - a);
  cols = userPath.map((point) => parseInt(point[1])).sort((a, b) => a - b);
  for (let i = 0; i < rows.length; i++) {
    userArray.push(
      document
        .querySelector(`[data-row="${rows[i]}"][data-col="${cols[i]}"]`)
        .innerHTML.toLowerCase()
    );
  }
  userStrings.push(userArray.join(""), reverseString(userArray.join("")));

  userArray = [];
  // separating rows and columns and sorting them
  rows = userPath.map((point) => parseInt(point[0])).sort((a, b) => a - b);
  cols = userPath.map((point) => parseInt(point[1])).sort((a, b) => b - a);
  for (let i = 0; i < rows.length; i++) {
    userArray.push(
      document
        .querySelector(`[data-row="${rows[i]}"][data-col="${cols[i]}"]`)
        .innerHTML.toLowerCase()
    );
  }
  userStrings.push(userArray.join(""), reverseString(userArray.join("")));

  return userStrings;
};

const clickedCell = (e) => {
  // An event handler for cell click

  msg.innerHTML = "";

  // getting the coordinate of the selected or deselected cell
  let row = e.target.dataset.row;
  let col = e.target.dataset.col;

  // checks if the cell is already selected
  if (e.target.classList.contains("cell-clicked")) {
    userPath = unselectPoint(userPath, row, col);
    e.target.classList.remove("cell-clicked");
  } else {
    userPath.push([row, col]);
    e.target.classList.add("cell-clicked");
  }

  // Checks if the user-selected path is connected
  if (isValidPath(userPath)) {
    let anagrams = getWord(userPath);
    // checking if the selected word is similar to any correct word
    correctWords.forEach((word) => {
      word = word.toLowerCase();
      if (anagrams.includes(word)) {
        // updates the ui and informs the user on finding a match
        updateOnFound(word);
        userLetters = [];
        userPath = [];
      }
    });
  } else {
    msg.innerHTML = "letters should be connected!";
  }
};

const updateOnFound = (word) => {
  // Uses a matched word to update the ui and inform the user

  foundCounter++;
  let remaining = correctWords.length - foundCounter;
  msg.classList.add("new-message");

  if (remaining == 0) {
    // If all words are found, finish the game
    let newWord =
      onCompleteWords[Math.floor(Math.random() * onCompleteWords.length)];
    msg.classList.add("found-all");
    msg.innerHTML = newWord;
  } else {
    // If a new word is found, inform remaining words
    let newWord =
      motivatingWords[Math.floor(Math.random() * motivatingWords.length)];
    msg.innerHTML = `${newWord} <br>${remaining} to go`;
  }

  // Removes the class after the animation is complete
  setTimeout(() => {
    msg.classList.remove("new-message");
  }, 500);

  const allHints = document.querySelectorAll(".hint-item");
  allHints.forEach((hint) => {
    // updates the corresponding hint
    if (hint.innerHTML.toLowerCase() == word.toLowerCase()) {
      hint.classList.add("hint-found");
    }
  });

  userPath.forEach((loc) => {
    // updates the corresponding cells
    document
      .querySelector(`[data-row="${loc[0]}"][data-col="${loc[1]}"]`)
      .classList.add("mark-found");
  });
};

const fillBoard = () => {
  // Fills the board with random letters after placing the correct words
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      if (
        !document.querySelector(`[data-row="${i}"][data-col="${j}"]`).innerHTML
      ) {
        let letter = alphabet[Math.floor(Math.random() * alphabet.length)];
        document.querySelector(
          `[data-row="${i}"][data-col="${j}"]`
        ).innerHTML = letter;
      }
    }
  }
};

const boardReset = () => {
  // Resets everything without a page reload

  msg.innerHTML = "Find all Words";
  msg.classList.remove("found-all");
  document.querySelectorAll(".hint-item").forEach((hint) => {
    hint.classList.remove("hint-found");
  });
  foundCounter = 0;
  boardElement.innerHTML = "";
  constructBoard();
  placeCorrect();
  fillBoard();
  boardElement.classList.add("add-animation");
};

addInput.addEventListener("keypress", (e) => {
  if (e.keyCode == 13) {
    // Detects enterkey on the input
    userNewWord = addInput.value;
    if (correctWords.includes(userNewWord)) {
      msg.innerHTML = "Word already placed!";
      userNewWord = "";
    } else if (userNewWord.length > ROWS - 2) {
      msg.innerHTML = "Word is too long!";
      userNewWord = "";
    } else {
      addInput.value = "";
      boardReset();
    }
  }
});

const constructCorrectWords = () => {
  // adds random words to the "correctWords" array
  let newWord = "";
  let newWordList = [];

  for (let i = 3; i < 6; i++) {
    newWordList = WORDS[`${i}`];
    for (let j = 0; j < parseInt(numWords / 3); j++) {
      newWord = newWordList[Math.floor(Math.random() * newWordList.length)];
      if (correctWords.includes(newWord)) {
        j--;
      } else {
        correctWords.push(newWord);
        let newHint = document.createElement("li");
        newHint.classList.add("hint-item");
        newHint.innerHTML = newWord;
        hintsList.appendChild(newHint);
      }
    }
  }
  boardReset();
};

constructCorrectWords();
