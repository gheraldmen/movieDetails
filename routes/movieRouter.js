const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const authenticate = require('../authenticate')
var ObjectId = require('mongodb').ObjectId; 
var multer = require('multer');

var upload = multer();

const movieRouter = express.Router();

movieRouter.use(bodyParser.json());


movieRouter.get("/movieList", (req, res, next)=>{
  const resPerPage = 10; // results per page
  const page = req.query.page || 1 // Page 
  mongoose.connection.db
  .collection("movieDetails")
  .find({},  { projection: { _id: 0, title:1, actors: 1, poster: 1, plot: 1 }})
  .skip((resPerPage * page) - resPerPage)
  .limit(resPerPage)
  .toArray()
  .then((movies) => {
    movies.forEach((arrayItem)=>{
    if(arrayItem.poster !=null){
      var poster = arrayItem.poster
      var posterLink = poster.split("/")
      var image = ("https://" + posterLink[2] + '/' + posterLink[3]+ '/' + posterLink[4] + '/' + posterLink[5])
      arrayItem.poster = image
    }})
    res.json(movies);
  }, (err) => next(err))
.catch((err) => next(err)); 
});

movieRouter.get("/movie/:_id", (req, res, next)=>{
  mongoose.connection.db
  .collection("movieDetails")
  .findOne({_id: ObjectId(req.params._id)})
  .then((movies) => {
    if(movies.poster !=null){
      var poster = movies.poster
      var posterLink = poster.split("/")
      var image = ("https://" + posterLink[2] + '/' + posterLink[3]+ '/' + posterLink[4] + '/' + posterLink[5])
     movies.poster = image;
    }
    res.json(movies);
}, (err) => next(err))
.catch((err) => next(err)); 
});

movieRouter.get("/title", (req, res, next)=>{
  const resPerPage = 1; // results per page
  const page = req.query.page || 1 // Page 
    mongoose.connection.db
    .collection("movieDetails")
    .find(({title: new RegExp(req.query.title.toLowerCase(),'ig')}))
    .skip((resPerPage * page) - resPerPage)
    .limit(resPerPage)
    .toArray()
    .then((movies) => {
      movies.forEach((arrayItem)=>{
        if(arrayItem.poster !=null){
          var poster = arrayItem.poster
          var posterLink = poster.split("/")
          var image = ("https://" + posterLink[2] + '/' + posterLink[3]+ '/' + posterLink[4] + '/' + posterLink[5])
         arrayItem.poster = image;
      }})
        res.json(movies);
    }, (err) => next(err))
    .catch((err) => next(err)); 
});


movieRouter.get("/movie/:_id/countries", (req, res, next)=>{
mongoose.connection.db
    .collection("movieDetails")
    .findOne({_id: ObjectId(req.params._id)},{ projection: { _id: 0, countries:1 }})
    .then((movies) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(movies);
      }, (err) => next(err))
      .catch((err) => next(err)); 
});

movieRouter.get("/movie/:_id/writers", (req, res, next)=>{
mongoose.connection.db
.collection("movieDetails")
.findOne({_id: ObjectId(req.params._id)},{ projection: { _id: 0, writers:1 }})
.then((movies) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json(movies);
}, (err) => next(err))
.catch((err) => next(err)); 
});


 movieRouter.get("/writers", (req, res, next)=>{
  const resPerPage = 1; // results per page
  const page = req.query.page || 1 // Page 
  mongoose.connection.db               
  .collection("movieDetails")
  .find(({writers: new RegExp(req.query.writer.toLowerCase(),'ig')}), {projection: {_id:0, title:1, poster:1, actors:1, plot:1}})
  .skip((resPerPage * page) - resPerPage)
  .limit(resPerPage)
  .toArray()
  .then((movies) => {
    movies.forEach((arrayItem)=>{
      if(arrayItem.poster !=null){
        var poster = arrayItem.poster
        var posterLink = poster.split("/")
        var image = ("https://" + posterLink[2] + '/' + posterLink[3]+ '/' + posterLink[4] + '/' + posterLink[5])
       arrayItem.poster = image;
    }})
      res.json(movies);
  }, (err) => next(err))
  .catch((err) => next(err)); 
});


