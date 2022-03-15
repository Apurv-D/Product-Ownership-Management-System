



const user = require("./models/users.js");
const retailer = require("./models/retailers.js");
const manufacturer = require("./models/manufacturers.js");

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

const getDetailsByAddress = async (req,res,next) => {
  try{
    const user_account_address = req.params.id;
    const User = await user.findOne({user_account_address})
    const Retailer = await retailer.findOne({retailer_account_address:user_account_address});
    return apiResponse.successResponseWithData(res,"Success",User, Retailer);
  }catch(err){
      console.log(err);
      return handlerError(res,err);
  }
}


const verifyManufacturer = async (req,res,next) => {
  try{
    const data = await baseuser.validateAsync(req.body);
    const uniqueUser=await user.findOne({user_account_address:data.user_account_address});
    if(uniqueUser){
      user.findOne({user_account_address: data.user_account_address}).then((usr)=>{
      usr.as_manufacturer=true;
      usr
         .save()
            .then(updated_user => {
              const Manufacturer = new manufacturer({manufacturer_account_address: data.user_account_address}); 
              Manufacturer
                      .save()
                          .then(crated_manufacturer => {
                            return apiResponse.successResponseWithData(res, "manufacturer Details were updated", updated_user);
                          })
                          .catch(err => console.log(err));
             })
             .catch(err => console.log(err));
    })
    }else{
      throw Error("No account with this address exists");
    }

  }catch(err){
      console.log(err);
      return handlerError(res,err);
  }
}


const AddRetailerDetails = async (req, res, next) => {
  try {
    const data = await baseuser.validateAsync(req.body);
    retailer.findOne({retailer_account_address: data.user_account_address}).then((retailer)=>{
      retailer.name = data.name;
      retailer.bio = data.bio;
      retailer.email_address = data.email_address; 
      retailer.bg_img_url = data.bg_img_url;
      retailer.profile_pic_url = data.profile_pic_url;
      retailer.is_deleted = data.is_deleted;
      retailer.is_verified = data.is_verified;
      retailer
           .save()
             .then(created => {
              return apiResponse.successResponseWithData(res, "Retailer Details were updated", created);
             })
             .catch(err => console.log(err));


      return apiResponse.successResponseWithData(
      res,
      "Retailer updated successfully created sucessfully !..",
      retailer_ref
    );
      });
  } catch (err) {
    console.log(err);
    return handlerError(res, err);
  }
};


module.exports = {
  createUser, 
  getDetailsByAddress,
  AddRetailerDetails,
  verifyManufacturer
};

