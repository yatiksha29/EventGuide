
var express = require("express");
var routerEvent = express.Router();

var {
  showEvents,
} = require("../controllers/controllerEvent");

routerEvent.get("/list", showEvents);

module.exports = routerEvent;