movieRouter.get("/searchBy", (req, res, next)=>{
  const resPerPage = 1; // results per page
  const page = req.query.page || 1 // Page 
 if(req.query.all && req.query.page){
    mongoose.connection.db
    .collection("movieDetails")
    .find({$or: [{actors: new RegExp(req.query.all.toLowerCase(), 'ig')}, 
                  {title: new RegExp(req.query.all.toLowerCase(), 'ig')},
                 {plot: new RegExp(req.query.all.toLowerCase(), 'ig')}]}, { projection: { _id: 0, title:1, actors:1, plot:1, poster:1 }})
    .skip((resPerPage * page) - resPerPage)
    .limit(resPerPage)
    .toArray()
    .then((movies) => {
          movies.forEach((arrayItem)=>{
              if(arrayItem.poster !=null){
                  var poster = arrayItem.poster
                  var posterLink = poster.split("/")
                  var image = ("https://" + posterLink[2] + '/' + posterLink[3]+ '/' + posterLink[4] + '/' + posterLink[5])
                      arrayItem.poster = image;
              }})
                res.json(movies);
          }, (err) => next(err))
  }
               
   else if(req.query.actor && req.query.page){
    mongoose.connection.db
      .collection("movieDetails")
      .find({actors: new RegExp(req.query.actor.toLowerCase(), 'ig')}, { projection: { _id: 0, title:1, actors:1, plot:1, poster:1 }})
      .skip((resPerPage * page) - resPerPage)
      .limit(resPerPage)
      .toArray()
      .then((movies) => {
            movies.forEach((arrayItem)=>{
                if(arrayItem.poster !=null){
                    var poster = arrayItem.poster
                    var posterLink = poster.split("/")
                    var image = ("https://" + posterLink[2] + '/' + posterLink[3]+ '/' + posterLink[4] + '/' + posterLink[5])
                        arrayItem.poster = image;
                }})
                  res.json(movies);
            }, (err) => next(err))
    }
    else if(req.query.plot && req.query.page){
      mongoose.connection.db
      .collection("movieDetails")
      .find({plot: new RegExp(req.query.plot.toLowerCase(), 'ig')}, { projection: { _id: 0, title:1, actors:1, plot:1, poster:1 }})
      .skip((resPerPage * page) - resPerPage)
      .limit(resPerPage)
      .toArray()
      .then((movies) => {
            movies.forEach((arrayItem)=>{
                if(arrayItem.poster !=null){
                    var poster = arrayItem.poster
                    var posterLink = poster.split("/")
                    var image = ("https://" + posterLink[2] + '/' + posterLink[3]+ '/' + posterLink[4] + '/' + posterLink[5])
                        arrayItem.poster = image;
                }})
                  res.json(movies);
            }, (err) => next(err))
    }
  else if(req.query.title && req.query.page){
    mongoose.connection.db
    .collection("movieDetails")
    .find(({title: new RegExp(req.query.title.toLowerCase(),'ig')}), { projection: { _id: 0, title:1, actors:1, plot:1, poster:1 }})
    .skip((resPerPage * page) - resPerPage)
    .limit(resPerPage)
    .toArray()
    .then((movies) => {
          movies.forEach((arrayItem)=>{
              if(arrayItem.poster !=null){
                  var poster = arrayItem.poster
                  var posterLink = poster.split("/")
                  var image = ("https://" + posterLink[2] + '/' + posterLink[3]+ '/' + posterLink[4] + '/' + posterLink[5])
                      arrayItem.poster = image;
              }})
                res.json(movies);
          }, (err) => next(err))
 }else{
  err = new Error(' not found');
  err.status = 404;
}
});

movieRouter.get("/genre", (req, res, next)=>{
  const resPerPage = 2; // results per page
  const page = req.query.page || 1 // Page 
  mongoose.connection.db               
  .collection("movieDetails")
  .find(({genres: new RegExp(req.query.genre.toLowerCase(),'ig')}), {projection: {_id:0, title:1, genres:1, poster:1, actors:1, plot:1}})
  .skip((resPerPage * page) - resPerPage)
  .limit(resPerPage)
  .toArray()
  .then((movies) => {
    movies.forEach((arrayItem)=>{
      if(arrayItem.poster !=null){
        var poster = arrayItem.poster
        var posterLink = poster.split("/")
        var image = ("https://" + posterLink[2] + '/' + posterLink[3]+ '/' + posterLink[4] + '/' + posterLink[5])
       arrayItem.poster = image;
    }})
      res.json(movies);
  }, (err) => next(err))
  .catch((err) => next(err)); 
});

movieRouter.post('/update/:_id', upload.none(), (req,res,next) => {
  mongoose.connection.db
  .collection("movieDetails")
  .findOneAndUpdate({_id : ObjectId(req.params._id)}, { 
      $addToSet: req.body
  },{new: true},(err)=>{
    if(err){
      res.status(404)
      res.send({
        status: "Unsuccessful"
      })
      return
    }else{
      res.status(200)
      res.send({
          status: "Successful"
        })
        return
    }
    })
});


movieRouter.delete("/delete/:_id", (req, res, next)=>{
  mongoose.connection.db
  .collection("movieDetails")
  .findOneAndDelete({_id: ObjectId(req.params._id)},(err)=>{
    if(err){
      res.status(404)
      res.send({
        status: "Unsuccessful"
      })
      return
    }else{
      res.status(200)
      res.send({
          status: "Successful"
        })
        return
    }
    })
});





  module.exports = movieRouter;