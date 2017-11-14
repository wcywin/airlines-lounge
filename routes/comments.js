var express = require("express");
var router  = express.Router({mergeParams: true});
var Airline = require("../models/airline");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// NEW Comment
router.get("/new", middleware.isLoggedIn, function(req, res) {
    // find airline by id
    Airline.findById(req.params.id, function(err, airline){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {airline: airline});
        }
    });
});

// CREATE comment
router.post("/", middleware.isLoggedIn, function(req,res){
    // lookup airline using ID
    Airline.findById(req.params.id, function(err, airline) {
        if(err){
            console.log(err);
            res.redirect("/airlines");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Something went wrong...");
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
                    req.flash("success", "Successfully added your comment!");
                    res.redirect('/airlines/' + airline._id);
                }
            });
        }
    })
});

// EDIT comment (RETRIEVE)
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req,res){
    Airline.findById(req.params.id, function(err, foundAirline){
        if(err || !foundAirline){
            req.flash("error", "Airline not found");
            return res.redirect("/airlines");
        }
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if(err || !foundComment){
                req.flash("error", "Comment not found");
                res.redirect("/airlines");
            } else {
                res.render("comments/edit", {airline_id: req.params.id, comment: foundComment});
            }
        });
    });
});

// UPDATE comment
router.put("/:comment_id", middleware.checkCommentOwnership, function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/airlines/" + req.params.id);
        }
    })
});

// DELETE comment
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted!");
            res.redirect("/airlines/" + req.params.id);
        }
    });
});


module.exports = router;