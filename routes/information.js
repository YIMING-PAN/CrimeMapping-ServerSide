const express = require("express");
const Offences = require("../model/offences");
const router = express.Router();

/* GET offences */
router.get("/offences", (req, res) => {
  Offences.getOffences().then(offences => {
    res.json({
      offences: offences
    });
  });
});

/* GET areas */
router.get("/areas", (req, res) => {
  Offences.getAreas().then(areas => {
    res.json({
      areas: areas
    });
  });
});

/* GET ages */
router.get("/ages", (req, res) => {
  Offences.getAges().then(ages => {
    res.json({
      ages: ages
    });
  });
});

/* GET genders */
router.get("/genders", (req, res) => {
  Offences.getGenders().then(genders => {
    res.json({
      genders: genders
    });
  });
});

/* GET years */
router.get("/years", (req, res) => {
  Offences.getYears().then(years => {
    res.json({
      years: years
    });
  });
});

module.exports = router;
