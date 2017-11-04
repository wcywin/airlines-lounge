var express     = require("express");
var router      = express.Router();
var passport    = require("passport");
var User        = require("../models/user");
var middleware  = require("../middleware");

// root route
router.get("/", function(req,res){
    res.render("landing");
});

// ====================
// AUTH ROUTES
// ====================
// show register form
router.get("/register", function(req,res){
    res.render("register", {page: "register"});
});

// handle sign up logic
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username})
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            // req.flash("error", err.message);
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req,res, function(){
            req.flash("success", "Successfully Signed Up! Welcome to Airlines Lounge " + user.username + "!");
            res.redirect("/airlines"); 
        });
    });
});

// show login form
router.get("/login", function(req, res) {
    res.render("login", {page: "login"});
});

// handlign login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/airlines",
        failureRedirect: "/login",
        failureFlash: true
    }), function(req, res) {
});

// handling logout
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/airlines");
});


module.exports = router;