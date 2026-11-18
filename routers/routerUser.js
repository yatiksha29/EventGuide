const express = require("express");
const router = express.Router();

const { validateToken } = require("../config/jwtvalidation");

const {
    doSignup,
    doLogin,
    verifyOldPassword,
    changePassword
} = require("../controllers/controllerUser");

router.post("/signup", doSignup);
router.post("/login", doLogin);
router.post("/verify-old-password", validateToken, verifyOldPassword);
router.post("/change-password", validateToken, changePassword);

module.exports = router;