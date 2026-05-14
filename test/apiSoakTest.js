require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

const { ONRENDER_BASE_URL } = require("../src/config.js");

// ==========================
// ARTILLERY CONFIG
// ==========================

module.exports = {
  config: {
    target: ONRENDER_BASE_URL,
    phases: [
      // Ramp up to 5 users for 2 minutes slowly introduce users to your application
      {
        name: "Ramp up phase",
        duration: 120, // 2 minutes (120 seconds)
        arrivalRate: 1, // Start with 1 user per second
        rampTo: 5 // Gradually increase to 5 users per second
      },
      // The Soak: sit securely at 5 users generating requests every second
      {
        name: "Soak phase",
        duration: 600, // 10 minutes (600 seconds)
        arrivalRate: 5 // Sustain the maximum load steadily
      }
    ],
    processor: "./randomizeUrls.js"
  },

  scenarios: require('./commonScenarios.js')
};

// TIPS for Soak Testing:
// - A soak test is meant to run for a long time (e.g. 1 to several hours) to find memory leaks or resource exhaustion.
// - Keep the arrival rate lower than a stress test (spike/load test) to avoid crashing the server immediately.
// - Monitor your server's memory and CPU usage while this test runs.
