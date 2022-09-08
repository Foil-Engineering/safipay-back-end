const express = require("express");
const {update_kyc_info,set_kyc_verified, get} = require("../controllers/user");
const router = express.Router();
const {requireSignin} = require("../controllers/auth");

router.put("/user/kyc/set", requireSignin, update_kyc_info);
router.put("/user/kyc/set/verified/:id", requireSignin, set_kyc_verified);
router.get("/user/:id", requireSignin, get);

module.exports = router;