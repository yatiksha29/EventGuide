const favsModel = require("../models/ModelFavs");
const vendorModel = require("../models/ModelVendor");

// Like and Unlike Vendor
async function toggleFav(req, res) {
  try {
    let citizenEmail = req.emailid;
    let { vendorEmail } = req.body;

    if (!citizenEmail || !vendorEmail) {
      return res.json({
        status: false,
        msg: "Citizen email and vendor email are required.",
      });
    }

    const existingFav = await favsModel.findOne({
      citizenEmail,
      vendorEmail,
    });

    if (existingFav) {
      await favsModel.deleteOne({
        citizenEmail,
        vendorEmail,
      });
    } else {
      await favsModel.create({
        citizenEmail,
        vendorEmail,
      });
    }

    const allFavs = await favsModel.find(
      { citizenEmail },
      { vendorEmail: 1, _id: 0 }
    );

    return res.json({
      status: true,
      data: allFavs.map((item) => item.vendorEmail),
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: false,
      msg: "Unable to update favourites.",
    });
  }
}

// Get complete favourite vendor details
async function getFavs(req, res) {
  try {
    let citizenEmail = req.emailid;

    const allFavs = await favsModel.find(
      { citizenEmail },
      { vendorEmail: 1, _id: 0 }
    );

    const vendorEmails = allFavs.map((item) => item.vendorEmail);

    const vendors = await vendorModel.find({
      emailid: { $in: vendorEmails },
    });

    return res.json({
      status: true,
      data: vendors,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: false,
      msg: "Unable to fetch favourites.",
    });
  }
}

module.exports = { toggleFav, getFavs };