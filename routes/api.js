
var express = require("express");
var customerRouter = require("./customer");
var productRouter = require("./product");

var app = express();

app.use("/customer/", customerRouter);
app.use("/product/", productRouter);
module.exports = app;
