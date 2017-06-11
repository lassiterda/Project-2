var rp = require('request-promise');
const db = require('./../db/models');


module.exports = (app) => {

  //get one or all trips
  app.get("api/trips/:id?", function(req,res){

    let query = req.params.id ?
      {where: { id : req.params.id } } :
      {};

      console.log(query);
      db.Trip.findAll(query)
        .then((dbLocation) => { res.json(dbLocation) })
        .catch((err) => {res.json(err)})

  })

  app.post("api/trip/:id", function(req,res){

    db.Trip.update(req.body)
      .then((dbLocation) => { res.json(dbLocation) })
      .catch((err) => {res.json(err)})

  });

  app.post("/api/trip/create", function(req,res){

  });

}
