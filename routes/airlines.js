var express = require("express");
var router  = express.Router();
var Airline = require("../models/airline");
var middleware = require("../middleware"); // we don't have to "/index.js" because this is the default file in any dir
var geocoder = require("geocoder");


// INDEX route - show all airlines
router.get("/", function(req, res){
    var noMatch = null;
    if(req.query.search && req.xhr) {
        var regex = new RegExp(escapeRegex(req.query.search), 'gi');
        // Get all airlines from DB
        Airline.find({name: regex}, function(err, allAirlines){         
            if(err){
                console.log(err);
            } else {
                if(allAirlines.length < 1){
                        noMatch = "No airlines match that query, please try again.";
                    }
                res.status(200).json(allAirlines);   
            }
        });
    } else {
        // Get all airlines from DB
        Airline.find({}, function(err, allAirlines){
            if(err){
                console.log(err);
            } else {
                if(req.xhr) {
                    res.json(allAirlines);
                } else {
                    res.render("airlines/index",{airlines: allAirlines, currentUser: req.user, page: 'airlines', noMatch: noMatch});            
                    
                }
          }
       });
    }
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
     };
     // Geocoder for the maps
     geocoder.geocode(req.body.location, function(err, data){
        var lat = data.results[0].geometry.location.lat;
        var lng = data.results[0].geometry.location.lng;
        var location = data.results[0].formatted_address;
        var newAirline = {name: name, rating: rating, image: image, description: desc, author: author, location: location, lat: lat, lng: lng};
        // CREATE a new airline and save ti DB
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
});

// new route
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("airlines/new"); 
});

// SHOW - shows more info about the airline
router.get("/:id", function(req,res){
    //find the airline with provided id
    Airline.findById(req.params.id).populate("comments").exec(function(err, foundAirline){
        if(err || !foundAirline){
            req.flash("error", "Airline not found");
            res.redirect("/airlines");
        } else {
            console.log(foundAirline);
            //render show template of the airline
            res.render("airlines/show", {airline: foundAirline});
        }
    });
});

// EDIT Airline routes
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
router.put("/:id", middleware.checkAirlineOwnership, function(req, res){
    geocoder.geocode(req.body.airline.location, function(err, data){
        var lat = data.results[0].geometry.location.lat;
        var lng = data.results[0].geometry.location.lng;
        var location = data.results[0].formatted_address;
        var newData = {name: req.body.airline.name, image: req.body.airline.image, description: req.body.airline.description, rating: req.body.airline.rating, location: req.body.airline.location, lat: lat, lng: lng};
        Airline.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, updatedAirline){
            if(err){
                req.flash("error", err.message);
                res.redirect("/airlines");
            } else {
                req.flash("success", "Successfully Updated!");
                res.redirect("/airlines/" + req.params.id);
            }
        });
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

// Regex function for Fuzzy Search
function escapeRegex(text){
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


module.exports = router;