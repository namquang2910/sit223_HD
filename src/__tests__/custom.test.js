// custom.test.js
const { getCurrentYear, displayYear , playAnim} = require('../js/custom'); // Adjust the path as needed

describe('getCurrentYear function', () => {
    it('should return the current year', () => {
        const currentYear = new Date().getFullYear();
        expect(getCurrentYear()).toBe(currentYear);
    });
});

describe('displayYear function', () => {
    beforeEach(() => {
        // Set up a mock DOM
        document.body.innerHTML = '<div id="displayYear"></div>';
    });

    it('should display the current year in the #displayYear element', () => {
        const currentYear = new Date().getFullYear();
        displayYear();
        const displayYearElement = document.querySelector('#displayYear');
        expect(displayYearElement.textContent).toBe(currentYear.toString());
    });
});
describe('playAnim function', () => {
    beforeEach(() => {
        document.body.innerHTML = '<div class="typeText"></div>';
    });

    it('playAnim function exists', () => {
        expect(playAnim != undefined).toBe(true)
    });
});