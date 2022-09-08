const Bill = require("../models/Bill");

exports.add_bill = (req, res, next) => {
    req.auth.hashed_password = undefined;
    req.auth.salt = undefined;
    req.body.user_id = req.auth.id;
    const bill = new Bill(req.body);
    bill.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: "Unable to save bill in DB"
            });
        }
        res.json(data);
    });
};