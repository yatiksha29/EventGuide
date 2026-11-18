var mongoose = require("mongoose");

let colDesign = {
  emailid: { type: String, required: true, index: true, unique: true },
  acardno: { type: String, default: "" },
  name: { type: String, default: "" },
  dob: { type: String, default: "" },
  gender: { type: String, default: "" },
  address: { type: String, default: "" },
  city: { type: String, default: "" },
  contact: { type: String, default: "" },
  dos: { type: Date, default: Date.now },
};

var ver = { versionKey: false };

let SchemaClass = mongoose.Schema;
let collectionObj = new SchemaClass(colDesign, ver);
let CitizenColRef =  mongoose.models.citizens || 
                     mongoose.model("citizens", collectionObj);

module.exports = CitizenColRef;