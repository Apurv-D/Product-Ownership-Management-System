var express = require("express");
const UserController = require("../src/user/user.controller");

var router = express.Router();

// router.get("/", UserController.getUser);

router.post("/", UserController.createUser);

module.exports = router;
