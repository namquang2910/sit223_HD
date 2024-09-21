
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
// start animation
playAnim()
  // Export the function
module.exports = typingAnimation;
  