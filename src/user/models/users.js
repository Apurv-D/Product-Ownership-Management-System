var mongoose = require("mongoose");
var users2 = new mongoose.Schema(
    {
        user_account_address: {
            type: String,
            required: true
        },
        as_customer: {
            type: Boolean,
            default: true
        },
        as_retailer: {
            type: Boolean,
            default: true
        },
        as_manufacturer: {
            type: Boolean,
            default: false
        }
});

module.exports = mongoose.model("users2", users2);
