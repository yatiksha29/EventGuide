var express = require("express");
var routerVendor = express.Router();
var { validateToken } = require("../config/jwtvalidation");

var {
  doSignup,
  doFind,
  doUpdate,
  showall,
  doUnregister,
  getCities,
  searchVendors,
} = require("../controllers/controllerVendor");

routerVendor.post("/signup", doSignup);
routerVendor.post("/find", doFind);
routerVendor.post("/update", doUpdate);
routerVendor.post("/unregister", doUnregister);
routerVendor.get("/showall", showall);

// EventGuide APIs
routerVendor.get("/cities", getCities);
routerVendor.post("/search", validateToken, searchVendors);

module.exports = routerVendor;
