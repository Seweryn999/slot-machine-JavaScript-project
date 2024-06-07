const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
  A: 2,
  B: 4,
  C: 6,
  D: 8,
};

const SYMBOL_VALUES = {
  A: 5,
  B: 4,
  C: 3,
  D: 2,
};

let balance = 0;

const deposit = () => {
  const depositInput = document.getElementById("deposit");
  const depositAmount = parseFloat(depositInput.value);

  if (isNaN(depositAmount) || depositAmount <= 0) {
    alert("Invalid deposit amount, try again.");
  } else {
    balance += depositAmount;
    updateBalance();
    depositInput.value = "";
  }
};

const updateBalance = () => {
  document.getElementById("balance").innerText = balance.toString();
};

const spin = () => {
  const symbols = [];
  for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
    for (let i = 0; i < count; i++) {
      symbols.push(symbol);
    }
  }

  const reels = [];
  for (let i = 0; i < COLS; i++) {
    reels.push([]);
    const reelSymbols = [...symbols];
    for (let j = 0; j < ROWS; j++) {
      const randomIndex = Math.floor(Math.random() * reelSymbols.length);
      const selectedSymbol = reelSymbols[randomIndex];
      reels[i].push(selectedSymbol);
      reelSymbols.splice(randomIndex, 1);
    }
  }

  return reels;
};

const transpose = (reels) => {
  const rows = [];

  for (let i = 0; i < ROWS; i++) {
    rows.push([]);
    for (let j = 0; j < COLS; j++) {
      rows[i].push(reels[j][i]);
    }
  }

  return rows;
};

const printRows = (rows) => {
  const reelsDiv = document.getElementById("reels");
  reelsDiv.innerHTML = "";

  for (const row of rows) {
    const rowDiv = document.createElement("div");
    for (const symbol of row) {
      const span = document.createElement("span");
      span.innerText = symbol;
      rowDiv.appendChild(span);
    }
    reelsDiv.appendChild(rowDiv);
  }
};

const getWinnings = (rows, bet, lines) => {
  let winnings = 0;

  for (let row = 0; row < lines; row++) {
    const symbols = rows[row];
    let allSame = true;

    for (const symbol of symbols) {
      if (symbol != symbols[0]) {
        allSame = false;
        break;
      }
    }

    if (allSame) {
      winnings += bet * SYMBOL_VALUES[symbols[0]];
    }
  }

  return winnings;
};

const play = () => {
  const linesInput = document.getElementById("lines");
  const betInput = document.getElementById("bet");

  const lines = parseInt(linesInput.value);
  const bet = parseFloat(betInput.value);

  if (isNaN(lines) || lines <= 0 || lines > 3) {
    alert("Invalid number of lines, try again.");
    return;
  }

  if (isNaN(bet) || bet <= 0 || bet > balance / lines) {
    alert("Invalid bet, try again.");
    return;
  }

  balance -= bet * lines;
  updateBalance();

  const reels = spin();
  const rows = transpose(reels);
  printRows(rows);

  const winnings = getWinnings(rows, bet, lines);
  balance += winnings;
  updateBalance();

  const resultDiv = document.getElementById("result");
  resultDiv.innerText = `You won $${winnings.toString()}`;

  if (balance <= 0) {
    alert("You ran out of money!");
  }
};
