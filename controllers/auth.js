const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const { expressjwt } = require("express-jwt");
const User = require("../models/User");

dotenv.config();

exports.login = async (req, res, next) => {
    console.log(req.body);
    const {email, password} = req.body;
    User.findOne({email}, (err, user) => {
        if(err || !user){
            return res.status(401).json({
                error : "User with that email does not exist. Please sign up"
            });
        }
        if(!user.authenticate(password,user.salt)){
            return res.status(401).json({
                error : "Email and password do not match"
            });
        }

        const token = jwt.sign({id : user._id},process.env.JWT_SECRET);
        
        res.cookie("t",token,{expire : new Date() + 9999});

        const {_id, name, email} = user;
        
        return res.status(200).json({
            token : token,
            user : {_id, email, name}
        });
    });
};

exports.signup = async (req, res, next) => {
    const user_exists = await User.findOne({email : req.body.email});
    if(user_exists) res.status(403).json({error : "Email is taken!"});
    const user = await new User(req.body);
    await user.save();
    res.json({user})
}

exports.requireSignin = expressjwt({
    secret : process.env.JWT_SECRET,
    algorithms : ["HS256"],
    userProperty : "auth",
    
});