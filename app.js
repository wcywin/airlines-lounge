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
    User                = require("./models/user");
    
// ====================
// REQUIRING ROUTES
// ====================
var commentRoutes       = require("./routes/comments"),
    airlineRoutes       = require("./routes/airlines"),
    indexRoutes         = require("./routes/index");


var url = process.env.DATABASEURL || "mongodb://localhost/airlines";
mongoose.connect(url, {useMongoClient: true});

mongoose.Promise = global.Promise;
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"))
app.use(methodOverride("_method"));
app.use(flash()); // must come before the passport config
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

// This is the middleware that works for all local files and it uses the user data
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

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