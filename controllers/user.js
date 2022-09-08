const User = require("../models/User");

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