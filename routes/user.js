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
          delete dbUser[0].dataValues.password;
          delete dbUser[0].dataValues.userType;

            //sorting each trip's locations by TripLocation.sequenceNumber
            dbUser[0].Trips
              .map((trip) => { return trip.Locations
                .sort((locA, locB) =>
                  { return locA.TripLocation.sequenceNumber - locB.TripLocation.sequenceNumber })
              })

          res.json(new ResponeObj(dbUser, " Success, see data for User information."))
        })
        .catch(err => {res.json(new ResponeObj(null, "Something went wrong, see error message for details.", err) ) })

    });

    app.post("/api/user/update/:id?", function(req, res){

      db.User.update(req.body, { where: { id: req.params.id || req.user.id } })
        .then((dbUserId) => { res.json(new ResponeObj(dbUser, "Success, User Updated.")) })
        .catch(err => {res.json(new ResponeObj(null, "Something went wrong, see error message for details.", err) ) })
    });

    app.post("/api/user/delete/:id", function(req,res){
      db.User.update(req.body, { where: { id: req.params.id } })
        .then((dbUserId) => { res.json(new ResponeObj(dbUserId, "Success, User Deleted.")) })
        .catch(err => {res.json(new ResponeObj(null, "Something went wrong, see error message for details.", err) ) })
    });



};
