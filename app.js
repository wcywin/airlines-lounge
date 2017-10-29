var express = require("express");
var app = express();

app.set("view engine", "ejs");

app.get("/", function(req,res){
    res.render("landing");
});

app.get("/airlines", function(req,res){
     var airlines = [
        {name: "Emirates", image: "http://imgproc.airliners.net/photos/airliners/5/3/6/4645635.jpg?v=v447142f4cac"},
        {name: "Air Berlin", image: "http://imgproc.airliners.net/photos/airliners/3/8/1/4661183.jpg?v=v418abde9484"},
        {name: "LOT", image: "http://imgproc.airliners.net/photos/airliners/7/0/6/4487607.jpg?v=v485773631c9"}
    ];
    res.render("airlines", {airlines:airlines});
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Airlines Lounge is running...");  
});