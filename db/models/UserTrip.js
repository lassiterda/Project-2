module.exports = function(sequelize, DataTypes){
  return sequelize.define('UserTrip', {
    shared: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    }
  })
}
