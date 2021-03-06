var mongoose = require("mongoose");
var okkk = new mongoose.Schema(
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
        },
        companyCode:{
            type: String,
            required: true
        }
});

module.exports = mongoose.model("okkk", okkk);
