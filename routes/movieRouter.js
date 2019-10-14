const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const authenticate = require('../authenticate')
var ObjectId = require('mongodb').ObjectId; 
var multer = require('multer');
const cors = require('./cors');

var upload = multer();

const movieRouter = express.Router();

movieRouter.use(bodyParser.json());

// Display All Movies
movieRouter.get("/movieList", (req, res)=>{
  const resPerPage = 10; // results per page
  const page = parseInt(req.query.page) || 1 // Page 
  mongoose.connection.db
  .collection("movieDetails")
  .find({},  { projection: { _id: 1, title:1, actors: 1, imdb:1, poster: 1, plot: 1 }})
  // .sort({"imdb.rating":-1})
  .skip((resPerPage * page) - resPerPage)
  .limit(resPerPage)
  .toArray()
  .then(movies => {
    movies.forEach((arrayItem)=>{
      if(arrayItem.poster !=null){
        var poster = arrayItem.poster
        var posterLink = poster.split("/")
        var image = ("https://" + posterLink[2] + '/' + posterLink[3]+ '/' + posterLink[4] + '/' + posterLink[5])
        arrayItem.poster = image
      }})
    if (movies.length === 0){
        res.json("No more results ");
     } else{
       mongoose.connection.db
       .collection("movieDetails")
       .find({})
       .count({})
            .then(numberOfResult => {
                var pages = Math.ceil(numberOfResult/resPerPage)
                res.json({currentPage: page, results: numberOfResult, totalPage: pages, movies: movies});
            })
  }}, (err) => next(err))
    .catch((err) => next(err)); 
  });

