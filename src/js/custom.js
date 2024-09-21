function getCurrentYear() {
    return new Date().getFullYear();
}

// Function to display the current year in the #displayYear element
function displayYear() {
    const displayYearElement = document.querySelector("#displayYear");
    if (displayYearElement) {
        displayYearElement.textContent = getCurrentYear();  // Set current year
    }
}

// typingAnimation.js

var typeText = document.querySelector(".typeText")
var textToBeTyped = "Artificial Intelligence (AI) is the field of computer science focused on creating systems that can perform tasks typically requiring human intelligence, such as learning, problem-solving, and decision-making."
var index = 0, isAdding = true

function playAnim() {
  setTimeout(function () {
    // set the text of typeText to a substring of
    // the textToBeTyped using index.
    typeText.innerText = textToBeTyped.slice(0, index)
    if (isAdding) {
      // adding text
      if (index > textToBeTyped.length) {
        // no more text to add
        isAdding = false
        setTimeout( function () {
          playAnim()
        }, 120)
        return
      } else {
        // increment index by 1
        index++
      }
    } else {
      // removing text
      if (index === 0) {
        // no more text to remove
        isAdding = true
      } else {
        // decrement index by 1
        index--
      }
    }
    // call itself
    playAnim()
  }, 120)
}
displayYear()  // display current year
// start animation
playAnim()

// Export functions for Jest to test
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { getCurrentYear, displayYear , playAnim};
}
