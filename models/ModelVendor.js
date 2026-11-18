var mongoose=require("mongoose")
                   
let colDesign = {
    emailid: { type: String, required: true, index: true, unique: true },
    name: { type: String, default: "" },
    contact: { type: String, default: "" },
    business: { type: String, default: "" },
    area: { type: String, default: "" },
    address: { type: String, default: "" },
    city: { type: String, default: "" },
    estd: { type: String, default: "" },
    selcate: { type: [String], default: [] },
    website: { type: String, default: "" },
    insta: { type: String, default: "" },
    shoppicurl: { type: String, default: "" },
    certpicurl: { type: String, default: "" },
    dos: { type: Date, default: Date.now },
};

var ver = {
    versionKey: false, // to avoid __v field in table come by default
};

let ScheemaClass = mongoose.Schema; //schema is a class
let collectionObj = new ScheemaClass(colDesign, ver);  //instanation of SchemaClass

let VendorColRef = mongoose.model("vendors", collectionObj);
 module.exports= VendorColRef;