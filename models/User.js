const mongoose = require("mongoose");
const {v1 : uuid} = require("uuid");
const crypto = require("crypto");

const {ObjectId} = mongoose.Schema;

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        trim : true,
        require : true
    },
    email : {
        type : String,
        trim : true,
        require : true
    },
    hashed_password : {
        type : String,
        trim : true,
        require : true
    },
    salt : String,
    created : {
        type : Date,
        default : Date.now
    },
    updated : Date,
    avatar : {
        data : Buffer,
        contentType : String
    },
    verified : {
        type : Boolean,
        default : false
    }
});

const encryptPassword = (password, salt) => {
    if(!password) return "";
    try{
        return crypto.createHmac("sha256",salt).update(password).digest("hex");
    }catch(error){
        return "";
    }
};

userSchema.virtual('password')
    .set(function(password){
        //Create temproty variable called _password
        this._password = password;
        this.salt = uuid();
        this.hashed_password = encryptPassword(password,this.salt);
    })
    .get(function(){
        return this._password;
    });

userSchema.methods = {
    authenticate : function(plainText) {
        return encryptPassword(plainText, this.salt) === this.hashed_password
    }
};

module.exports = mongoose.model("User",userSchema);