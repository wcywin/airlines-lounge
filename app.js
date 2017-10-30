var express             = require("express"),
    app                 = express(),
    bodyParser          = require("body-parser"),
    mongoose            = require("mongoose");

mongoose.connect("mongodb://localhost/airlines", {useMongoClient: true});
mongoose.promise = global.promise;

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// SCHEMA SETUP
var airlineSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Airline = mongoose.model("Airline", airlineSchema);

// Airline.create({
//     name: "Air Berlin", 
//     image: "http://imgproc.airliners.net/photos/airliners/3/8/1/4661183.jpg?v=v418abde9484",
//     description: "This airline went bankrupt on the 29.10.2017"
//     }, function(err, airline){
//         if(err){
//             console.log(err);
//         } else {
//             console.log("Newly created Airline: ");
//             console.log(airline);
//         }
// });

// var airlines = [
//         {name: "Emirates", image: "http://imgproc.airliners.net/photos/airliners/5/3/6/4645635.jpg?v=v447142f4cac"},
//         {name: "Air Berlin", image: "http://imgproc.airliners.net/photos/airliners/3/8/1/4661183.jpg?v=v418abde9484"},
//         {name: "LOT", image: "http://imgproc.airliners.net/photos/airliners/7/0/6/4487607.jpg?v=v485773631c9"},
//         {name: "Emirates", image: "http://imgproc.airliners.net/photos/airliners/5/3/6/4645635.jpg?v=v447142f4cac"},
//         {name: "Air Berlin", image: "http://imgproc.airliners.net/photos/airliners/3/8/1/4661183.jpg?v=v418abde9484"},
//         {name: "LOT", image: "http://imgproc.airliners.net/photos/airliners/7/0/6/4487607.jpg?v=v485773631c9"},
//         {name: "Emirates", image: "http://imgproc.airliners.net/photos/airliners/5/3/6/4645635.jpg?v=v447142f4cac"},
//         {name: "Air Berlin", image: "http://imgproc.airliners.net/photos/airliners/3/8/1/4661183.jpg?v=v418abde9484"},
//         {name: "LOT", image: "http://imgproc.airliners.net/photos/airliners/7/0/6/4487607.jpg?v=v485773631c9"}
// ];

app.get("/", function(req,res){
    res.render("landing");
});

app.get("/airlines", function(req,res){
    // Get all airlines from DB
    Airline.find({}, function(err, allAirlines){
        if(err){
            console.log(err);
        } else {
            res.render("index", {airlines:allAirlines});
        }
    });
});

app.post("/airlines", function(req,res){
     // get data from form and add to airlines array
     var name = req.body.name;
     var image = req.body.image;
     var desc = req.body.description;
     var newAirline = {name: name, image: image, description: desc};
    // Create a new Airline and save to DB
     Airline.create(newAirline, function(err, newlyCreated){
         if(err){
             console.log(err);
         } else {
             // redirects back to airlines page
             res.redirect("/airlines");
         }
     });
});

app.get("/airlines/new", function(req, res) {
    res.render("new"); 
});

// SHOW - shows more info about the airline
app.get("/airlines/:id", function(req,res){
    //find the airline with provided id
    Airline.findById(req.params.id, function(err, foundAirline){
        if(err){
            console.log(err);
        } else {
        //render show template of the airline
        res.render("show", {airline: foundAirline});
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Airlines Lounge is running...");  
});