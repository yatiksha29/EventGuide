const express = require("express");
const router = express.Router();

const { validateToken } = require("../config/jwtvalidation");

const {toggleFav,getFavs} = require("../controllers/controllerFavs");

router.post("/toggle", validateToken, toggleFav);

router.get("/list", validateToken, getFavs); 

module.exports = router;