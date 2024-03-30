"use strict";
let operations = {
  "+": (a, b) => a + b,
  "-": (a, b) => a - b,
  "*": (a, b) => a * b,
  "/": (a, b) => a / b,
  "**": (a, b) => a ** b,
};

function operate(a, b, operator) {
  a = +a;
  b = +b;
  if (typeof a != "number" || typeof b != "number") {
    throw new Error("Invalid Operation: Not a Number");
  } else if (operator in operations) {
    return operations[operator](a, b);
  } else {
    throw new Error("Operation not supported");
  }
}
