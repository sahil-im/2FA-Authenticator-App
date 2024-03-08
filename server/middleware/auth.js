require('dotenv').config();
const jwt = require("jsonwebtoken");
const schema2Fa = require('../app');

isValidToken = async (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    try {
      const decode = await jwt.verify(token, process.env.JWT_SECRET);

      const user = await schema2Fa.findOne({
        _id: decode._id
      }).catch((error) => {
        console.log('error :', error);
        return false;
      });
      if (user) {
        req.AuthenticateUser = user; // Corrected the variable name
        next();
      }
      else
        return res.status(401).json({ status: false, statusCode: 401, message: "Unauthorized! Please login" });
    } catch (error) {
      console.log('error :', error);
      return res.status(401).json({
        status: false,
        msg: "Unauthorized! Please login",
      });
    }
  }
  else {
    return res.status(401).json({
      status: false,
      msg: "Unauthorized! Please login",
    });
  }
}

module.exports = {
  isValidToken
}
