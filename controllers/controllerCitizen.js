
var CitizenColRef = require("../models/ModelCitizen");
var { CallAi } = require("../config/configAI");

// AI READ AADHAAR — images directly from memory
async function doExtractAadhaar(req, resp) {
  try {
    if (!req.files || (!req.files.frontCard && !req.files.backCard)) {
      return resp.status(400).json({
        success: false,
        message: "Please upload the front or back Aadhaar image.",
      });
    }

    const imageParts = [];

    if (req.files.frontCard) {
      imageParts.push({
        data: req.files.frontCard.data,
        mimeType: req.files.frontCard.mimetype || "image/jpeg",
      });
    }

    if (req.files.backCard) {
      imageParts.push({
        data: req.files.backCard.data,
        mimeType: req.files.backCard.mimetype || "image/jpeg",
      });
    }

    console.log(
      `[CitizenController] Processing Aadhaar OCR with ${imageParts.length} image(s)...`
    );

    const extracted = await CallAi(imageParts);

console.log("OCR fields received:", {
  name: Boolean(extracted.name),
  dob: Boolean(extracted.dob),
  gender: Boolean(extracted.gender),
  acardno: Boolean(extracted.acardno),
  address: Boolean(extracted.address),
  city: Boolean(extracted.city),
});

return resp.json({
  success: true,
  data: {
    name: extracted.name || "",
    dob: extracted.dob || "",
    gender: extracted.gender || "",
    acardno: extracted.acardno || "",
    address: extracted.address || "",
    city: extracted.city || "",
    state: extracted.state || "",
    pincode: extracted.pincode || "",
  },
});

  } catch (err) {
    console.error("[CitizenController] OCR Extraction Error:", err);

    return resp.status(500).json({
      success: false,
      message: err.message || "Failed to process Aadhaar card OCR.",
    });
  }
}

// SIGNUP
async function doSignup(req, resp) {
  try {
    console.log("Signup body fields:", {
      keys: Object.keys(req.body || {}),
      nameReceived: Boolean(req.body?.name),
      acardnoReceived: Boolean(req.body?.acardno),
      dobReceived: Boolean(req.body?.dob),
      genderReceived: Boolean(req.body?.gender),
      addressReceived: Boolean(req.body?.address),
      cityReceived: Boolean(req.body?.city),
    });

    const emailid = (req.body.emailid || "").trim().toLowerCase();

    if (!emailid) {
      return resp.status(400).json({
        status: false,
        msg: "Email Id is required.",
      });
    }

    const existing = await CitizenColRef.findOne({ emailid });

    if (existing) {
      return resp.json({
        status: false,
        msg: "Citizen already registered with this email.",
      });
    }

    const obj = new CitizenColRef({
      emailid,
      acardno: req.body.acardno || "",
      name: req.body.name || "",
      dob: req.body.dob || "",
      gender: req.body.gender || "",
      address: req.body.address || "",
      city: req.body.city || "",
      contact: req.body.contact || "",
    });

    const savedData = await obj.save();

    return resp.json({
      status: true,
      msg: "Citizen data saved successfully.",
      data: savedData,
    });
  } catch (err) {
    console.error("Citizen Signup Error:", err);

    return resp.status(500).json({
      status: false,
      msg: "Citizen signup failed.",
    });
  }
}

// FIND
async function doFind(req, resp) {
  try {
    const emailid = (req.body.emailid || "").trim().toLowerCase();
    const result = await CitizenColRef.findOne({ emailid });

    if (!result) {
      return resp.status(404).json({
        status: false,
        msg: "Citizen record not found.",
      });
    }

    return resp.json({ status: true, msg: result });
  } catch (err) {
    console.error("Citizen Find Error:", err);

    return resp.status(500).json({
      status: false,
      msg: "Could not fetch citizen details.",
    });
  }
}

// UPDATE
async function doUpdate(req, resp) {
  try {
    const emailid = (req.body.emailid || "").trim().toLowerCase();

    if (!emailid) {
      return resp.status(400).json({
        status: false,
        msg: "Email Id is required.",
      });
    }

    const updateData = {
      acardno: req.body.acardno || "",
      name: req.body.name || "",
      dob: req.body.dob || "",
      gender: req.body.gender || "",
      address: req.body.address || "",
      city: req.body.city || "",
      contact: req.body.contact || "",
    };

    const result = await CitizenColRef.findOneAndUpdate(
      { emailid },
      { $set: updateData },
      { returnDocument: "after", runValidators: true }
    );

    if (!result) {
      return resp.status(404).json({
        status: false,
        msg: "Citizen record not found.",
      });
    }

    return resp.json({
      status: true,
      msg: "Citizen details updated successfully.",
      data: result,
    });
  } catch (err) {
    console.error("Citizen Update Error:", err);

    return resp.status(500).json({
      status: false,
      msg: "Citizen update failed.",
    });
  }
}

module.exports = {
  doSignup,
  doFind,
  doUpdate,
  doExtractAadhaar,
};
