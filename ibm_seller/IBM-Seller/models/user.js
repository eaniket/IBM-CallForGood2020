var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    gstno:String,
    fname:String,
    lname:String,
    panno:String,
    password: String,
    lat:Number,
    lon:Number,
    orderHistory:[{
        bid: String,
        sid: String,
        itemname:String,
        status:String,
        quantity:Number
    }]
});

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("Seller", UserSchema);