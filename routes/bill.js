const express = require("express");
const {add_bill, get_my_bills,get_a_bill_by_unique_url_param, update_a_bill_paid, update_a_bill_viewed} = require("../controllers/bill");
const router = express.Router();
const {requireSignin, requireIsEmployee} = require("../controllers/auth");

router.post("/bill/add", requireSignin, add_bill);
router.get("/bills", requireSignin, get_my_bills);
router.get("/bill/:url_unique_param",get_a_bill_by_unique_url_param);
//router.put("/bill/payed/:id", requireSignin,requireIsEmployee, update_a_bill); //Secure
router.put("/bill/payed/:id", requireSignin, update_a_bill_paid); //Unsecure for MVP
router.put("/bill/viewed/:id", requireSignin, update_a_bill_viewed); //Unsecure for MVP

module.exports = router;