var express = require("express");
var router = express.Router();

var citizenController = require("../controllers/controllerCitizen");

router.post("/signup", citizenController.doSignup);
router.post("/find", citizenController.doFind);
router.post("/update", citizenController.doUpdate);
router.post("/ai-read-pic", citizenController.doExtractAadhaar);

module.exports = router;