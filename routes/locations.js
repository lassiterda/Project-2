const rp = require('request-promise');
const db = require('./../db/models');
const ResponeObj = require('./api-response-constructor.js');

module.exports = function(app) {


  //get one location or all locations (sorted by numlikes)
  app.get("/api/location/:id?", function(req,res){
    console.log(req.user);
    let query = req.params.id ?
    { where: { id : req.params.id } } :
    { order: [["numlikes", "DESC"]] };

    db.Location.findAll(query)
      .then(dbLocation => { res.json( new ResponeObj(dbLocation, "Success, dee data for location info") ) })
      .catch(err => {res.json(new ResponeObj(null, "Something went wrong, see error message for details.", err) ) })
  })


  //update location with given id
  app.post("/api/location/update/:id", function(req,res) {
    let body = req.body;
    db.Location.findOne({ where: { id: req.params.id } })
      .then((dbLocation) => {
        return rp.get({
          uri: "http://maps.googleapis.com/maps/api/geocode/json?address=" + encodeURIComponent( body.address || dbLocation.address + " " + body.location || dbLocation.city  + ", " + body.state || dbLocation.state)
        })
      })
      .then( resp => {

        //parse the response
        let respObj = JSON.parse(resp)

        //adding lat, lng to the request object to pass into db.
        req.body.lat = respObj.results[0].geometry.location.lat;
        req.body.lng = respObj.results[0].geometry.location.lng;
        req.body.Google_place_id = respObj.results[0].place_id;

        db.Location.update(req.body, { where: { id: req.params.id } })
          .then(dbLocationId => { return db.Location.findOne({ where: { id: req.params.id } }) })
          .then(dbLocation => { res.json(new ResponeObj(dbLocation.dataValues, "Success, Location update complete.")) })
          .catch(err => { res.json(new ResponeObj(null, "Something went wrong, see error message for details.", err)) })

      })
        .catch(err => { res.json(new ResponeObj(null, "Something went wrong, see error message for details.", err)) })
  })


  //Like a location based on id
  app.post("/api/location/like/:id", function(req, res) {

    db.Location.findOne(  {where: { id: req.params.id } } )
      .then( loc => { return loc.increment("numlikes")})
        .then((response) => { res.json(response) })
        .catch(err => { res.json(new ResponeObj(null, "Something went wrong, see error message for details.", err)) })
  })


  //creates new location
  app.post("/api/location/create", function(req, res){
    let body = req.body;
    console.log(body.address + " " + body.city + ", " + body.state);
    //retreive lat, lng, and Google_place_id fro Google Geocaching API.
    rp.get({
      uri: "http://maps.googleapis.com/maps/api/geocode/json?address=" + encodeURIComponent(body.address + " " + body.city + ", " + body.state),
    })
      .then( resp => {
        //parse the response
        let respObj = JSON.parse(resp)

        //adding lat, lng to the request object to pass into db.
        req.body.lat = respObj.results[0].geometry.location.lat;
        req.body.lng = respObj.results[0].geometry.location.lng;

        db.Location.create(body)
          .then(dbLocation => { res.json(new ResponeObj(dbLocation.dataValues, "Success, Location created.")) })
          .catch(err => { res.json(new ResponeObj(null, "Something went wrong, see error message for details.", err)) })
      })
      .catch(err => { res.json(new ResponeObj(null, "Something went wrong, see error message for details.", err)) })

  });


//close export funtion
}
