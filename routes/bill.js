const express = require("express");
const {add_bill} = require("../controllers/bill");
const router = express.Router();
const {requireSignin} = require("../controllers/auth");

router.post("/bill/add", requireSignin, add_bill);

module.exports = router;