// Wait for the DOM to fully load
document.addEventListener("DOMContentLoaded", () => {
  const display = document.getElementById("display");
  const buttons = document.querySelectorAll(".btn");

  let currentInput = "";

  // Update the calculator display
  function updateDisplay(value) {
    display.innerText = value;
  }

  // Clear the display and reset input
  function clearDisplay() {
    currentInput = "";
    updateDisplay("0");
  }

  // Evaluate the current expression and update the display
  function calculateResult() {
    try {
      // Check for division by zero (ignoring decimals like 0.5)
      if (/\/0(?!\.)/.test(currentInput)) {
        updateDisplay("Error");
        currentInput = "";
        return;
      }
      // Evaluate the arithmetic expression
      let result = eval(currentInput);
      updateDisplay(result);
      // Set current input to the result for subsequent calculations
      currentInput = result.toString();
    } catch (error) {
      updateDisplay("Error");
      currentInput = "";
    }
  }

  // Process button clicks
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const value = button.getAttribute("data-value");

      if (value === "C") {
        clearDisplay();
      } else if (value === "=") {
        calculateResult();
      } else {
        // Replace default 0 or error message with the new input
        if (display.innerText === "Error" || display.innerText === "0") {
          currentInput = "";
        }
        currentInput += value;
        updateDisplay(currentInput);
      }
    });
  });

  // Support keyboard input for digits, operators, and special keys
  document.addEventListener("keydown", (event) => {
    const key = event.key;

    // If key is a digit, operator, or decimal point, append it
    if (/\d/.test(key) || key === "." || key === "+" || key === "-" || key === "*" || key === "/") {
      if (display.innerText === "Error" || display.innerText === "0") {
        currentInput = "";
      }
      currentInput += key;
      updateDisplay(currentInput);
    } else if (key === "Enter") {
      calculateResult();
    } else if (key === "Backspace") {
      // Remove the last character for backspace
      currentInput = currentInput.slice(0, -1);
      updateDisplay(currentInput || "0");
    } else if (key.toLowerCase() === "c") {
      clearDisplay();
    }
  });
});