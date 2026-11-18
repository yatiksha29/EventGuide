const express = require("express");
const router = express.Router();

const { validateToken } = require("../config/jwtvalidation");

const {
  saveRating,
  getVendorRating
} = require("../controllers/controllerRating");

// Save or update a rating
router.post("/save", validateToken, saveRating);

// Get a vendor's average rating
router.get("/:vendorEmail", getVendorRating);

module.exports = router;