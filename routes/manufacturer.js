var express = require("express");
const ManufacturerController = require("../src/user/manufacturer.controller");

var router = express.Router();
console.log("okkk")
// router.get("/", UserController.getUser);
router.post("/createManufacturer", ManufacturerController.createManufacturer);
router.post("/verifyManufacturer", ManufacturerController.verifyManufacturer);
router.post("/declineManufacturer", ManufacturerController.declineManufacturer);
router.post("/updateManufacturer", ManufacturerController.updateManufacturer);

router.post("/addRequest/:id", ManufacturerController.addRequest);
router.post("/acceptProductRequest/:id", ManufacturerController.acceptProductRequest);
router.post("/confirmProduct/:id", ManufacturerController.confirmProduct);





module.exports = router;
