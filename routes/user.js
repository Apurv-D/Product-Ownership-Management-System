var express = require("express");
const UserController = require("../src/user/user.controller");

var router = express.Router();

// router.get("/", UserController.getUser);
router.post("/createUser", UserController.createUser);

router.get("/getUser/:id", UserController.getDetailsByAddress);

router.post("/verifyManufacturer", UserController.verifyManufacturer);


module.exports = router;
