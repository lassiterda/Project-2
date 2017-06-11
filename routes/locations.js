const rp = require('request-promise');
const db = require('./../db/models');

module.exports = function(app) {

  //returns one location or all locations (sorted by numlikes)
  app.get("/api/location/:id?", function(req,res){

    let query = req.params.id ?
    { where: { id : req.params.id } } :
    { order: [["numlikes", "DESC"]] };

    db.Location.findAll(query)
      .then((dbLocation) => { res.json(dbLocation) })
      .catch((err) => {res.json(err)})
  })

  //update location with given id
  app.post("/api/location/update/:id", function(req,res) {
    let body = req.body;

    rp.get({
      uri: "http://maps.googleapis.com/maps/api/geocode/json?address=" + encodeURIComponent(body.address + " " + body.city + ", " + body.state),
    })
      .then( resp => {
        let  respObj = JSON.parse(resp)
        req.body.lat = respObj.results[0].geometry.location.lat;
        req.body.lng = respObj.results[0].geometry.location.lng;

        db.Location.update(req.body, { where: { id: req.params.id } })
          .then(dbLocationId => { res.json(dbLocationId) })
          .catch(err => { res.json(err) })

      })
  });

  //Like a location based on id
  app.post("/api/location/like/:id", function(req, res) {

    db.Location.findOne(  {where: { id: req.params.id } } )
      .then( loc => { return loc.increment("numlikes")})
        .then((response) => { res.json(response) })
        .catch((err) => { res.json(err) })
  })

//creates new location
  app.post("/api/location/create", function(req, res){
    let body = req.body;
    console.log(encodeURIComponent(body.address + " " + body.city + ", " + body.state));
    rp.get({
      uri: "http://maps.googleapis.com/maps/api/geocode/json?address=" + encodeURIComponent(body.address + " " + body.city + ", " + body.state),
    })
      .then( resp => {

        let respObj = JSON.parse(resp)
        //adding lat and lng to the request object to pass into db.
        req.body.lat = respObj.results[0].geometry.location.lat;
        req.body.lng = respObj.results[0].geometry.location.lng;

        db.Location.create(body)
          .then(dbLocation => { res.json(dbLocation) })
          .catch(err => { res.json(err) })
      })
  });

//close export funtion
}
