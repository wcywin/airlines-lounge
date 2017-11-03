var express = require("express");
var router  = express.Router({mergeParams: true});
var Airline = require("../models/airline")
var Comment = require("../models/comment")

// Comments new
router.get("/new", isLoggedIn, function(req, res) {
    // find airline by id
    Airline.findById(req.params.id, function(err, airline){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {airline: airline});
        }
    });
});

// Comments create
router.post("/", isLoggedIn, function(req,res){
    // lookup airline using ID
    Airline.findById(req.params.id, function(err, airline) {
        if(err){
            console.log(err);
            res.redirect("/airlines");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    // add username and id to comment
                   comment.author.id = req.user._id;
                   comment.author.username = req.user.username;
                    // save comment
                    comment.save();
                    //push a new comment into database
                    airline.comments.push(comment);
                    // connect new comment to airline
                    airline.save();
                    // redirect to airline show page
                    res.redirect('/airlines/' + airline._id);
                }
            });
        }
    })
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