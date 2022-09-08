const mongoose = require("mongoose");
const {v1 : uuid} = require("uuid");
const crypto = require("crypto");

const {ObjectId} = mongoose.Schema;

const billSchema = new mongoose.Schema({
    owner_id : ObjectId,
    title : {
        type : String,
        trim : true,
        require : true
    },
    description : {
        type : String,
        trim : true,
        require : true
    },
    amount : Number,
    currency : {
        type : String,
        trim : true,
        require : true
    },
    email_to : {
        type : String,
        trim : true,
        require : true
    },
    created : {
        type : Date,
        default : Date.now
    },
    updated : {
        type : Date,
        default : Date.now
    },
    viewed_at : Date,
    payed_at : Date,
    viewed : {
        type : Boolean,
        default : false
    },
    payed : {
        type : Boolean,
        default : false
    },
    attachments : {
        type : Array,
        default : []
    },
    user_id : ObjectId
});

module.exports = mongoose.model("Bill",billSchema);