



const customer = require("./models/customer.js");

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

const createCustomer = async (req, res, next) => {
  try {
    const data = (req.body);
    const uniqueCustomer=await customer.findOne({customerAddress:data.customerAddress});
    console.log("Here is the error: ", uniqueCustomer)
    if(uniqueCustomer){
      throw Error("account with this address already exists!");
    }
    const Customer = new customer({...(data)});
    const customerRef = await Customer.save();
    return apiResponse.successResponseWithData(
      res,
      "user created sucessfully !..",
      customerRef
    );
  } catch (err) {
    console.log(err);
    return handlerError(res, err);
  }
};


const addRequest = async (req, res, next) => {
  try {
    const data = (req.body);
    const uniqueCustomer=await customer.findOne({customerAddress:req.params.id});
    console.log("Here is the error: ", uniqueCustomer)
    if(uniqueCustomer){
      customer.findOne({customerAddress:data.customerAddress}).then((cust)=>{
      cust.incomingRequest.push({walletAddress:data.walletAddress, productId:data.productId});
      cust
         .save()
            .then(updatedCustomer => {
              
              return apiResponse.successResponseWithData(res, "Customer Details were updated", updatedCustomer);
                          
             })
             .catch(err => console.log(err));
      })

    }else{
      throw Error("account with this address already exists!");
    }
  } catch (err) {
    console.log(err);
    return handlerError(res, err);
  }
};

const acceptProductRequest = async (req, res, next) => {
  try {
    const data = (req.body);
    const uniqueCustomer=await customer.findOne({customerAddress:req.params.id});
    console.log("Here is the error: ", uniqueCustomer)
    if(uniqueCustomer){
      customer.findOne({customerAddress:data.customerAddress}).then((cust)=>{
      cust.productConfirmations.push({walletAddress:data.walletAddress, productId:data.productId});
      cust
         .save()
            .then(updatedCustomer => {
              
              return apiResponse.successResponseWithData(res, "Customer Details were updated", updatedCustomer);
                          
             })
             .catch(err => console.log(err));
      })

    }else{
      throw Error("account with this address already exists!");
    }
  } catch (err) {
    console.log(err);
    return handlerError(res, err);
  }
};

const getDetailsByAddress = async (req,res,next) => {
  try{
    const user_account_address = req.params.id;
    const User = await user.findOne({user_account_address})
    return apiResponse.successResponseWithData(res,"Success",User);
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






module.exports = {
  createCustomer,
  acceptProductRequest,
  addRequest, 
  getDetailsByAddress,
  verifyManufacturer
};

