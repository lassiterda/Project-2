
module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Trip", {
      name: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
              len: [1]
          }
      },
      description: {
          type: DataTypes.TEXT,
      },
      numlikes: {
          type: DataTypes.INTEGER,
          defaultValue: 0
      }
  })
}
