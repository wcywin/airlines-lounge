var express     = require("express");
var router      = express.Router();
var passport    = require("passport");
var User        = require("../models/user");
var middleware  = require("../middleware");
var Airline     = require("../models/airline");

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
    var newUser = new User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        avatar: req.body.avatar
    });
    if(req.body.adminCode === 'secretCode123'){
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            // req.flash("error", err.message); // moved as an object below
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

// USER Profile
router.get("/users/:id", function(req, res) {
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            req.flash("error", "Something went wrong...");
            res.redirect("back");
        }
        Airline.find().where("author.id").equals(foundUser._id).exec(function(err, airlines){
            if(err){
                req.flash("error", "Something went wrong...");
                res.redirect("back");
            }
            res.render("users/show", {user: foundUser, airlines: airlines}); 
        });
    });
});

module.exports = router;