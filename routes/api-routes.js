const router = require("express").Router();
const locationRouter = require("./locations");
const triprouter = require("./trips");
//this assigns all locations to location router  

router.use("/locations", locationRouter);
router.use("/trips", triprouter);


module.exports = router;
