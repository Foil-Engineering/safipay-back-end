const User = require("../models/User");
const {sendEmail} = require("../utils/email");

exports.update_kyc_info = (req, res, next) => {
    User.findOneAndUpdate(
        {id : req.auth.id},
        {$set : {
            kyc_info : req.body
        }}, 
        {new : true}, 
        (err, data) => {
        if(err || !data){
            return res.status(400).json({
                error : "Unable to update kyc info"
            });
        }

        sendEmail(data.email, 'KYC info updated', 'Your KYC info has been updated\n Please wait for verification.', '<h2>Your KYC info has been updated</h2> Please wait for verification.');

        data.hashed_password = null;
        data.salt = null;
        res.json(data);
    });
}

exports.set_kyc_verified = async (req, res, next) => {
    User.findOneAndUpdate(
        {id : req.params.id},
        {$set : {
            verified : true,
            verified_at : Date.now()
        }}, 
        (err, data) => {
        if(err || !data){
            return res.status(400).json({
                error : "Unable to update kyc info"
            });
        }
        data.hashed_password = null;
        data.salt = null;
        data.user_id = req.params.user_id;

        sendEmail(data.email, 'KYC info verified', 'Your KYC info has been verified.\nYou can now use our services.', '<h2>Your KYC info has been verified</h2> You can now use our services.');

        res.json(data);
    });
}

exports.get = (req, res, next) => {
    User.findOne({id : req.params.id}, (err, data) => {
        if(err || !data){
            return res.status(400).json({
                error : "Unable to get user"
            });
        }
        data.hashed_password = null;
        data.salt = null;
        res.json(data);
    });
}   