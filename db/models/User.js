
module.exports = (sequelize, DataTypes) => {
  let User = sequelize.define( "User", {
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
        }
      },
    userType: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "user",
      validate: {
        isIn: [['user', 'admin']]
      }
    }
  });

  return User;
}
