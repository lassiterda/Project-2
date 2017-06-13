const rp = require('request-promise');
const db = require('./../db/models');
const ResponeObj = require('./api-response-constructor.js');


module.exports = function(app) {

  //get one or all trips, including location information for each route.
  app.get("/api/trip/:id?", function(req,res){

    let query = req.params.id ?
      {where: { id : req.params.id }, include: [ {model: db.Location,   through: {} } ] } :
      {include: [ {model: db.Location, through: {} } ] };


      db.Trip.findAll(query)
        .then((dbLocation) => { res.json(new ResponeObj(dbLocation, "Success, see data for Trip informaiton.")) })
        .catch(err => {res.json(new ResponeObj(null, "Something went wrong, see error message for details.", err) ) })
  })


  app.post("/api/trip/create", function(req,res) {

    //create the trip based ont the req.body
    db.Trip.create(req.body)
      .then(dbTrip => {

      //format the locations array to pass into the db as TripLocations
      let tripLocArr = req.body.locations.map((ele, idx) => {
        return { sequenceNumber: idx + 1, LocationId: ele, TripId: dbTrip.dataValues.id}
      });

      //create the TripLocation objects for the trip
      db.TripLocation.bulkCreate(tripLocArr)
        .then((dbTripLocations) => { res.json(new ResponeObj(dbTrip, "Success, Trip created.")) })
        .catch(err => {res.json(new ResponeObj(null, "Something went wrong, see error message for details.", err) ) })
    })
    .catch(err => {res.json(new ResponeObj(null, "Something went wrong, see error message for details.", err) ) })
  });


  app.post("/api/trip/delete/:id", function(req, res){

    db.Trip.destroy( { where: { id: req.params.id } })
      .then(dbTripId => { res.json(new ResponeObj(dbTripId, "Success, Trip deleted.")) })
      .catch(err => {res.json(new ResponeObj(null, "Something went wrong, see error message for details.", err) ) })
  });

}
