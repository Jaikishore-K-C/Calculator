document.addEventListener("DOMContentLoaded", () => {
  const display = document.getElementById("display");
  const buttons = document.querySelectorAll(".btn");
  let currentInput = "";

  function updateDisplay(value) {
    display.innerText = value;
  }

  function clearDisplay() {
    currentInput = "";
    updateDisplay("0");
  }

  function calculateResult() {
    try {
      if (/\/0(?!\.)/.test(currentInput)) {
        updateDisplay("Error");
        currentInput = "";
        return;
      }
      let result = eval(currentInput);
      updateDisplay(result);
      currentInput = result.toString();
    } catch {
      updateDisplay("Error");
      currentInput = "";
    }
  }

  function toggleLastOperand(expr) {
    if (!expr || /[+\-*/(.]$/.test(expr)) return expr;
    
    let lastOpIndex = -1;
    for (let i = 1; i < expr.length; i++) {
      if ("+-*/".includes(expr[i])) {
        lastOpIndex = i;
      }
    }
    let prefix = lastOpIndex === -1 ? "" : expr.substring(0, lastOpIndex + 1);
    let operand = lastOpIndex === -1 ? expr : expr.substring(lastOpIndex + 1);
    
    if (operand.startsWith("(-")) {
      operand = operand.substring(2);
    } else {
      operand = "(-" + operand;
    }
    return prefix + operand;
  }

  function canAppendDecimal(expr) {
    const tokens = expr.split(/[+\-*/]/);
    const lastOperand = tokens[tokens.length - 1];
    return !lastOperand.includes(".");
  }

  function isOperator(val) {
    return ["+", "-", "*", "/"].includes(val);
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const value = button.getAttribute("data-value");

      if (value === "AC") {
        clearDisplay();
      } else if (value === "paren") {
        if (currentInput.startsWith("-") && !currentInput.startsWith("(-")) {
          currentInput = "(" + currentInput;
          updateDisplay(currentInput);
        } else {
          const openCount = (currentInput.match(/\(/g) || []).length;
          const closeCount = (currentInput.match(/\)/g) || []).length;
          if (openCount > closeCount) {
            const lastOpenIndex = currentInput.lastIndexOf("(");
            const contentAfter = currentInput.substring(lastOpenIndex + 1);
            if (/\d/.test(contentAfter)) {
              currentInput += ")";
            }
          } else {
            if (currentInput && /[0-9)]$/.test(currentInput)) {
              currentInput += "*(";
            } else {
              currentInput += "(";
            }
          }
          updateDisplay(currentInput);
        }
      } else if (value === "C") {
        currentInput = currentInput.slice(0, -1);
        updateDisplay(currentInput || "0");
      } else if (value === "negate") {
        currentInput = toggleLastOperand(currentInput);
        updateDisplay(currentInput || "0");
      } else if (value === "=") {
        calculateResult();
      } else if (isOperator(value)) {
        if (currentInput === "") return;
        const lastChar = currentInput[currentInput.length - 1];
        if (isOperator(lastChar)) {
          currentInput = currentInput.slice(0, -1) + value;
          updateDisplay(currentInput);
          return;
        }
        currentInput += value;
        updateDisplay(currentInput);
      } else {
        if (value === ".") {
          if (!canAppendDecimal(currentInput)) return;
        }
        if (display.innerText === "Error" || display.innerText === "0") {
          currentInput = "";
        }
        currentInput += value;
        updateDisplay(currentInput);
      }
    });
  });

  document.addEventListener("keydown", (event) => {
    const key = event.key;
    if (/\d/.test(key) || key === ".") {
      if (display.innerText === "Error" || display.innerText === "0") {
        currentInput = "";
      }
      if (key === ".") {
        if (!canAppendDecimal(currentInput)) return;
      }
      currentInput += key;
      updateDisplay(currentInput);
    } else if (isOperator(key)) {
      if (currentInput === "") return;
      const lastChar = currentInput[currentInput.length - 1];
      if (isOperator(lastChar)) {
        currentInput = currentInput.slice(0, -1) + key;
        updateDisplay(currentInput);
        return;
      }
      currentInput += key;
      updateDisplay(currentInput);
    } else if (key.toLowerCase() === "c") {
      currentInput = currentInput.slice(0, -1);
      updateDisplay(currentInput || "0");
    } else if (key === "Enter") {
      calculateResult();
    } else if (key === "Backspace") {
      currentInput = currentInput.slice(0, -1);
      updateDisplay(currentInput || "0");
    } else if (key.toLowerCase() === "a") {
      clearDisplay();
    } else if (key === "n") {
      document.querySelector('[data-value="negate"]').click();
    }
  });
});
