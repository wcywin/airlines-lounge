var Airline = require("../models/airline");
var Comment = require("../models/comment");
// ====================
// ALL MIDDLEWARE
// ====================
var middlewareObj = {};


middlewareObj.checkAirlineOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Airline.findById(req.params.id, function(err, foundAirline){
            if(err){
                req.flash("error", "Airline not found");
                res.redirect("/airlines");
            } else {
                // does user own the airline
                if(foundAirline.author.id.equals(req.user._id) || req.user.isAdmin) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that!");
                    res.redirect("/airlines");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("/airlines");
    }
}


middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            } else {
                // does user own the comment
                if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that!");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }
}


middlewareObj.isLoggedIn = function(req, res, next){
     if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("/login");
}


module.exports = middlewareObj;