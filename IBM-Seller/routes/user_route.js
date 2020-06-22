var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Buyer = require("../models/buyer");

//root route
router.get("/", function (req, res) {
    res.render("landing");
});

// show register form
router.get("/bregister", function (req, res) {
    res.render("user/bregister");
});

router.get("/sregister", function (req, res) {
    res.render("user/sregister");
});

router.get("/buyer", function (req, res) {
    res.render("user/buyer")
})

router.get("/seller", function (req, res) {
    res.render("user/seller")
})

//handle sign up logic
router.post("/sregister", function (req, res) {
    var newUser = new User({
        username: req.body.username,
        fname: req.body.fname,
        lname: req.body.lname,
        gstno: req.body.gstno,
        panno: req.body.panno,
        lat:51.6435,
        lon:7.8923,
    });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res.render("sregister");
        }
        res.redirect("/success");
    });
});

router.get("/success", function (req, res) {
    res.render("success")
})

router.post("/bregister", function (req, res) {
    var newUser = new Buyer({
        username: req.body.username,
        fname: req.body.fname,
        lname: req.body.lname,
        phno: req.body.pno,
    });
    Buyer.register(newUser, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res.render("bregister");
        }
        res.redirect("/success");
    });
});

//show login form
router.get("/blogin", function (req, res) {
    res.render("user/blogin");
});

router.get("/slogin", function (req, res) {
    res.render("user/slogin");
});

//handling login logic
router.post("/blogin", passport.authenticate("local"), function (req, res) {
    res.redirect("/bdashb/" + req.body.username)
});

router.post("/slogin", passport.authenticate("local"), function (req, res) {
    res.redirect("/dashb/" + req.body.username)
});

// logout route
router.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
});

//middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;