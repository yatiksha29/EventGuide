
var EventColRef = require("../models/ModelEvent");

/* ------------------ Show Events ------------------ */
function showEvents(req, resp) {
  EventColRef.find()
    .sort({ eventName: 1 })
    .then((result) => {
      resp.json({
        status: true,
        data: result,
      });
    })
    .catch((err) => {
      resp.status(500).json({
        status: false,
        msg: err.message,
      });
    });
}

module.exports = {
  showEvents,
};
