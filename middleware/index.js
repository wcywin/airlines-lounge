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
                res.redirect("/airlines");
            } else {
                // does user own the airline
                if(foundAirline.author.id.equals(req.user._id)) {
                    next();
                } else {
                     res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}


middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            } else {
                // does user own the comment
                if(foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                     res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}


middlewareObj.isLoggedIn = function(req, res, next){
     if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


module.exports = middlewareObj;