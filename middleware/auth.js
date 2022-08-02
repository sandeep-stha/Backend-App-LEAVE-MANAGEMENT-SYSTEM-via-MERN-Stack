//THIRD  PARTY
const jwt = require("jsonwebtoken");
require("express-async-errors");

//FUNCTION FOR AUTHENTICATION
module.exports.authentication = (req, res, next) => {
  //CHECK TOKEN SENT IN HEADER
  const tokenHeader = req.headers.authorization;
  if (tokenHeader) {
    //AS TOKEN HEADER COMES AS BEARER 1J13K109AA908ASD123, SO SPLIT splits them after a space comes i.e (' ') IN ARRAY AS[BEARER 1J13K109AA908ASD123]
    //HENCE, BEARER = INDEX 0 AND 1J13K109AA908ASD123 = INDEX 1
    const token = tokenHeader.split(" ")[1];
    if (!token)
      return res.status(401).json({ status: false, msg: "Token is required" });

    //ELSE
    try {
      req.user = jwt.verify(token, process.env.PRIVATE_KEY);
      next();
    } catch (err) {
      return res.status(400).json({ status: false, msg: "Invalid Token" });
    }
  } else
    return res
      .status(400)
      .json({ status: false, msg: "Please send a bearer Token" });
};

//FUNCTION FOR AUTHORIZATION
module.exports.authorization =
  (...roles) =>
  (req, res, next) => {
    //If Roles is not retrieved
    if (!roles.includes(req.user.role))
      return res
        .status(401)
        .json({ status: false, msg: "You are not authorized" });
    else next();
  };