movieRouter.get("/movie/:_id",  (req, res, next)=>{
  mongoose.connection.db
  .collection("movieDetails")
  .findOne({_id: new ObjectId(req.params._id)},{projection: {_id:0, title:1, poster:1, actors:1, plot:1}}) 
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

movieRouter.get("/title", cors.cors, authenticate.jwtCheck,(req, res, next)=>{
  const resPerPage = 10; // results per page
  const page = parseInt(req.query.page) || 1 // Page 
    mongoose.connection.db
    .collection("movieDetails")
    .find(({title: new RegExp(req.query.title,'ig')}))
    .skip((resPerPage * page) - resPerPage)
    .limit(resPerPage)
    .toArray()
    .then(movies => {
      movies.forEach((arrayItem)=>{
        if(arrayItem.poster !=null){
          var poster = arrayItem.poster
          var posterLink = poster.split("/")
          var image = ("https://" + posterLink[2] + '/' + posterLink[3]+ '/' + posterLink[4] + '/' + posterLink[5])
          arrayItem.poster = image
        }})
      if (movies.length === 0){
          res.json("No more results ");
       } else{
         mongoose.connection.db
         .collection("movieDetails")
         .find(({title: new RegExp(req.query.title,'ig')}))
         .count({})
              .then(numberOfResult => {
                  var pages = Math.ceil(numberOfResult/resPerPage)
                  res.json({currentPage: page, result: numberOfResult, totalPage: pages, movies: movies});
              });
    }}, (err) => next(err))
      .catch((err) => next(err)); 
});
  

movieRouter.get("/movie/:_id/countries", cors.cors, authenticate.jwtCheck,  (req, res, next)=>{
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

movieRouter.get("/movie/:_id/writers",cors.cors, authenticate.jwtCheck, (req, res, next)=>{
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


 movieRouter.get("/writers", cors.cors, authenticate.jwtCheck, (req, res, next)=>{
  const resPerPage = 10; // results per page
  const page = parseInt(req.query.page )|| 1 // Page 
  mongoose.connection.db               
  .collection("movieDetails")
  .find(({writers: new RegExp(req.query.writer,'ig')}), {projection: {_id:0, title:1, poster:1, actors:1, plot:1}})
  .skip((resPerPage * page) - resPerPage)
  .limit(resPerPage)
  .toArray()
  .then(movies => {
    movies.forEach((arrayItem)=>{
      if(arrayItem.poster !=null){
        var poster = arrayItem.poster
        var posterLink = poster.split("/")
        var image = ("https://" + posterLink[2] + '/' + posterLink[3]+ '/' + posterLink[4] + '/' + posterLink[5])
        arrayItem.poster = image
      }})
    if (movies.length === 0){
        res.json("No more results ");
     } else{
       mongoose.connection.db
       .collection("movieDetails")
       .find(({writers: new RegExp(req.query.writer,'ig')}), {projection: {_id:0, title:1, poster:1, actors:1, plot:1}})
       .count({})
            .then(numberOfResult => {
                var pages = Math.ceil(numberOfResult/resPerPage)
                res.json({currentPage: page, result: numberOfResult, totalPage: pages, movies: movies});
            });
  }}, (err) => next(err))
    .catch((err) => next(err)); 
});

movieRouter.get("/searchBy", cors.cors,  (req, res, next)=>{
  const resPerPage = 10; // results per page
  const page = parseInt(req.query.page) || 1 // Page 
 if(req.query.all){
    mongoose.connection.db
    .collection("movieDetails")
    .find({$or: [{actors: new RegExp(req.query.all, 'ig')}, 
                  {title: new RegExp(req.query.all, 'ig')},
                 {plot: new RegExp(req.query.all,'ig')}]}, { projection: { _id: 0, title:1, actors:1, plot:1, poster:1 }})
    .skip((resPerPage * page) - resPerPage)
    .limit(resPerPage)
    .toArray()
    .then(movies => {
      movies.forEach((arrayItem)=>{
        if(arrayItem.poster !=null){
          var poster = arrayItem.poster
          var posterLink = poster.split("/")
          var image = ("https://" + posterLink[2] + '/' + posterLink[3]+ '/' + posterLink[4] + '/' + posterLink[5])
          arrayItem.poster = image
        }})
      if (movies.length === 0){
          res.json("No more results ");
       } else{
         mongoose.connection.db
         .collection("movieDetails")
         .find({$or: [{actors: new RegExp(req.query.all, 'ig')}, 
                      {title: new RegExp(req.query.all, 'ig')},
                      {plot: new RegExp(req.query.all, 'ig')}]}, { projection: { _id: 0, title:1, actors:1, plot:1, poster:1 }})
          .count({})
              .then(numberOfResult => {
                  var pages = Math.ceil(numberOfResult/resPerPage)
                  res.json({currentPage: page, result: numberOfResult, totalPage: pages, movies: movies});
              });
    }}, (err) => next(err))
  }
               
   else if(req.query.actor){
    mongoose.connection.db
      .collection("movieDetails")
      .find({actors: new RegExp(req.query.actor, 'ig')}, { projection: { _id: 0, title:1, actors:1, plot:1, poster:1 }})
      .skip((resPerPage * page) - resPerPage)
      .limit(resPerPage)
      .toArray()
      .then(movies => {
        movies.forEach((arrayItem)=>{
          if(arrayItem.poster !=null){
            var poster = arrayItem.poster
            var posterLink = poster.split("/")
            var image = ("https://" + posterLink[2] + '/' + posterLink[3]+ '/' + posterLink[4] + '/' + posterLink[5])
            arrayItem.poster = image
          }})
        if (movies.length === 0){
            res.json("No more results ");
         } else{
           mongoose.connection.db
           .collection("movieDetails")
           .find({actors: new RegExp(req.query.actor, 'ig')}, { projection: { _id: 0, title:1, actors:1, plot:1, poster:1 }})
           .count({})
                .then(numberOfResult => {
                    var pages = Math.ceil(numberOfResult/resPerPage)
                    res.json({currentPage: page, result: numberOfResult, totalPage: pages, movies: movies});
                });
      }}, (err) => next(err))
    }
    else if(req.query.plot){
      mongoose.connection.db
      .collection("movieDetails")
      .find({plot: new RegExp(req.query.plot,'ig')}, { projection: { _id: 0, title:1, actors:1, plot:1, poster:1 }})
      .skip((resPerPage * page) - resPerPage)
      .limit(resPerPage)
      .toArray()
      .then(movies => {
        movies.forEach((arrayItem)=>{
          if(arrayItem.poster !=null){
            var poster = arrayItem.poster
            var posterLink = poster.split("/")
            var image = ("https://" + posterLink[2] + '/' + posterLink[3]+ '/' + posterLink[4] + '/' + posterLink[5])
            arrayItem.poster = image
          }})
        if (movies.length === 0){
            res.json("No more results ");
         } else{
           mongoose.connection.db
           .collection("movieDetails")
           .find({plot: new RegExp(req.query.plot, 'ig')}, { projection: { _id: 0, title:1, actors:1, plot:1, poster:1 }})
           .count({})
                .then(numberOfResult => {
                    var pages = Math.ceil(numberOfResult/resPerPage)
                    res.json({currentPage: page, result: numberOfResult, totalPage: pages, movies: movies});
                });
      }}, (err) => next(err))
    }
    else if(req.query.title){
    mongoose.connection.db
    .collection("movieDetails")
    .find(({title: new RegExp(req.query.title,'ig')}), { projection: { _id: 0, title:1, actors:1, plot:1, poster:1 }})
    .skip((resPerPage * page) - resPerPage)
    .limit(resPerPage)
    .toArray()
    .then(movies => {
      movies.forEach((arrayItem)=>{
        if(arrayItem.poster !=null){
          var poster = arrayItem.poster
          var posterLink = poster.split("/")
          var image = ("https://" + posterLink[2] + '/' + posterLink[3]+ '/' + posterLink[4] + '/' + posterLink[5])
          arrayItem.poster = image
        }})
      if (movies.length === 0){
          res.json("No more results ");
       } else{
         mongoose.connection.db
         .collection("movieDetails")
         .find(({title: new RegExp(req.query.title,'ig')}), { projection: { _id: 0, title:1, actors:1, plot:1, poster:1 }})
         .count({})
              .then(numberOfResult => {
                  var pages = Math.ceil(numberOfResult/resPerPage)
                  res.json({currentPage: page, result: numberOfResult, totalPage: pages, movies: movies});
              });
    }}, (err) => next(err))
      .catch((err) => next(err)); 
  }
});


movieRouter.get("/genre", authenticate.jwtCheck, (req, res, next)=>{
  const resPerPage = 10; // results per page
  const page = parseInt(req.query.page) || 1 // Page 
  mongoose.connection.db               
  .collection("movieDetails")
  .find(({genres: new RegExp(req.query.genre,'ig')}), {projection: {_id:0, title:1, imdb:1, genres:1, poster:1, actors:1, plot:1}})
  .sort({"imdb.rating":-1})
  .skip((resPerPage * page) - resPerPage)
  .limit(resPerPage)
  .toArray()
  .then(movies => {
    movies.forEach((arrayItem)=>{
      if(arrayItem.poster !=null){
        var poster = arrayItem.poster
        var posterLink = poster.split("/")
        var image = ("https://" + posterLink[2] + '/' + posterLink[3]+ '/' + posterLink[4] + '/' + posterLink[5])
        arrayItem.poster = image
      }})
    if (movies.length === 0){
        res.json("No more results ");
     } else{
       mongoose.connection.db
       .collection("movieDetails")
       .find(({genres: new RegExp(req.query.genre,'ig')}), {projection: {_id:0, title:1, imdb:1, genres:1, poster:1, actors:1, plot:1}})
       .count({})
            .then(numberOfResult => {
                var pages = Math.ceil(numberOfResult/resPerPage)
                res.json({currentPage: page, result: numberOfResult, totalPage: pages, movies: movies});
            });
  }}, (err) => next(err))
    .catch((err) => next(err)); 
});


movieRouter.post('/update/:_id', cors.cors,  upload.none(), (req,res,next) => {
  if(req.body.actors){

  mongoose.connection.db
  .collection("movieDetails")
  .findOne({_id : ObjectId(req.params._id)})
  .then((movies)=>{
    var actors1 = movies.actors
        // console.log(actors1)
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
      }
      else if(actors1.indexOf(req.body.actors) === 1) {
        res.send({status: "Already Exist"})
        console.log(actors1)
      }
      else{
        res.status(200)
        res.send({
            status: "Successful"
          })
          return
      }
      })
  })
}else{
    mongoose.connection.db
  .collection("movieDetails")
  .findOneAndUpdate({_id : ObjectId(req.params._id)}, { 
    $set: req.body
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
  }
});


movieRouter.delete("/delete/:_id", cors.cors, authenticate.jwtCheck,  (req, res, next)=>{
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