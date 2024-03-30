"use strict";

const display = document.querySelectorAll(".display p");
const btnBackspace = document.querySelector("#btn_backspace");
const btnEqual = document.querySelector("#btn_equal");
const btnClear = document.querySelector("#btn_clear");
const btnSignal = document.querySelector("#btn_signal");
const btnOperators = document.querySelectorAll(".operator");
const btnOperands = document.querySelectorAll(".operand");

let stack = [];

const operations = {
  "^": (a, b) => a ** b,
  "*": (a, b) => a * b,
  "/": (a, b) => a / b,
  "+": (a, b) => a + b,
  "-": (a, b) => a - b,
};

function clear() {
  stack = [];
  display[0].textContent = "";
  display[1].textContent = "0";
}

function updateCurrDisplay(value) {
  if (display[1].textContent === "0") {
    if (value === "0") return;
    display[1].textContent = "";
  }
  if (value in operations) {
    display[1].textContent += ` ${value} `;
  } else {
    display[1].textContent += value;
  }
}

function updateLastDisplay(str, result) {
  display[0].textContent = str;
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
  if (stack.length === 3) {
    const a = stack[0];
    const op = stack[1];
    const b = stack[2];
    return parseFloat(operate(a, op, b).toFixed(3));
  } else if (stack.length === 2) {
    const a = stack[0];
    const op = stack[1];
    return parseFloat(operate(a, op, a).toFixed(3));
  }
}

btnOperators.forEach((button) => {
  button.addEventListener("click", () => {
    switch (stack.length) {
      case 0:
        const operand = display[1].textContent.trim().split(" ").join("");
        stack.push(operand);
      case 1:
        stack.push(button.value);
        updateCurrDisplay(button.value);
        break;
      case 2:
        updateLastDisplay(stack.join(" "), equalHandler());
        break;
      default:
        break;
    }
  });
});

btnOperands.forEach((button) => {
  button.addEventListener("click", () => {
    updateCurrDisplay(button.value);
  });
});

btnBackspace.addEventListener("click", () => {
  const str = display[1].textContent;
  if (str.length === 1) display[1].textContent = "0";
  else display[1].textContent = str.slice(0, -1);
});

btnSignal.addEventListener("click", () => {
  const arr = display[1].textContent.trim().split(" ");
  const number = parseFloat(arr.slice(-1));
  if (!isNaN(number) && number !== 0) {
    const inverted = number * -1;
    display[1].textContent = (
      arr.slice(0, -1).join(" ") + ` ${inverted}`
    ).trimStart();
  }
});

btnClear.addEventListener("click", clear);

btnEqual.addEventListener("click", () => {
  if (stack.length === 2) {
    let operand = display[1].textContent;
    operand = operand.slice(operand.indexOf(stack[1]) + 1).trim();
    if (operand === "0") {
      clear();
      alert("Why? 😭");
      return;
    }
    stack.push(operand);
    const result = `${equalHandler()}`;
    updateLastDisplay(stack.join(" ") + " =", result);
    stack = [result];
  }
});
