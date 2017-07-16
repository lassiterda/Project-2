const express = require('express')
const router = express.Router()
const rp = require('request-promise')
const db = require('../../db/models')

const ResponeObj = require('./api-response-constructor.js')

//  get one location or all locations (sorted by numlikes)
router.get("/:id?", function(req, res){

//  build query depending on whether an id is provided
  let query = req.params.id 
    ? { where: { id : req.params.id } } 
    : { order: [["numlikes", "DESC"]] }
  
//  find location(s) in db
  db.Location.findAll(query)
    .then(dbLocation => { 
      res.json( new ResponeObj(dbLocation, "Success, see data for location info") ) 
    })
    .catch(err => {
      res.json(new ResponeObj(null, "Something went wrong, see error message for details.", err) ) 
    })
})

//  update location with given id
router.post("/update/:id", function(req, res) {

  db.Location.findOne({ where: { id: req.params.id } })
  .then((dbLocation) => {

//  Google geocaching API
    return rp.get({
      uri: "http://maps.googleapis.com/maps/api/geocode/json?address=" + encodeURIComponent( req.body.address || dbLocation.address + " " + body.location || dbLocation.city  + ", " + body.state || dbLocation.state)
    })
  })
  .then( resp => {

      let APIresponse = JSON.parse(resp)

  //  adding lat, lng to the request object to pass into db.
      req.body.lat = APIresponse.results[0].geometry.location.lat
      req.body.lng = APIresponse.results[0].geometry.location.lng
      req.body.Google_place_id = APIresponse.results[0].place_id

      return db.Location.update(req.body, { where: { id: req.params.id } })
    })
    .then(dbLocationId => { 

//    Secondary find to fetch the whole Location Object (.update() does not return...) 
      return db.Location.findOne({ where: { id: req.params.id } }) 
    })
    .then(dbLocation => { 
      res.json(new ResponeObj(dbLocation.dataValues, "Success, Location update complete.")) 
    })
    .catch(err => { 
      res.json(new ResponeObj(null, "Something went wrong, see error message for details.", err)) 
    })
})

//  Like a location based on id
router.post("/like/:id", function(req, res) {

  db.Location.findOne(  {where: { id: req.params.id } } )
    .then(loc => { 
      return loc.increment("numlikes")
    })
    .then((response) => { 
      res.json(response)
      })
    .catch(err => { 
      res.json(new ResponeObj(null, "Something went wrong, see error message for details.", err)) 
    })
})

//`creates new location
router.post("/create", function(req, res){
  let body = req.body

  req.body.city = "Charlotte"
  req.body.state = "NC"

//  Google geocaching API
  rp.get({
    uri: "http://maps.googleapis.com/maps/api/geocode/json?address=" + encodeURIComponent(
  `${req.body.address} ${req.body.city}, ${req.body.state}`),
  })
  .then( resp => {

    let respObj = JSON.parse(resp)

      //adding lat, lng to the request object to pass into db.
      req.body.lat = respObj.results[0].geometry.location.lat
      req.body.lng = respObj.results[0].geometry.location.lng
      
      return db.Location.create(body)
  })
  .then(dbLocation => { 
      res.json(new ResponeObj(dbLocation.dataValues, "Success, Location created.")) 
  })
  .catch(err => { 
    res.json(new ResponeObj(null, "Something went wrong, see error message for details.", err)) 
  })

})

  module.exports = router
