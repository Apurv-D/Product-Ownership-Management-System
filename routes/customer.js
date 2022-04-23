var express = require("express");
const CustomerController = require("../src/user/customer.controller");

var router = express.Router();

// router.get("/", UserController.getUser);
router.post("/createCustomer", CustomerController.createCustomer);
router.post("/updateCustomer", CustomerController.updateCustomer);

router.post("/addRequest/:id", CustomerController.addRequest);
router.post("/acceptProductRequest/:id", CustomerController.acceptProductRequest);
router.post("/confirmProduct/:id", CustomerController.confirmProduct);
router.get("/signIn/:id", CustomerController.signIn);

router.post("/declineProductRequest/:id", CustomerController.declineProductRequest);



module.exports = router;
