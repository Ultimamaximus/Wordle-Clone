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
      // Make a GET request to the WordsAPI to get a random five-letter word
      const response = await fetch(
        `https://wordsapiv1.p.rapidapi.com/words/?random=true&lettersMin=5&lettersMax=5`,
        {
          method: "GET",
          headers: {
            // Set the headers for the request with your RapidAPI key
            "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
            "x-rapidapi-key": "insert your key here",
          },
        }
      );
      // Convert the response to JSON
      const data = await response.json();
      // Extract the word from the data and assign it to the global variable "word"
      word = data.word;
    } catch (error) {
      console.error(error);
    }
  }

  function getCurrentWordArr() {
    return guessedWords[guessedWords.length - 1];
  }

  function updateGuessedWords(letter) {
    // Get the current guessed word as an array of characters
    const currentWordArr = getCurrentWordArr();

    // Check if the length of the current guessed word is less than 5
    if (currentWordArr?.length < 5) {
      // Add the new letter to the current guessed word array
      currentWordArr.push(letter);
      // Update the HTML element corresponding to the next available space with the new letter
      document.getElementById(String(availableSpace)).textContent = letter;
      // Increment the available space counter
      availableSpace++;
    }
  }

  function getTileColor(letter, index) {
    // Check if the letter is correct for the word
    const isCorrectLetter = word.includes(letter);
    // Get the letter at that position in the word
    const letterInThatPosition = word.charAt(index);
    // Check if the letter is in the correct position in the word
    const isCorrectPosition = letter === letterInThatPosition;
    // Return different colors based on whether the letter is correct and in the right position
    return !isCorrectLetter
      ? "rgb(58, 58, 60)" // If the letter is incorrect, return dark gray
      : isCorrectPosition
      ? "rgb(83, 141, 78)" // If the letter is in the right position, return green
      : "rgb(181, 159, 59)"; // If the letter is correct but in the wrong position, return gold
  }

  function handleSubmitWord() {
    // Get the current word array
    const currentWordArr = getCurrentWordArr();
    // If the current word is not 5 letters, show an alert and return
    if (currentWordArr.length !== 5) {
      window.alert("Word must be 5 letters");
      return;
    }
    // Join the current word array to form the current word
    const currentWord = currentWordArr.join("");
    // Call the Words API to check if the word is valid
    fetch(`https://wordsapiv1.p.rapidapi.com/words/${currentWord}`, {
      method: "GET",
      headers: {
        "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
        "x-rapidapi-key": "insert your key here",
      },
    })
      .then((response) => {
        // If the response status is not 200, show an alert and return
        if (response.status !== 200) {
          window.alert("Word is not recognized!");
          return;
        }
        // Calculate the ID of the first letter in the current guess
        const firstLetterId = guessedWordCount * 5 + 1;
        const interval = 200;
        // For each letter in the current guess, add a flip animation and set its color
        currentWordArr.forEach((letter, index) => {
          setTimeout(() => {
            const tileColor = getTileColor(letter, index);

            const letterId = firstLetterId + index;
            const letterEl = document.getElementById(letterId);
            letterEl.classList.add("animate__flipInX");
            letterEl.style = `background-color:${tileColor};border-color:${tileColor}`;
          }, interval * index);
        });
        // Increment the guessed word count
        guessedWordCount += 1;
        // If the current word is the correct word, show a congratulations alert
        if (currentWord === word) {
          window.alert("Congratulations!");
        }
         // If the player has guessed 6 words, show a sorry alert and reveal the correct word
        if (guessedWords.length === 6) {
          window.alert(`Sorry, you have no more guesses! The word is ${word}.`);
        }
        // Push an empty array to guessedWords to prepare for the next guess
        guessedWords.push([]);
      })
      .catch(() => {
        // If there is an error, show an alert
        window.alert("Word is not recognised!");
      });
  }
  // Create squares function to create 30 squares and add them to the game board
  function createSquares() {
    // Get the game board element
    const gameBoard = document.getElementById("board");
    // Loop through 30 times and create a square element each time
    for (let index = 1; index <= 30; index++) {
      // Create a new div element for the square
      const square = document.createElement("div");
      // Add the "square" and "animate__animated" classes to the square element
      square.classList.add("square", "animate__animated");
       // Set the ID of the square element to be the current index
      square.id = index;
      // Add the square element to the game board element
      gameBoard.appendChild(square);
    }
  }
  // This function handles the deletion of a letter from the current word.
  function handleDeleteLetter() {
    const currentWordArr = getCurrentWordArr();
    // If there are letters in the current word, remove the last letter.
    if (currentWordArr.length > 0) {
      // Update the guessed words array with the updated current word.
      const removedLetter = currentWordArr.pop();
      // Get the last letter element on the board and clear its text content.
      guessedWords[guessedWords.length - 1] = currentWordArr;
      const lastLetterEl = document.getElementById(availableSpace - 1);
      lastLetterEl.textContent = "";
      // Decrement the available space index.
      availableSpace = availableSpace - 1;
    }
  }

  keys.forEach((key) => {
    key.onclick = ({ target }) => {
      const letter = target.getAttribute("data-key");
      // If the Enter key is clicked, call the function to submit the word
      if (letter === "enter") {
        handleSubmitWord();
        return;
      }
      // If the Delete key is clicked, call the function to delete the last letter
      if (letter === "del") {
        handleDeleteLetter();
        return;
      }
      // Otherwise, add the clicked letter to the current word being guessed
      updateGuessedWords(letter);
    };
  });
});
