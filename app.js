var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var airlines = [
        {name: "Emirates", image: "http://imgproc.airliners.net/photos/airliners/5/3/6/4645635.jpg?v=v447142f4cac"},
        {name: "Air Berlin", image: "http://imgproc.airliners.net/photos/airliners/3/8/1/4661183.jpg?v=v418abde9484"},
        {name: "LOT", image: "http://imgproc.airliners.net/photos/airliners/7/0/6/4487607.jpg?v=v485773631c9"}
];

app.get("/", function(req,res){
    res.render("landing");
});

app.get("/airlines", function(req,res){
    res.render("airlines", {airlines:airlines});
});

app.post("/airlines", function(req,res){
    res.send("YOU HIT THE POST ROUTE");
     // get data from form and add to airlines array
     var name = req.body.name;
     var image = req.body.image;
     var newAirline = {name: name, image: image};
     airlines.push(newAirline);
     //redirect back to airlines page
     res.redirect("/airlines");
});

app.get("/airlines/new", function(req, res) {
    res.render("new.ejs"); 
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Airlines Lounge is running...");  
});