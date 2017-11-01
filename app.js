var express             = require("express"),
    app                 = express(),
    bodyParser          = require("body-parser"),
    mongoose            = require("mongoose"),
    passport            = require("passport"),
    localStrategy       = require("passport-local"),
    Airline             = require("./models/airline"),
    Comment             = require("./models/comment"),
    User                = require("./models/user"),
    seedDB              = require("./seeds");


mongoose.connect("mongodb://localhost/airlines", {useMongoClient: true});
mongoose.Promise = global.Promise;

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"))

seedDB();

// PASSPORT CONFIG
app.use(require("express-session")({
    secret: "Once again the Airline World is at the top!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){ // This is the middleware that works for all local files and it uses the user data
    res.locals.currentUser = req.user;
    next();
});

// var airlines = [
//         {name: "Emirates", image: "http://imgproc.airliners.net/photos/airliners/5/3/6/4645635.jpg?v=v447142f4cac"},
//         {name: "Air Berlin", image: "http://imgproc.airliners.net/photos/airliners/3/8/1/4661183.jpg?v=v418abde9484"},
//         {name: "LOT", image: "http://imgproc.airliners.net/photos/airliners/7/0/6/4487607.jpg?v=v485773631c9"},
//         {name: "American Airlines", image: "http://imgproc.airliners.net/photos/airliners/5/5/5/4652555.jpg?v=v434a1f3a109"}
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
            res.render("airlines/index", {airlines:allAirlines, currentUser: req.user});
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
    res.render("airlines/new"); 
});

// SHOW - shows more info about the airline
app.get("/airlines/:id", function(req,res){
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

// =========================================
// Comments Routes
// =========================================
app.get("/airlines/:id/comments/new", isLoggedIn, function(req, res) {
    // find airline by id
    Airline.findById(req.params.id, function(err, airline){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {airline: airline});
        }
    });
});

app.post("/airlines/:id/comments", isLoggedIn, function(req,res){
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
                    airline.comments.push(comment);
                    airline.save();
                    res.redirect('/airlines/' + airline._id);
                }
            });
        }
    })
    // create a new comment
    // connect new comment to airline
    // redirect to airline show page
});

// ====================
// AUTH ROUTES
// ====================
// show register form
app.get("/register", function(req,res){
    res.render("register");
});

// handle sign up logic
app.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username})
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            res.render("register");
        }
        passport.authenticate("local")(req,res, function(){
           res.redirect("/airlines"); 
        });
    });
});

// show login form
app.get("/login", function(req, res) {
    res.render("login");
});

// handlign login logic
app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/airlines",
        failureRedirect: "/login"
    }), function(req, res) {
});

// handling logout logic
app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/airlines");
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


// ====================
// SERVER CONFIG
// ====================
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Airlines Lounge is running...");  
});