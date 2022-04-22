var mongoose = require("mongoose");
var manufac = new mongoose.Schema(
    {
        manufacturerAddress: {
            type: String,
            required: true
        },
        manufacturerEmail: {
            type: String,
            required: false
        },
        incomingRequest : [{
            walletAddress: String,
            productId: String
        }],
        isVerified : {
            type: Boolean,
            default: false
        }

});

module.exports = mongoose.model("manufac", manufac);
