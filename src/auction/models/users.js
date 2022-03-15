var mongoose = require("mongoose");
var users = new mongoose.Schema(
    {
        user_account_address: {
            type: String,
            required: true
        },
        as_customer: {
            type: Array,
            default: true
        },
        as_retailer: {
            type: Number,
            required: true
        },
        as_manufacturer: {
            type: Number,
            required: false
        }
});

module.exports = mongoose.model("users", users);
