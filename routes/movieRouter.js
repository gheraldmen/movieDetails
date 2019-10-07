const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const authenticate = require('../authenticate')
var ObjectId = require('mongodb').ObjectId; 


const movieRouter = express.Router();

movieRouter.use(bodyParser.json());

movieRouter.get("/movieList", (req, res, next)=>{
  const resPerPage = 10; // results per page
  const page = req.query.page || 1; // Page 
  mongoose.connection.db
  .collection("movieDetails")
  .find({}).skip((resPerPage * page) - resPerPage)
  .limit(resPerPage)
  .toArray()
  .then((movies) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(movies);
}, (err) => next(err))
.catch((err) => next(err)); 
});

movieRouter.get("/movie/:_id", (req, res, next)=>{
  mongoose.connection.db
  .collection("movieDetails")
  .findOne({_id: ObjectId(req.params._id)})
  .then((movies) => {
    var poster = movies.poster
    var posterLink = poster.split("/")
    var image = ("https://" + posterLink[2] + '/' + posterLink[3]+ '/' + posterLink[4] + '/' + posterLink[5])
    var image = image
    var movieDetails = {
       title: movies.title,
       plot: movies.plot,
       poster: image
    }
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(movieDetails);
}, (err) => next(err))
.catch((err) => next(err)); 
});



movieRouter.get("/title", (req, res, next)=>{
  mongoose.connection.db
  .collection("movieDetails")
  .find({title: new RegExp(req.query.title.toLowerCase(), 'ig')})
  .toArray()
  .then((movies) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(movies);
}, (err) => next(err))
.catch((err) => next(err)); 
});


movieRouter.get("/movie/:_id/countries", (req, res, next)=>{
mongoose.connection.db
    .collection("movieDetails")
    .findOne({_id: ObjectId(req.params._id)})
    .then((movies) => {
         var movieDetails = {
     countries: movies.countries
     }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(movieDetails);
      }, (err) => next(err))
      .catch((err) => next(err)); 
});

movieRouter.get("/movie/:_id/writers", (req, res, next)=>{
mongoose.connection.db
.collection("movieDetails")
.findOne({_id: ObjectId(req.params._id)})
.then((movies) => {
  var movieDetails = {
     writers: movies.writers
  }
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json(movieDetails);
}, (err) => next(err))
.catch((err) => next(err)); 
});


 movieRouter.get("/writers", (req, res, next)=>{
  mongoose.connection.db
  .collection("movieDetails")
  .find({writers: new RegExp('^' +req.query.name.toLowerCase(), 'ig')}, {projection: {title: 1, _id:0 }})
  .toArray()
  .then((movies) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(movies);
}, (err) => next(err))
.catch((err) => next(err)); 
});


movieRouter.get("/searchBy", (req, res, next)=>{
 if(req.query.title && req.query.actor && req.query.plot){
    mongoose.connection.db
    .collection("movieDetails")
    .find(({actors: new RegExp(req.query.actor.toLowerCase()), title: new RegExp(req.query.title.toLowerCase()), plot: new RegExp(req.query.plot.toLowerCase(), 'ig')}),{projection: {title: 1, _id:0, actors:1, plot:1 }})
    .toArray()
    .then((movies) => {
      console.log("all 3 parts")
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(movies);
  }, (err) => next(err));
 }
    else if((req.query.actor)){
      mongoose.connection.db
      .collection("movieDetails")
      .find({actors: new RegExp(req.query.actor.toLowerCase(), 'ig')})
      .toArray()
      .then((movies) => {
        console.log("actor part")
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(movies);
    }, (err) => next(err));
  }
    else if(req.query.plot){
    mongoose.connection.db
      .collection("movieDetails")
      .find({plot: new RegExp(req.query.plot.toLowerCase(), 'ig')})
      .toArray()
      .then((movies) => {
        console.log("plot part")
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(movies);
    }, (err) => next(err));
  }
  else if(req.query.title){
    mongoose.connection.db
    .collection("movieDetails")
    .find({title: new RegExp(req.query.title.toLowerCase(), 'ig')})
    .toArray()
    .then((movies) => {
      console.log("title part")
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(movies);
  }, (err) => next(err));
}
  else {
    err = new Error(' not found');
    err.status = 404;
  }
});



movieRouter.post("/update/:_id" , (req, res, next) => {
  mongoose.connection.db
  .collection("movieDetails")
  .findOne({_id: ObjectId(req.params._id)})
   .then((movies) => {
       if(movies!= null) {
          movies.actors.push(req.body);
          // movies.markModified(movies.actors)
          movies.save()
           .then((movies) => {
            mongoose.connection.db
              .collection("movieDetails")
              .findOne({_id: ObjectId(movies._id)})
               .then((movies) => {
                   res.statusCode = 200;
                   res.setHeader('Content-Type', 'application/json');
                   res.json(movies);
               })            
           }, (err) => next(err));
       }
       else {
           err = new Error('Thread ' + req.params._id + ' not found');
           err.status = 404;
           return next(err);
       }
   }, (err) => next(err))
   .catch((err) => next(err));
});


movieRouter.delete("/delete/:_id", (req, res, next)=>{
  mongoose.connection.db
  .collection("movieDetails")
  .findOneAndDelete({_id: ObjectId(req.params._id)})
  // .toArray()
  .then((movies) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(movies);
  }, (err) => next(err))
  .catch((err) => next(err)); 
  });



  module.exports = movieRouter;