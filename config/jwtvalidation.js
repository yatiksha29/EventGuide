
let jwt = require("jsonwebtoken");

function validateToken(req, res, next) {
  let fulltoken = req.headers["authorization"];

  if (!fulltoken || !fulltoken.startsWith("Bearer ")) {
    return res.status(401).json({
      status: false,
      msg: "Token Missing"
    });
  }

  let ary = fulltoken.split(" ");

  try {
    let TokenValidObj = jwt.verify(
      ary[1],
      process.env.SEC_KEY
    );

    req.emailid = TokenValidObj.emailid;

    next();

  } catch (err) {
    return res.status(401).json({
      status: false,
      msg: "Invalid or Expired Token"
    });
  }
}

module.exports = { validateToken };
