var mongoose = require("mongoose");

let colDesign = {
    citizenEmail: { type: String, required: true },
    vendorEmail: { type: String, required: true },
  };

var ver = {
    versionKey: false,
  };

let ScheemaClass = mongoose.Schema; //schema is a class
let collectionObj = new ScheemaClass(colDesign, ver);  //instanation of SchemaClass


collectionObj.index(
  { citizenEmail: 1, vendorEmail: 1 },  // helps to avoid duplicates
  { unique: true }  // combination to be unique
);

let FavsColRef = mongoose.model("Favs", collectionObj);
 module.exports= FavsColRef;