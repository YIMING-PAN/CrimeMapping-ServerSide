const express = require("express");
const Account = require("../model/account");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../config");

const router = express.Router();

/* POST login */
router.post("/login", async (req, res) => {
  if (!req.body || !req.body.password || !req.body.email) {
    return res.status(400).json({
      message: "invalid login - you need to supply both an email and password"
    });
  }

  try {
    const user = await Account.findUser(req.body.email);

    if (!user) {
      return res.status(400).json({
        message: "invalid login - no such user"
      });
    }

    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

    if (!passwordIsValid) {
      return res.status(401).json({
        message: "invalid login - bad password"
      });
    }

    const token = jwt.sign({ email: user.email }, config.secret, {
      expiresIn: 86400 // expires in 24 hours
    });

    return res.json({
      access_token: token,
      token: token,
      token_type: "Bearer",
      expires_in: 86400
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
});

/* POST register */
router.post("/register", async (req, res) => {
  if (!req.body || !req.body.password || !req.body.email) {
    return res.status(400).json({
      message:
        "error creating new user - you need to supply both an email and password"
    });
  }

  try {
    const user = await Account.findUser(req.body.email);

    if (user) {
      return res.status(400).json({
        message: "oops! It looks like that user already exists :("
      });
    }
  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }

  const hashedPassword = bcrypt.hashSync(req.body.password, 8);
  console.log("hashedPassword", hashedPassword);

  try {
    await Account.insertUser(req.body.email, hashedPassword);
    return res.status(201).json({
      message: "yay! you've successfully registered your user account :)"
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
});

module.exports = router;
