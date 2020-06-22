var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    fname:String,
    lname:String,
    phno:String,
    password: String,
    orderHistory:[{
        bid: String,
        sid: String,
        itemname:String,
        status:String,
        quantity:Number
    }]
});

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("Buyer", UserSchema);