const express = require("express");
const Account = require("../model/account");
const Offences = require("../model/offences");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../config");

const router = express.Router();

/* POST search */
router.get("/search", async (req, res) => {
  if (!req.headers.authorization) {
    return res.status(401).json({
      message: "oh no! it looks like your authorization token is invalid..."
    });
  }

  const authorization = req.headers.authorization;

  if (authorization.indexOf("Bearer") == -1) {
    return res.status(401).json({
      message: "oh no! it looks like your authorization token is invalid..."
    });
  }

  const token = authorization.substr("Bearer ".length);

  // console.log("token", token);

  jwt.verify(token, config.secret, async (err, decoded) => {
    if (err) {
      return res.status(401).json({
        message: "oh no! it looks like your authorization token is invalid..."
      });
    }

    // console.log("decoded", decoded);

    const user = await Account.findUser(decoded.email);

    if (!user) {
      return res.status(401).json({
        message: "oh no! it looks like your authorization token is invalid..."
      });
    }

    // validation succeed
    if (!req.query.offence) {
      return res.status(400).json({
        message: "oops! it looks like you're missing the offence query parm"
      });
    }

    const offence = req.query.offence;

    // do search!
    try {
      const result = await Offences.search(offence, req.query);
      // console.log(result);
      return res.json({
        query: req.query,
        result: result
      });
    } catch (error) {
      return res.status(400).json({
        message: error.message
      });
    }
  });
});

module.exports = router;
