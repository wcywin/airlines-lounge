var mongoose = require("mongoose");
var Airline = require("./models/airline");
var Comment = require("./models/comment");

var data = [
    {
        name: "Emirates", 
        image: "http://imgproc.airliners.net/photos/airliners/5/3/6/4645635.jpg?v=v447142f4cac",
        description: "Airline of the World 2016. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Impedit inventore eaque nisi neque dignissimos, vero aperiam fugiat, eveniet animi rerum facilis? Commodi ipsa dolorum veniam voluptate cumque, facilis qui provident?"
    },
    {
        name: "LOT",
        image: "http://imgproc.airliners.net/photos/airliners/7/0/6/4487607.jpg?v=v485773631c9",
        description: "The First Airline in the World to fly the Dreamliner. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Impedit inventore eaque nisi neque dignissimos, vero aperiam fugiat, eveniet animi rerum facilis? Commodi ipsa dolorum veniam voluptate cumque, facilis qui provident?"
    },
    {
        name: "Air Berlin",
        image: "http://imgproc.airliners.net/photos/airliners/3/8/1/4661183.jpg?v=v418abde9484",
        description: "The Airline wen bankrupt on the 29.10.2017. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Impedit inventore eaque nisi neque dignissimos, vero aperiam fugiat, eveniet animi rerum facilis? Commodi ipsa dolorum veniam voluptate cumque, facilis qui provident?"
    }
]

function seedDB(){
    // Remove all Airlines
    Airline.remove({}, function(err){
    if(err){
        console.log(err);
    }
        console.log("removed airlines!");
        // Add few Airlines
        data.forEach(function(seed){
            Airline.create(seed, function(err, airline){
                if(err){
                    console.log(err);
                } else {
                    console.log("Added an Airline!");
                    // Create a comment
                    Comment.create(
                        {
                            text: "This Airline has Wi-Fi!!!", 
                            author: "Wojciech Cywinski"
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            } else {
                                airline.comments.push(comment);
                                airline.save();
                                console.log("Created new comment!");
                            }
                        })
                }
            });
        });
    });
}

module.exports = seedDB;