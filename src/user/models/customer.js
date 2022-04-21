var mongoose = require("mongoose");
var customer3 = new mongoose.Schema(
    {
        customerAddress: {
            type: String,
            required: true
        },
        customerEmail: {
            type: String,
            required: false
        },
        incomingRequest : [{
            walletAddress: String,
            productId: String
        }],
        productConfirmations: [{
            productId: String
        }]

});

module.exports = mongoose.model("customer3", customer3);
