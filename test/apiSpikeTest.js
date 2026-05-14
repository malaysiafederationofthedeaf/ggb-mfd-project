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
        name: "Baseline",
        duration: 60, // 1 min normal traffic
        arrivalRate: 2
      },
      {
        name: "Sudden Spike",
        duration: 10, // 10s sudden surge
        arrivalRate: 2,
        rampTo: 100
      },
      {
        name: "Hold Spike",
        duration: 30, // 30s holding extreme traffic
        arrivalRate: 100
      },
      {
        name: "Sudden Drop",
        duration: 10, // 10s dropping back to normal
        arrivalRate: 100,
        rampTo: 2
      },
      {
        name: "Recovery Baseline",
        duration: 60, // 1 min watching system recovery
        arrivalRate: 2
      }
    ],
    processor: "./randomizeUrls.js"
  },

  scenarios: require('./commonScenarios.js')
};

// TIPS for Spike Testing:
// - A spike test evaluates how the system performs under sudden, massive increases in traffic.
// - It is useful to see if the system recovers gracefully after the spike or if it crashes and stays down.
// - Auto-scaling policies are usually tested with this type of load.
