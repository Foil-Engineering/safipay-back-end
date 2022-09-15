const Bill = require("../models/Bill");
const User = require("../models/User");
const uuid = require("uuid");
const dotenv = require("dotenv");
const {sendEmail} = require("../utils/email");

dotenv.config();

exports.add_bill = (req, res, next) => {
    try{
        console.log(req.auth);
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

            //Get user 
            User.findOne({id : req.auth.id}, (err, user) => {
                if(err || !user){
                    return res.status(400).json({
                        error : "User not found"
                    });
                }
                

                const title = data.title;
                const description = data.description;

                let subject = 'You have a new invoice';
                let text = `A new invoice was sent to you.\n ${title}\n${invoice_unique_url}`;
                const invoice_unique_url = `${process.env.APP_URL}/new-invoice?invoice_id=${data.unique_url_param}`;
                let body = `<h1>${title}</h1><body><a style='padding:10px;background:#03a9f4;color:white;border-radius:10px;text-decoration:none;' href='{invoice_unique_url}'>View the invoice</a><p>If you can't click on the previous link, copy this URL <b>${invoice_unique_url}</b></p></body>`;
                sendEmail(req.body.email_to, 'You have a new bill', text, body);
                
                subject = 'Your bill was added';
                text = 'Your bill has been added successfully';
                body = `<h1>${title}</h1><p>${description}</p><p>Invoice URL: <a href='{invoice_unique_url}'>${invoice_unique_url}</a></p>`;
                sendEmail(user.email, 'You have a new bill', text, body);
                
                res.json(data);
            });
        });
    }catch(e){
        console.log(e);
        res.status(400).json({error : "An error occured", e});
    }
};

exports.get_my_bills = (req, res, next) => {
    try{
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
    }catch(e){
        console.log(e);
        res.status(400).json({error : "An error occured", e});
    }
};

exports.get_a_bill_by_unique_url_param =  (req, res, next) => {
    try{
    Bill.findOne({unique_url_param : req.params.url_unique_param},(err, bill) => {
        if(err || !bill){
            return res.status(400).json({
                error : "Unable to get bill",
                id : req.params.url_unique_param
            });
        }
        //Get user 
        User.findOne({id : bill.user_id}, (err, user) => {
            if(err || !user){
                return res.status(400).json({
                    error : "Unable to get user"
                });
            }
            res.json({bill,user});
        });
    });
    }catch(e){
        console.log(e);
        res.status(400).json({error : "An error occured", e});
    }
}

exports.update_a_bill_paid = (req, res, next) => {
    try{
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
    }catch(e){
        console.log(e);
        res.status(400).json({error : "An error occured", e});
    }
}

exports.update_a_bill_viewed = (req, res, next) => {
    try{
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
    }catch(e){
        console.log(e);
        res.status(400).json({error : "An error occured", e});
    }
}