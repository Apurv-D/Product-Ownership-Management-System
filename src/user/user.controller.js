



const user = require("./models/users.js");
const retailer = require("./models/retailers.js");
// const userProperties = require("./models/user_properties.model.js");
const {
  userValidator,
  updateuserValidator,
  deleteuserValidator,
  getuserByIdValidator,
  baseuser,
} = require("./validators/validator");
const apiResponse = require("../user/helpers/apiResponse");


const handlerError = (res, err) => {
  if (err.isJoi) {
    console.log(err.details);
    return apiResponse.validationErrorWithData(res, "Validation Error", {
      details: err.details.map((detail) => ({ message: detail.message })),
    });
  }
  return apiResponse.ErrorResponse(res, "Internal Server Error");
};

const createUser = async (req, res, next) => {
  try {
      
    const data = await baseuser.validateAsync(req.body);
    const uniqueUser=await user.findOne({user_account_address:data.user_account_address});
    if(uniqueUser){
      throw Error("account with this address already exists!");
    }
    const User = new user({...(data)});
    
    const userRef = await User.save();
    const Retailer = new retailer({retailer_account_address:data.user_account_address});
    const retailer_ref = await Retailer.save();
    return apiResponse.successResponseWithData(
      res,
      "user created sucessfully !..",
      userRef,
      retailer_ref
    );

  } catch (err) {
    console.log(err);
    return handlerError(res, err);
  }
};




module.exports = {
  createUser
};

