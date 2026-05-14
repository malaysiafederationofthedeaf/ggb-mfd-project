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
      {
        name: "Warm up",
        duration: 60, // 1 min warm up
        arrivalRate: 2,
        rampTo: 5
      },
      {
        name: "Moderate Load Ramp",
        duration: 60, // 1 min ramp
        arrivalRate: 5,
        rampTo: 15
      },
      {
        name: "Hold Moderate Load",
        duration: 120, // 2 mins hold
        arrivalRate: 15
      },
      {
        name: "High Load Ramp",
        duration: 60, // 1 min ramp
        arrivalRate: 15,
        rampTo: 30
      },
      {
        name: "Hold High Load (Stress)",
        duration: 120, // 2 mins hold
        arrivalRate: 30
      },
      {
        name: "Extreme Load Ramp",
        duration: 60, // 1 min ramp
        arrivalRate: 30,
        rampTo: 50
      },
      {
        name: "Hold Extreme Load",
        duration: 30, // 30 sec hold
        arrivalRate: 50
      },
      {
        name: "Scale Down / Cooldown",
        duration: 60, // 1 min cool down
        arrivalRate: 50,
        rampTo: 0
      }
    ],
    processor: "./randomizeUrls.js"
  },

  scenarios: require('./commonScenarios.js')
};

// TIPS for Stress Testing:
// - A stress test is meant to gradually increase the load to extreme levels to see how the system behaves under pressure.
// - It helps identify the maximum capacity of the system and the breaking point.
// - Pay close attention to response times, error rates, and resource utilization (CPU, memory, DB connections).
