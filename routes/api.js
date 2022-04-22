
var express = require("express");
var customerRouter = require("./customer");
var manufacturerRouter = require("./manufacturer");
var productRouter = require("./product");

var app = express();

app.use("/customer/", customerRouter);
app.use("/product/", productRouter);
app.use("/manufacturer/", manufacturerRouter);
module.exports = app;
