const Bill = require("../models/Bill");
const uuid = require("uuid");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

exports.add_bill = (req, res, next) => {
    req.auth.hashed_password = undefined;
    req.auth.salt = undefined;
    req.body.user_id = req.auth.id;
    req.body.unique_url_param = uuid.v1();
    const bill = new Bill(req.body);
    bill.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: "Unable to save bill in DB"
            });
        }

        //Send notification email 
        const transporter = nodemailer.createTransport({
            service: 'smtp',
            host: process.env.SMTP_SERVER,
            port: process.env.SMTP_PORT,
            secure: true,
            auth: {
                user: process.env.EMAIL_ADDR,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_ADDR,
            to: req.auth.email,
            subject: 'Bill added',
            text: 'Your bill has been added successfully',
            html: '<h1>Your bill has been added successfully</h1>'
        };

        const mailOptionsDest = {
            from: process.env.EMAIL_ADDR,
            to: req.body.email_to,
            subject: 'You have a new bill',
            text: 'Your bill has been added successfully',
            html: '<h1>Your bill has been added successfully</h1>'
        };

        

        transporter.sendMail(mailOptionsDest, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        res.json(data);
    });
};

exports.get_my_bills = (req, res, next) => {
    //get my bills order desc
    Bill.find({user_id : req.auth.id})
        .sort({created : -1})
        .exec((err, data) => {
            if(err){
                return res.status(400).json({
                    error : "Unable to get bills"
                });
            }
            res.json(data);
        });
};

exports.get_a_bill_by_unique_url_param = (req, res, next) => {
    Bill.findOne({unique_url_param : req.params.url_unique_param}, (err, data) => {
        if(err || !data){
            return res.status(400).json({
                error : "Unable to get bill",
                id : req.params.url_unique_param
            });
        }
        res.json(data);
    });
}

exports.update_a_bill_paid = (req, res, next) => {
    Bill.findOneAndUpdate(
        {id : req.params.id},
        {$set : {
            payed : true,
            payed_at : Date.now()
        }}, 
        {new : true}, 
        (err, data) => {
        if(err || !data){
            return res.status(400).json({
                error : "Unable to update bill"
            });
        }
        res.json(data);
    });
}

exports.update_a_bill_viewed = (req, res, next) => {
    Bill.findOneAndUpdate(
        {id : req.params.id},
        {$set : {
            viewed : true,
            viewed_at : Date.now()
        }}, 
        {new : true}, 
        (err, data) => {
        if(err || !data){
            return res.status(400).json({
                error : "Unable to update bill"
            });
        }
        res.json(data);
    });
}