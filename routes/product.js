var express = require("express");
const productcontroller = require("../src/product/productController");

var router = express.Router();

// router.get("/", UserController.getUser);
router.post("/createProduct", productcontroller.getProductOwnedByCustomer);
router.post("/addcustomer", productcontroller.addcustomer);

module.exports = router;
