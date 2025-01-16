let timerInterval;

function timer(stop) {
  const timeElem = document.querySelector("#time");

  let sec = 0;
  let min = 0;
  clearInterval(timerInterval);
  timeElem.innerHTML = `00 : 00`;
  if (stop === "stop") {
    return;
  }

  timerInterval = setInterval(() => {
    sec++;
    if (sec === 60) {
      sec = 0;
      min++;
    }
    timeElem.innerHTML = `${min > 9 ? min : "0" + min} : ${
      sec > 9 ? sec : "0" + sec
    }`;
  }, 1000);
}

const startGameBtn = document.querySelector("#start");

startGameBtn.addEventListener("click", () => {
  renderGame();
  renderGameFunctions();
  timer();
});
const stopGameBtn = document.querySelector("#stop");
stopGameBtn.addEventListener("click", () => {
  stopGame("show no results");
  timer("stop");
  changeMoves();
});

function stopGame(isNoResults) {
  const gameContainer = document.querySelector(".game-container");
  const controlsContainer = document.querySelector(".controls-container");
  const resultContainer = document.querySelector("#result");
  const movesCount = document.querySelector("#moves-count").innerHTML;
  const timeTaken = document.querySelector("#time").innerHTML;
  gameContainer.classList.add("hide");
  controlsContainer.classList.remove("hide");

  if (isNoResults === "show no results") {
    resultContainer.innerHTML = "";
    return;
  }

  resultContainer.innerHTML = `
    <div class="after_game_texts_div d-flex flex-column align-items-center">
      <h2 class="win_txt">You Win</h2>
      <h4 class="moves_afterGame_text">Moves: ${movesCount}</h4>
      <h4 class="time_afterGame_text">Time: ${timeTaken}</h4>
    </div>
  `;

  startGameBtn.classList.add("win_Elems_after_win");
  resultContainer
    .querySelector(".after_game_texts_div")
    .classList.add("gameWinAnim");
}

function renderGame() {
  const gameContainer = document.querySelector(".game-container");
  const controlsContainer = document.querySelector(".controls-container");
  gameContainer.classList.remove("hide");
  controlsContainer.classList.add("hide");
  const characters = [
    "dog",
    "cat",
    "staff-snake",
    "egg",
    "pepper-hot",
    "feather",
    "wave-square",
    "key",
  ];
  const shuffledCharacters = shuffleArray([...characters, ...characters]);

  let cardsHtml = "";
  shuffledCharacters.forEach((character, i) => {
    cardsHtml += ` 

                <div class="card-container">
          <div data-character="${character}" class=" card " id="${i}">
            <div class="front">
            <i class="bi bi-question"></i>
            </div>
            <div class="back">
            <i class="fa-solid fa-${character}"></i>
            </div>
          </div>
        </div>
        `;
  });
  gameContainer.innerHTML = cardsHtml;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
let canRotate = true;

function renderGameFunctions() {
  document.querySelectorAll(".card").forEach((presentCard) => {
    presentCard.addEventListener("click", () => {
      if (!presentCard.classList.contains("card_rotate")) {
        handleCardClick(presentCard);
      }
    });
  });

  function handleCardClick(presentCard) {
    const presentCharacter = presentCard.dataset.character;
    const presentCardId = presentCard.id;

    if (canRotate) {
      presentCard.classList.add("card_rotate");

      checkCardMatch(presentCard, presentCharacter, presentCardId);

      if (isGameWon()) {
        endGame();
      }
      changeMoves();
    }
    handleMismatch();
  }

  function checkCardMatch(presentCard, presentCharacter, presentCardId) {
    document.querySelectorAll(".card_rotate").forEach((rotated_card) => {
      const previousCharacter = rotated_card.dataset.character;
      const previousCardId = rotated_card.id;
      if (
        previousCharacter === presentCharacter &&
        presentCardId != previousCardId
      ) {
        rotated_card.classList.remove("card");
        presentCard.classList.remove("card");
      }
    });
  }

  function isGameWon() {
    return document.querySelectorAll(".card").length === 0;
  }
  function endGame() {
    stopGame();
    timer("restart");
    document
      .querySelector(".after_game_texts_div")
      .classList.remove("disabled");
  }
}

let noOfCardsRotated = 0;

const CARDS_ROTATE_DELAY = 600;
const CAN_ROTATE_NEXT_DELAY = 1000;

function resetRotatedCards() {
  document.querySelectorAll(".card.card_rotate").forEach((card) => {
    card.classList.remove("card_rotate");
  });
}
function handleMismatch() {
  if (!canRotate) {
    return;
  }

  noOfCardsRotated++;

  if (noOfCardsRotated >= 2) {
    canRotate = false;
    setTimeout(() => {
      resetRotatedCards();
    }, CARDS_ROTATE_DELAY);

    setTimeout(() => {
      canRotate = true;
      noOfCardsRotated = 0;
    }, CAN_ROTATE_NEXT_DELAY);
  }
}

let moves = 0;
changeMoves();
function changeMoves() {
  if (
    document.querySelector(".game-container").classList.contains("hide") ||
    document.querySelectorAll(".card_rotate").length === 0
  ) {
    moves = 0;
  } else {
    moves++;
  }

  document.querySelector("#moves-count").innerHTML = `Moves: ${moves}`;
}
