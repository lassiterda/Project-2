const express = require('express')
const router = express.Router()
const rp = require('request-promise')
const db = require('../../db/models')

const ResponeObj = require('./api-response-constructor.js')

const checkAuthenticated = function(req, res, next){
	if(req.isAuthenticated()){
		return next()
	}
  else {
    res.redirect('/login')
	}
}


//  GET one or all trips, including location information for each route.
router.get("/:id?", checkAuthenticated, function(req,res){

  let query = req.params.id 
    ? {where: { id : req.params.id }, include: [ {model: db.Location,   through: {} } ] } 
    : {include: [ {model: db.Location, through: {} } ] }


  db.Trip.findAll(query)
  .then((dbLocation) => { 
    res.json(new ResponeObj(dbLocation, "Success, see data for Trip informaiton.")) 
  })
  .catch(err => { 
    res.json(new ResponeObj(null, "Something went wrong, see error message for details.", err) ) 
  })
})

//  CREATE a new Trip 
router.post("/create", checkAuthenticated, function(req,res) {

  db.Trip.create(req.body)
  .then(dbTrip => {
    db.UserTrip.create({ UserId: req.user.id, TripId: dbTrip.id })
  .then((dbUserTrip) => {

//    format the locations array to pass into the db as TripLocations
    let tripLocArr = req.body.locations.map((ele, idx) => {
      return { sequenceNumber: idx + 1, LocationId: ele, TripId: dbTrip.dataValues.id}
    })

//  create the TripLocation objects for the trip
    return db.TripLocation.bulkCreate(tripLocArr)
  })
  .then((dbTripLocations) => { 
    res.json(new ResponeObj(dbTrip, "Success, Trip created.")) 
  })
  .catch(err => {
    res.json(new ResponeObj(null, "Something went wrong, see error message for details.", err) ) 
  })

  })
  .catch(err => {res.json(new ResponeObj(null, "Something went wrong, see error message for details.", err) ) })
})

//  DELETE a trip
router.post("/delete/:id", checkAuthenticated, function(req, res){

  db.Trip.destroy( { where: { id: req.params.id } })
  .then(dbTripId => { 
    res.json(new ResponeObj(dbTripId, "Success, Trip deleted.")) 
  })
  .catch(err => {
    res.json(new ResponeObj(null, "Something went wrong, see error message for details.", err) ) 
  })
})

module.exports = router