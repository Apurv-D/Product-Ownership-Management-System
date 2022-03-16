
var express = require("express");
var userRouter = require("./user");
var productRouter = require("./product");

var app = express();

app.use("/user/", userRouter);
app.use("/product/", productRouter);
module.exports = app;
