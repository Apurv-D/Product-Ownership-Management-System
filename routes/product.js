var express = require("express");
const productcontroller = require("../src/product/productController");

var router = express.Router();

// router.get("/", UserController.getUser);
router.post("/createProduct", productcontroller.getProductOwnedByCustomer);

module.exports = router;
