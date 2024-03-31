"use strict";

const display = document.querySelectorAll(".display p");
const btnBackspace = document.querySelector("#btn_backspace");
const btnEqual = document.querySelector("#btn_equal");
const btnClear = document.querySelector("#btn_clear");
const btnSignal = document.querySelector("#btn_signal");
const btnOperators = document.querySelectorAll(".operator");
const btnOperands = document.querySelectorAll(".operand");
const btnDecimal = document.querySelector("#btn_decimal");
const btnZero = document.querySelector("#btn_0");

let operationStack = [];
let operand = "";

const operations = {
  "^": (a, b) => a ** b,
  "*": (a, b) => a * b,
  "/": (a, b) => a / b,
  "+": (a, b) => a + b,
  "-": (a, b) => a - b,
};

const keysTarget = {
  Backspace: btnBackspace,
  Enter: btnEqual,
  Delete: btnClear,
  "=": btnEqual,
  0: btnZero,
  1: btnOperands[6],
  2: btnOperands[7],
  3: btnOperands[8],
  4: btnOperands[3],
  5: btnOperands[4],
  6: btnOperands[5],
  7: btnOperands[0],
  8: btnOperands[1],
  9: btnOperands[2],
  ".": btnDecimal,
  "*": btnOperators[4],
  "+": btnOperators[2],
  "-": btnOperators[1],
  "/": btnOperators[3],
};

function clearHandler() {
  operationStack = [];
  display[0].textContent = "";
  display[1].textContent = "0";
}

function updateCurrDisplay(value) {
  if (display[1].textContent === "0") {
    if (value === "0") return;
    display[1].textContent = "";
  }
  display[1].textContent += value;
}

function updateLastDisplay(lastOp, result) {
  display[0].textContent = lastOp;
  display[1].textContent = `${result}`;
}

function operate(a, op, b) {
  a = parseFloat(a);
  b = parseFloat(b);
  if (isNaN(a) || isNaN(b)) {
    throw new Error("Not a number");
  } else if (op in operations) {
    return operations[op](a, b);
  } else {
    throw new Error("Operation not supported");
  }
}

function equalHandler() {
  if (operationStack.length === 2) {
    if (operand === "0") {
      clearHandler();
      alert("Why? 😭");
      return;
    }
    if(operand !== "") operationStack.push(operand);
    let result;
    const b =
      operationStack.length === 3 ? operationStack.pop() : operationStack[0];
    const op = operationStack.pop();
    const a = operationStack.pop();
    try {
      result = parseFloat(operate(a, op, b).toPrecision(5));
    } catch (error) {
      clearHandler();
      alert(error);
      return -1;
    }
    if(operand !== "") updateLastDisplay(display[1].textContent + "=", result);
    else updateLastDisplay(display[1].textContent + b + "=", result);
    operand = `${result}`;
    
    return 1;
  }
  return 0;
}

function checkValidInput() {
  if (
    display[1].textContent === "0" ||
    display[1].textContent.slice(-1) in operations
  )
    return 0;
  return 1;
}

function signalHandler() {
  if (!checkValidInput()) return;

  const str = display[1].textContent;
  const idx = str.indexOf(operationStack[1]);
  let inverted = str.slice(idx + 1);
  if (inverted === "0") return;
  inverted = parseFloat(inverted) * -1;
  operand = `${inverted}`;
  if (idx !== -1 && Math.sign(inverted) === -1) inverted = `(${inverted})`;
  display[1].textContent = str.slice(0, idx + 1) + inverted;
}

function operatorHandler() {
  //if (!checkValidInput()) return;
  const value = this.value;
  switch (operationStack.length) {
    case 0:
      operationStack.push(operand);
      operand = "";
    case 1:
      operationStack.push(value);
      updateCurrDisplay(value);
      break;
    case 2:
      if (equalHandler() === 1) {
        operationStack.push(operand);
        operand = "";
        operationStack.push(value);
        updateCurrDisplay(value);
      }
      break;
    default:
      break;
  }
}


function operandsHandler() {
  const value = this.value;
  if(operand.length >= 15) return;
  if (operand.startsWith("0")) {
    backspaceHandler();
    operand = value;
  } else {
    operand += value;
  }
  updateCurrDisplay(value);
}

function backspaceHandler() {
  const str = display[1].textContent;
  if (str.slice(-1) in operations) {
    operand = operationStack[0];
    operationStack = [];
    display[1].textContent = str.slice(0, -1);
  }
  if (str.length === 1) {
    display[1].textContent = "0";
    operand = "";
  } else {
    display[1].textContent = str.slice(0, -1);
    operand = operand.slice(0, -1);
  }
}

function decimalHandler() {
  const lastChar = display[1].textContent.slice(-1);
  let value = this.value;
  if (operand.includes(value)) {
    return;
  }
  if (lastChar in operations) {
    value = `0${value}`;
  }

  updateCurrDisplay(value);
  operand += value;
}

function zeroHandler() {
  const value = this.value;
  if (!operand.includes(".") && operand.startsWith(value)) return;

  updateCurrDisplay(value);
  operand += value;
}

function keydownHandler(event) {
  const key = event.key;
  if (key in keysTarget) {
    keysTarget[key].click();
  }
}

btnOperators.forEach((button) => {
  button.addEventListener("click", operatorHandler);
});

btnOperands.forEach((button) => {
  button.addEventListener("click", operandsHandler);
});

btnZero.addEventListener("click", zeroHandler);

btnDecimal.addEventListener("click", decimalHandler);

btnBackspace.addEventListener("click", backspaceHandler);

btnSignal.addEventListener("click", signalHandler);

btnClear.addEventListener("click", clearHandler);

btnEqual.addEventListener("click", equalHandler);

document.addEventListener("keydown", keydownHandler);
