var express = require('express');
const bodyParser = require("body-parser");
var User = require("../models/user");

const passport = require('passport')

const authenticate = require('../authenticate')

var router = express.Router();
router.use(bodyParser.json())

router.get("/", function(req, res) {
  res.redirect("/users/signup");
});
router.get("/users/signup", function(req, res) {
  res.render("signup");
});

router.post('/users/signup', (req, res, next) => {
  User.register(new User({username: req.body.username}), 
    req.body.password, (err, user) => {
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    }
    else {
      if (req.body.firstName)
        user.firstName = req.body.firstName;
      if (req.body.lastName)
        user.lastName = req.body.lastName;
      user.save((err, user) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err: err});
          return ;
        }
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true, status: 'Registration Successful!'});
        });
      });
    }
  });
  res.redirect("/users/login")
});

router.get("/users/login", function(req, res) {
  res.render("login");
});

router.post("/users/login", passport.authenticate('local'), (req, res) => {
      var token = authenticate.getToken({ _id: req.user._id })
      res.cookie('access_token', token)
      res.statusCode = 200;
      // res.setHeader("Content-Type", "application/json");
      // res.json({success: true, token: token, status:"You are succesfully logged in"})
      res.redirect("/listThreads")
});

router.get("/users/logout", (req, res)=>{
  if (req.cookies) {
    res.clearCookie('access_token', { path: '/', domain: 'localhost' })
    res.redirect('/users/login')
  }
  else {
      var err = new Error('You are not logged in!')
      err.status = 403
      return next(err)
  }
});

module.exports = router;