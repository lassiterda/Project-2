module.exports = function(sequelize, DataTypes){
  return sequelize.define('TripLocation', {
    sequenceNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      }
    }
  })
}
