var express = require("express");
var router  = express.Router();
var Airline = require("../models/airline");

// index route
router.get("/", function(req,res){
    // Get all airlines from DB
    Airline.find({}, function(err, allAirlines){
        if(err){
            console.log(err);
        } else {
            res.render("airlines/index", {airlines:allAirlines, currentUser: req.user});
        }
    });
});

// create route
router.post("/", isLoggedIn, function(req,res){
     // get data from form and add to airlines array
     var name = req.body.name;
     var image = req.body.image;
     var desc = req.body.description;
     var author = {
         id: req.user._id,
         username: req.user.username
     }
     var newAirline = {name: name, image: image, description: desc, author: author};
    // Create a new Airline and save to DB
     Airline.create(newAirline, function(err, newlyCreated){
         if(err){
             console.log(err);
         } else {
             // redirects back to airlines page
             console.log(newlyCreated);
             res.redirect("/airlines");
         }
     });
});

// new route
router.get("/new", isLoggedIn, function(req, res) {
    res.render("airlines/new"); 
});

// SHOW - shows more info about the airline
router.get("/:id", function(req,res){
    //find the airline with provided id
    Airline.findById(req.params.id).populate("comments").exec(function(err, foundAirline){
        if(err){
            console.log(err);
        } else {
            console.log(foundAirline);
            //render show template of the airline
            res.render("airlines/show", {airline: foundAirline});
        }
    });
});

// ====================
// MIDDLEWARE
// ====================
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;