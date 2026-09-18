const moment = require("moment");

const checkDate = (date) => {
  if (!date) return null;

  const today = moment();
  const expiry = moment(date);
  const diff = expiry.diff(today, "days");

  if (diff < 0) {
    return { status: "EXPIRED", days: diff };
  } else if (diff <= 3) {
    return { status: "EXPIRING_SOON", days: diff };
  } else if (diff <= 7) {
    return { status: "WARNING", days: diff };
  }

  return null;
};

module.exports = { checkDate };