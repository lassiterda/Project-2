module.exports = function(db) {

  //associates Locations and Trips via the 'TripLocation' table.
  db.Location.belongsToMany(db.Trip, { through: db.TripLocation })
  db.Trip.belongsToMany(db.Location, { through: db.TripLocation })

  //associates the Users and their Trips via the 'UserTrip' Table, (currently no model).
  db.User.belongsToMany(db.Trip, { through:  db.UserTrip })
  db.Trip.belongsToMany(db.User, { through: db.UserTrip })
}
