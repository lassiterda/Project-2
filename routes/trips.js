
const db = require('./../db/models');
//module.exports = (app) => {

//}

const router = require("express").Router();
//just one trip
    router.get("/:id", function(req,res){
        res.send(req.params.id);
    })

    router.get("/", function(req,res){
        res.send("hi")
    });



    router.post("/:id", function(req,res){
        res.send(req.params.id)
    });

    router.post("/", function(req,res){
        res.send("hi")
    });

module.exports = router
