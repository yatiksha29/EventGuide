
var VendorColRef = require("../models/ModelVendor");
var { getCloudinaryObject } = require("../config/configCloud");
var path = require("path");

let cloudinary = getCloudinaryObject();

// ------------------ Save Vendor ------------------
async function doSignup(req, resp) {
  let shopUrl = "nopic.jpg";
  let certUrl = "";

  try {
    // Upload Shop Picture
    if (req.files && req.files.shoppic) {
      let fileName = req.files.shoppic.name;
      let fullPath = path.join(__dirname, "..", "uploads", fileName);

      await req.files.shoppic.mv(fullPath);
      console.log("Shop picture uploaded successfully");

      let picResult = await cloudinary.uploader.upload(fullPath);
      shopUrl = picResult.url;

      console.log("Shop Picture URL:", shopUrl);
    }

    // Upload Business Certificate
    if (req.files && req.files.certpic) {
      let fileName = req.files.certpic.name;
      let fullPath = path.join(__dirname, "..", "uploads", fileName);

      await req.files.certpic.mv(fullPath);
      console.log("Certificate uploaded successfully");

      let certResult = await cloudinary.uploader.upload(fullPath, {
        resource_type: "auto",
      });

      certUrl = certResult.secure_url;
      console.log("Certificate URL:", certUrl);
    }

    // Add uploaded file URLs to request body
    req.body.shoppicurl = shopUrl;
    req.body.certpicurl = certUrl;

    // Convert selected categories into an array
    if (typeof req.body.selcate === "string") {
      try {
        req.body.selcate = JSON.parse(req.body.selcate);
      } catch {
        req.body.selcate = [req.body.selcate];
      }
    }

    if (!req.body.emailid || !req.body.emailid.trim()) {
      return resp.status(400).json({
        status: false,
        msg: "Email Id is required",
      });
    }

    req.body.emailid = req.body.emailid.trim().toLowerCase();

    var existing = await VendorColRef.findOne({
      emailid: req.body.emailid,
    });

    if (existing) {
      return resp.status(409).json({
        status: false,
        msg: "Vendor with this Email Id already exists",
      });
    }

    let doc = new VendorColRef(req.body);

    doc
      .save()
      .then((result) => {
        resp.status(201).json({
          status: true,
          msg: "Vendor Record Saved Successfully",
          data: result,
        });
      })
      .catch((err) => {
        resp.status(500).json({
          status: false,
          msg: err.message,
        });
      });
  } catch (err) {
    console.log(err);

    resp.status(500).json({
      status: false,
      msg: err.message,
    });
  }
}

// ------------------ Find Vendor ------------------
function doFind(req, resp) {
  let eid = req.body.emailid;

  VendorColRef.findOne({ emailid: eid })
    .then((result) => {
      if (result != null) {
        resp.json({ status: true, msg: result });
      } else {
        resp.json({ status: false, msg: "Record Not Found" });
      }
    })
    .catch((err) => {
      resp.status(500).json({ status: false, msg: err.message });
    });
}

// ------------------ Update Vendor ------------------
async function doUpdate(req, resp) {
  let shopUrl;
  let certUrl;

  try {
    // Upload new Shop Picture if provided
    if (req.files && req.files.shoppic) {
      let fileName = req.files.shoppic.name;
      let fullPath = path.join(__dirname, "..", "uploads", fileName);

      await req.files.shoppic.mv(fullPath);

      let picResult = await cloudinary.uploader.upload(fullPath);
      shopUrl = picResult.secure_url;
    }

    // Upload new Certificate if provided
    if (req.files && req.files.certpic) {
      let fileName = req.files.certpic.name;
      let fullPath = path.join(__dirname, "..", "uploads", fileName);

      await req.files.certpic.mv(fullPath);

      let certResult = await cloudinary.uploader.upload(fullPath, {
        resource_type: "auto",
      });

      certUrl = certResult.secure_url;
    }

    // Parse categories if sent as FormData
    if (typeof req.body.selcate === "string") {
      try {
        req.body.selcate = JSON.parse(req.body.selcate);
      } catch {
        req.body.selcate = [req.body.selcate];
      }
    }

    if (shopUrl) req.body.shoppicurl = shopUrl;
    if (certUrl) req.body.certpicurl = certUrl;

    if (!req.body.emailid || !req.body.emailid.trim()) {
      return resp.status(400).json({
        status: false,
        msg: "Email Id is required",
      });
    }

    req.body.emailid = req.body.emailid.trim().toLowerCase();

    VendorColRef.findOneAndUpdate(
      { emailid: req.body.emailid },
      req.body,
      { new: true, runValidators: true }
    )
      .then((result) => {
        if (!result) {
          return resp.status(404).json({
            status: false,
            msg: "Vendor Record Not Found",
          });
        }

        resp.json({
          status: true,
          msg: "Vendor Record Updated Successfully",
          data: result,
        });
      })
      .catch((err) => {
        resp.status(500).json({
          status: false,
          msg: err.message,
        });
      });
  } catch (err) {
    console.log(err);

    resp.status(500).json({
      status: false,
      msg: err.message,
    });
  }
}

// ------------------ Show All Vendors ------------------
function showall(req, resp) {
  VendorColRef.find()
    .then((result) => {
      resp.json({ status: true, msg: result });
    })
    .catch((err) => {
      resp.status(500).json({
        status: false,
        msg: err.message,
      });
    });
}

// ------------------ Unregister Vendor ------------------
function doUnregister(req, resp) {
  let eid = req.body.emailid;

  VendorColRef.findOneAndDelete({ emailid: eid })
    .then((result) => {
      if (result) {
        resp.json({
          status: true,
          msg: "Vendor Record Deleted Successfully",
        });
      } else {
        resp.status(404).json({
          status: false,
          msg: "Vendor Record Not Found",
        });
      }
    })
    .catch((err) => {
      resp.status(500).json({
        status: false,
        msg: err.message,
      });
    });
}


/* ------------------ Get Distinct Cities ------------------ */
function getCities(req, resp) {
  VendorColRef.distinct("city")
    .then((result) => {
      let cities = result
        .filter((item) => item && item.trim() !== "")
        .sort();

      resp.json({
        status: true,
        data: cities,
      });
    })
    .catch((err) => {
      resp.status(500).json({
        status: false,
        msg: err.message,
      });
    });
}

/* ------------------ Search Vendors ------------------ */
function searchVendors(req, resp) {
  let city = req.body.city;
  let service = req.body.service;

  // Email comes from verified JWT token
  let citizenEmail = req.emailid;

    if (!citizenEmail) {
    return resp.status(401).json({
      status: false,
      msg: "Citizen authentication required"
    });
  }

  if (!city || !service) {
    return resp.status(400).json({
      status: false,
      msg: "City and service are required",
    });
  }

  VendorColRef.find({
    city: { $regex: "^" + city.trim() + "$", $options: "i" },
    selcate: service,
  })
    .then((result) => {
      resp.json({
        status: true,
        citizenEmail: citizenEmail,
        data: result,
      });
    })
    .catch((err) => {
      resp.status(500).json({
        status: false,
        msg: err.message,
      });
    });
}


module.exports = {
  doSignup,
  doFind,
  doUpdate,
  showall,
  doUnregister,
  getCities,
  searchVendors,
};
