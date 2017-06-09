
const db = require('./../db/models');
//module.exports = (app) => {

//}

const router = require("express").Router();
//returns one location
     router.get("/:id", function(req,res){
        res.send(req.params.id);
    })
//returns all locations
    router.get("/", function(req,res){
        res.send("hi")
    });
//update location with given id
    router.post("/:id", function(req,res){
        res.send(req.params.id)
    });
//creates new location
    router.post("/", function(req,res){
        res.send("hi")
    });

module.exports = router
