require('dotenv').config();

var express             = require("express"),
    app                 = express(),
    bodyParser          = require("body-parser"),
    mongoose            = require("mongoose"),
    flash               = require("connect-flash"),
    passport            = require("passport"),
    localStrategy       = require("passport-local"),
    methodOverride      = require("method-override"),
    Airline             = require("./models/airline"),
    Comment             = require("./models/comment"),
    User                = require("./models/user"),
    seedDB              = require("./seeds");
    
// ====================
// REQUIRING ROUTES
// ====================
var commentRoutes       = require("./routes/comments"),
    airlineRoutes       = require("./routes/airlines"),
    indexRoutes         = require("./routes/index");



mongoose.connect("mongodb://localhost/airlines", {useMongoClient: true});
mongoose.Promise = global.Promise;
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"))
app.use(methodOverride("_method"));
app.use(flash()); // must come before the passport config
// seedDB(); // seed the databas
app.locals.moment = require("moment");

// ====================
// PASSPORT CONFIG
// ====================
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
    res.locals.error = req.flash("error"); // makes it available for all templates under error
    res.locals.success = req.flash("success"); // makes it available for all templates under success
    next();
});

// var airlines = [
//         {name: "Emirates", image: "http://imgproc.airliners.net/photos/airliners/5/3/6/4645635.jpg?v=v447142f4cac"},
//         {name: "Air Berlin", image: "http://imgproc.airliners.net/photos/airliners/3/8/1/4661183.jpg?v=v418abde9484"},
//         {name: "LOT", image: "http://imgproc.airliners.net/photos/airliners/7/0/6/4487607.jpg?v=v485773631c9"},
//         {name: "American Airlines", image: "http://imgproc.airliners.net/photos/airliners/5/5/5/4652555.jpg?v=v434a1f3a109"}
// ];

// ================================
// EXPORTED DEPENDENCIES TO BE USED
// ================================
app.use("/", indexRoutes);
app.use("/airlines", airlineRoutes);
app.use("/airlines/:id/comments", commentRoutes);

// ====================
// SERVER CONFIG
// ====================
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Airlines Lounge is running...");  
});