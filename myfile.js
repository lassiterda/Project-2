
module.exports = function(sequelize, DataTypes){
    var location = sequelize.define("location", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1]
            }
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
            
            }
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
            
            }    
        },
        city: {
            type: DataTypes.STRING
        },
        state: {
            type: DataTypes.STRING,
            allowNull: false,
            
            }
        },
        zip: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                len: [5]
            }
        },
        numlikes: {
            type: DataTypes.INTEGER
        },
        latitude: {
            type: DataTypes.FLOAT,  //INTEGER
            allowNull: true,
            defaultValue: null,
            validate: { min: -90, max: 90 }
          },
          longitude: {
            type: DataTypes.FLOAT,  //INTEGER
            allowNull: true,
            defaultValue: null,
            validate: { min: -180, max: 180 }
          },
        }, {
          validate: {
            bothCoordsOrNone() {
              if ((this.latitude === null) !== (this.longitude === null)) {
                throw new Error('Require either both latitude and longitude or neither')
                 }
              }
           }         
        })
        return location;
    };

    connection.synch().then(function () {
        
    })
//    {
  //      classMethods: {
//            associate: function(models)
//                location.belongsTo(models.User,
//                  {
//                     onDelete: "cascade",
//                     foreignKey: {
//                       allowNull: false   
//                     }
//                   }  
//                });
//              }
//            }






