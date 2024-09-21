// jest.setup.js
import $ from 'jquery';

global.$ = global.jQuery = $;
module.exports = {
    setupFiles: ['<rootDir>/jest.setup.js'],
};
