var mongoose = require("mongoose");
var retailers = new mongoose.Schema(
    {
        retailer_account_address: {
            type: String,
            required: true
        },
        name:String,
        bio: String,
        email_address:String,
        bg_img_url:String,
        profile_pic_url:String,
        is_deleted: Boolean,
        is_verified:Boolean,
});

module.exports = mongoose.model("retailers", retailers);
