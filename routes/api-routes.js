const locationRouter = require("./locations");
const triprouter = require("./trips");
//this assigns all locations to location router


module.exports = function(app) {
  locationRouter(app);
  triprouter(app);
  // userRouter(app);
};
