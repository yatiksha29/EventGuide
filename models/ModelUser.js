var mongoose = require("mongoose");

let colDesign = {
    emailid: { type: String, required: true, index: true, unique: true },
    password: { type: String, required: true },
    utype: { type: String, required: true },
    status: { type: Number, default: 1 },
};

var ver = {
    versionKey: false, // to avoid __v field in table come by default
};

let ScheemaClass = mongoose.Schema;
let collectionObj = new ScheemaClass(colDesign, ver);

let UserColRef = mongoose.model("users", collectionObj);

module.exports = UserColRef;