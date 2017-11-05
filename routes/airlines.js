var express = require("express");
var router  = express.Router();
var Airline = require("../models/airline");
var middleware = require("../middleware"); // we don't have to "/index.js" because this is the default file in any dir


// index route
router.get("/", function(req,res){
    // Get all airlines from DB
    Airline.find({}, function(err, allAirlines){
        if(err){
            console.log(err);
        } else {
            res.render("airlines/index", {airlines: allAirlines, currentUser: req.user, page: "airlines"});
        }
    });
});

// create route
router.post("/", middleware.isLoggedIn, function(req,res){
     // get data from form and add to airlines array
     var name = req.body.name;
     var rating = req.body.rating;
     var image = req.body.image;
     var desc = req.body.description;
     var author = {
         id: req.user._id,
         username: req.user.username
     }
     var newAirline = {name: name, rating: rating, image: image, description: desc, author: author};
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
router.get("/new", middleware.isLoggedIn, function(req, res) {
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

// EDIT Airline route
router.get("/:id/edit", middleware.checkAirlineOwnership, function(req, res) {
    Airline.findById(req.params.id, function(err, foundAirline) {
        if(err){
            req.flash("error", "You don't have permission to edit the Airline!");
            res.redirect("/airlines");
        }
        res.render("airlines/edit", {airline: foundAirline});
    });
});

// UPDATE Airline route
router.put("/:id", middleware.checkAirlineOwnership, function(req,res){
    Airline.findByIdAndUpdate(req.params.id, req.body.airline, function(err, updatedAirline){
        if(err){
            res.redirect("/airlines");
        } else {
            res.redirect("/airlines/" + req.params.id);
        }
    });
});


// DESTROY Airline route
router.delete("/:id", middleware.checkAirlineOwnership, function(req,res){
     Airline.findByIdAndRemove(req.params.id, function(err){
         if(err){
             res.redirect("/airlines");
         } else {
             res.redirect("/airlines");
         }
     });
});



module.exports = router;