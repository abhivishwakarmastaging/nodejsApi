const cron = require("node-cron");
const { checkExpiryAlerts } = require("./expiryChecker");

// 🔁 moring 9 am
cron.schedule("0 9 * * *", () => {
  console.log("⏰ Running Expiry Checker...");
  checkExpiryAlerts();
});