
var db = require('./../db/models');

module.exports = function(app) {

    app.get("/api/user/:id", function(req,res) {
        res.json(req.params.id);
    });

    app.get("/api/user/", function(req,res){
        res.json("hi");
    });

    app.post("/api/user/profile", function(req,res){
        res.render('profile');

    });

    app.post("/api/user/:id", function(req.res){
        res.json(req.params.id);
    });
    
    app.delete("/api/user/:id", function(req,res){
        res.json(req.params.id);
    });   



};

