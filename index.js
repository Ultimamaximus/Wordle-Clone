document.addEventListener("DOMContentLoaded", () => {
  createSquares();
  getNewWord();

  let guessedWords = [[]];
  let availableSpace = 1;
  let word,
    guessedWordCount = 0;
  const keys = document.querySelectorAll(".keyboard-row button");

  async function getNewWord() {
    try {
      const response = await fetch("/.netlify/functions/getRandomWord");
      const data = await response.json();
      word = data.word;
    } catch (error) {
      console.error(error);
    }
  }

  function getCurrentWordArr() {
    return guessedWords[guessedWords.length - 1];
  }

  function updateGuessedWords(letter) {
    const currentWordArr = getCurrentWordArr();
    if (currentWordArr?.length < 5) {
      currentWordArr.push(letter);
      document.getElementById(String(availableSpace)).textContent = letter;
      availableSpace++;
    }
  }

  function getTileColor(letter, index) {
    const isCorrectLetter = word.includes(letter);
    const letterInThatPosition = word.charAt(index);
    const isCorrectPosition = letter === letterInThatPosition;
    return !isCorrectLetter
      ? "rgb(58, 58, 60)"
      : isCorrectPosition
      ? "rgb(83, 141, 78)"
      : "rgb(181, 159, 59)";
  }

  function handleSubmitWord() {
    const currentWordArr = getCurrentWordArr();
    if (currentWordArr.length !== 5) {
      window.alert("Word must be 5 letters");
      return;
    }

    const currentWord = currentWordArr.join("");
    fetch(`/.netlify/functions/validateWord?word=${currentWord}`)
      .then((response) => {
        if (response.status !== 200) {
          window.alert("Word is not recognized!");
          return;
        }
        const firstLetterId = guessedWordCount * 5 + 1;
        const interval = 200;
        currentWordArr.forEach((letter, index) => {
          setTimeout(() => {
            const tileColor = getTileColor(letter, index);

            const letterId = firstLetterId + index;
            const letterEl = document.getElementById(letterId);
            letterEl.classList.add("animate__flipInX");
            letterEl.style = `background-color:${tileColor};border-color:${tileColor}`;
          }, interval * index);
        });
        guessedWordCount += 1;
        if (currentWord === word) {
          window.alert("Congratulations!");
        }
        if (guessedWords.length === 6) {
          window.alert(`Sorry, you have no more guesses! The word is ${word}.`);
        }
        guessedWords.push([]);
      })
      .catch(() => {
        window.alert("Word is not recognised!");
      });
  }

  function createSquares() {
    const gameBoard = document.getElementById("board");
    for (let index = 1; index <= 30; index++) {
      const square = document.createElement("div");
      square.classList.add("square", "animate__animated");
      square.id = index;
      gameBoard.appendChild(square);
    }
  }

  function handleDeleteLetter() {
    const currentWordArr = getCurrentWordArr();
    if (currentWordArr.length > 0) {
      const removedLetter = currentWordArr.pop();
      guessedWords[guessedWords.length - 1] = currentWordArr;
      const lastLetterEl = document.getElementById(availableSpace - 1);
      lastLetterEl.textContent = "";
      availableSpace = availableSpace - 1;
    }
  }

  keys.forEach((key) => {
    key.onclick = ({ target }) => {
      const letter = target.getAttribute("data-key");
      if (letter === "enter") {
        handleSubmitWord();
        return;
      }
      if (letter === "del") {
        handleDeleteLetter();
        return;
      }
      updateGuessedWords(letter);
    };
  });
});
