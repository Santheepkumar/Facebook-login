var express = require("express");
var passport = require("passport");
var Strategy = require("passport-facebook").Strategy;
const ejs = require("ejs");

passport.use(
  new Strategy({
      clientID: "396873257478489",
      clientSecret: "3cc21f71ed30bea74dc8f049a662cd87",
      callbackURL: "http://localhost:3000/login/facebook/return"
    },
    (accessToken, refreshToken, profile, cb) => {
      return cb(null, profile);
    }
  )
);

passport.serializeUser((user, cb) => {
  cb(null, user);
});
passport.serializeUser((obj, cb) => {
  cb(null, obj);
});

//create express app

var app = express();

// set view engine

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.use(require("morgan")("combined"));
app.use(require("cookie-parser")());
app.use(
  require("body-parser").urlencoded({
    extended: true
  })
);
app.use(
  require("express-session")({
    secret: "My app",
    resave: true,
    saveUninitialized: true
  })
);

//@route   -   GET  /home
//@desc    - route to home page
//@access  - PUBLIC

app.get("/", (req, res) => {
  res.render("home", {
    user: req.user
  });
});

//@route   -   GET  /home/login
//@desc    - route to home page
//@access  - PUBLIC

app.get("/login", (req, res) => {
  res.render("login");
});

//@route   -   GET  /home/login/facebook
//@desc    - route to facebook auth
//@access  - PUBLIC

app.get("/login/facebook", passport.authenticate("facebook"));

//@route   -   GET  /home/login/facebook/callback
//@desc    - route to facebook route
//@access  - PUBLIC

app.get(
  "/login/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/login"
  }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

//@route   -   GET  /Profile
//@desc    - route to profile of user
//@access  - PRIVATE

app.get(
  "/profile",
  require("connect-ensure-login").ensureLoggedIn(),
  (req, res) => {
    res.render("profile", {
      user: req.user
    });
  }
);

app.listen('3000');