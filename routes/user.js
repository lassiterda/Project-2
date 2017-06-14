var db = require('./../db/models');
const ResponeObj = require('./api-response-constructor.js');


module.exports = function(app) {

    app.get("/api/user/:id?", function(req, res) {

      let query = { where: { id: req.params.id || req.user.id },
          include: [ {model: db.Trip, through: {},
            include: { model: db.Location, through: {} }
          } ],
        }

      db.User.findAll(query)
        .then(dbUser => {
          delete dbUser.password;
          delete dbUser.userType;
          res.json(new ResponeObj(dbUser, " Success, see data for User information."))
        })
        .catch(err => {res.json(new ResponeObj(null, "Something went wrong, see error message for details.", err) ) })

    });

    app.post("/api/user/update/:id", function(req, res){
        res.json(req.params.id);
    });

    app.delete("/api/user/delete/:id", function(req,res){
        res.json(req.params.id);
    });



};
