require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

const { ONRENDER_BASE_URL } = require("../src/config.js");

module.exports = {
  config: {
    target: ONRENDER_BASE_URL,
    phases: [
      {
        name: "User journey simulation",
        arrivalRate: 2,
        duration: 90,
        rampTo: 5
      }
    ],
    processor: "./randomizeUrls.js"
  },

  scenarios: require('./commonScenarios.js')
};