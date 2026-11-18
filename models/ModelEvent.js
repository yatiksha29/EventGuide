
var mongoose = require("mongoose");

let colDesign = {
    eventName: String,
    services: [String]
};

let ver = {
  versionKey: false,
};

let ScheemaClass = mongoose.Schema;
let collectionObj = new ScheemaClass(colDesign, ver);

let EventColRef = mongoose.model("events", collectionObj);

module.exports = EventColRef;
