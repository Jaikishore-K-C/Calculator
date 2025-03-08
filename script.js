document.addEventListener("DOMContentLoaded", () => {
  const display = document.getElementById("display");
  const buttons = document.querySelectorAll(".btn");

  let currentInput = "";

  // Update the calculator display.
  function updateDisplay(value) {
    display.innerText = value;
  }

  // Clear the calculator.
  function clearDisplay() {
    currentInput = "";
    updateDisplay("0");
  }

  // Evaluate the current expression.
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

  // Apply percentage: divide the last operand by 100.
  function applyPercentage(expr) {
    let lastOpIndex = -1;
    for (let i = 1; i < expr.length; i++) {
      if ("+-*/".includes(expr[i])) {
        lastOpIndex = i;
      }
    }
    let prefix = "";
    let operand = "";
    if (lastOpIndex === -1) {
      operand = expr;
    } else {
      prefix = expr.substring(0, lastOpIndex + 1);
      operand = expr.substring(lastOpIndex + 1);
    }
    if (operand === "" || isNaN(parseFloat(operand))) return expr;
    const num = parseFloat(operand);
    const percent = num / 100;
    return prefix + percent;
  }

  // Toggle the sign of the last operand:
  // When toggling to negative, add the prefix "(-" before the operand (without appending a closing parenthesis).
  // When toggling back, remove the "(-" prefix.
  function toggleLastOperand(expr) {
    if (!expr || /[+\-*/(.]$/.test(expr)) return expr;
    
    // Find the index of the last operator (ignoring a leading minus).
    let lastOpIndex = -1;
    for (let i = 1; i < expr.length; i++) {
      if ("+-*/".includes(expr[i])) {
        lastOpIndex = i;
      }
    }
    let prefix = lastOpIndex === -1 ? "" : expr.substring(0, lastOpIndex + 1);
    let operand = lastOpIndex === -1 ? expr : expr.substring(lastOpIndex + 1);
    
    // If the operand already starts with "(-", remove it; otherwise, add "(-" at the beginning.
    if (operand.startsWith("(-")) {
      operand = operand.substring(2);
    } else {
      operand = "(-" + operand;
    }
    return prefix + operand;
  }

  // Helper function to check if the last operand already contains a decimal point.
  function canAppendDecimal(expr) {
    // Split the expression by operators.
    const tokens = expr.split(/[+\-*/]/);
    const lastOperand = tokens[tokens.length - 1];
    return !lastOperand.includes(".");
  }

  // Helper to check if a value is an operator.
  function isOperator(val) {
    return ["+", "-", "*", "/"].includes(val);
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const value = button.getAttribute("data-value");

      if (value === "C") {
        clearDisplay();
      } else if (value === "paren") {
        // Parenthesis logic remains unchanged.
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
      } else if (value === "%") {
        currentInput = applyPercentage(currentInput);
        updateDisplay(currentInput);
      } else if (value === "negate") {
        currentInput = toggleLastOperand(currentInput);
        updateDisplay(currentInput || "0");
      } else if (value === "=") {
        calculateResult();
      }
      // Operator input.
      else if (isOperator(value)) {
        // Do not allow an operator if the expression is empty.
        if (currentInput === "") return;
        const lastChar = currentInput[currentInput.length - 1];
        // If the last character is already an operator or a "%", replace it.
        if (isOperator(lastChar) || lastChar === "%") {
          currentInput = currentInput.slice(0, -1) + value;
          updateDisplay(currentInput);
          return;
        }
        currentInput += value;
        updateDisplay(currentInput);
      }
      // For numbers and the decimal point.
      else {
        // If a decimal is pressed, ensure the current operand does not already contain one.
        if (value === ".") {
          if (!canAppendDecimal(currentInput)) return;
        }
        // If display is "Error" or "0", reset currentInput.
        if (display.innerText === "Error" || display.innerText === "0") {
          currentInput = "";
        }
        // If a number or dot is entered immediately after a "%", insert multiplication.
        if ((/\d/.test(value) || value === ".") && currentInput.endsWith("%")) {
          currentInput += "*";
        }
        currentInput += value;
        updateDisplay(currentInput);
      }
    });
  });

  document.addEventListener("keydown", (event) => {
    const key = event.key;
    // Numbers and decimal.
    if (/\d/.test(key) || key === ".") {
      if (display.innerText === "Error" || display.innerText === "0") {
        currentInput = "";
      }
      // For decimal, check the last operand.
      if (key === ".") {
        if (!canAppendDecimal(currentInput)) return;
      }
      if (currentInput.endsWith("%")) {
        currentInput += "*";
      }
      currentInput += key;
      updateDisplay(currentInput);
    }
    // Operators.
    else if (isOperator(key)) {
      if (currentInput === "") return;
      const lastChar = currentInput[currentInput.length - 1];
      if (isOperator(lastChar) || lastChar === "%") {
        currentInput = currentInput.slice(0, -1) + key;
        updateDisplay(currentInput);
        return;
      }
      currentInput += key;
      updateDisplay(currentInput);
    }
    else if (key === "%") {
      document.querySelector('[data-value="%"]').click();
    }
    else if (key === "Enter") {
      calculateResult();
    }
    else if (key === "Backspace") {
      currentInput = currentInput.slice(0, -1);
      updateDisplay(currentInput || "0");
    }
    else if (key.toLowerCase() === "c") {
      clearDisplay();
    }
    else if (key === "n") {
      document.querySelector('[data-value="negate"]').click();
    }
  });
});