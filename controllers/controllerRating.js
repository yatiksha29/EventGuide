
const Rating = require("../models/ModelRating");

// Add or update rating
async function saveRating(req, res) {
  try {
    const {
      vendorEmail, stars, comment} = req.body;
      let citizenEmail = req.emailid;

    if (!vendorEmail || !citizenEmail || stars === undefined) {
      return res.status(400).json({
        message: "Vendor email, citizen email and stars are required"
      });
    }

    const ratingValue = Number(stars);

    if (
      !Number.isInteger(ratingValue) ||
      ratingValue < 1 ||
      ratingValue > 5
    ) {
      return res.status(400).json({
        message: "Stars must be between 1 and 5"
      });
    }

    const rating = await Rating.findOneAndUpdate(
      {
        vendorEmail: vendorEmail.trim().toLowerCase(),
        citizenEmail: citizenEmail.trim().toLowerCase()
      },
      {
        $set: {
          stars: ratingValue,
          comment: comment || "",
          createdAt: new Date()
        }
      },
      {
        returnDocument: "after",
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true
      }
    );

    return res.status(200).json({
      message: "Rating saved successfully",
      rating
    });
  } catch (error) {
    console.error("Save rating error:", error);

    return res.status(500).json({
      message: "Unable to save rating"
    });
  }
}

// Get vendor's average rating and review count
async function getVendorRating(req, res) {
  try {
    const vendorEmail = req.params.vendorEmail
      .trim()
      .toLowerCase();

    const result = await Rating.aggregate([
      {
        $match: { vendorEmail }
      },
      {
        $group: {
          _id: "$vendorEmail",
          averageRating: { $avg: "$stars" },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    if (result.length === 0) {
      return res.status(200).json({
        averageRating: 0,
        totalReviews: 0
      });
    }

    return res.status(200).json({
      averageRating: Number(
        result[0].averageRating.toFixed(1)
      ),
      totalReviews: result[0].totalReviews
    });
  } catch (error) {
    console.error("Get vendor rating error:", error);

    return res.status(500).json({
      message: "Unable to fetch vendor rating"
    });
  }
}

module.exports = {
  saveRating,
  getVendorRating
};
