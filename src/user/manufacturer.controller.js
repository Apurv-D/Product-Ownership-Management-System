



const manufacturer = require("./models/manufacturer");

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

const createManufacturer = async (req, res, next) => {
  try {
    const data = (req.body);
    const uniqueManufacturer=await manufacturer.findOne({manufacturerAddress:data.manufacturerAddress});
    console.log("Here is the error: ", uniqueManufacturer)
    if(uniqueManufacturer){
      return apiResponse.successResponseWithData(res, "Customer Details were updated", uniqueManufacturer);
    }
    const Manufacturer = new manufacturer({...(data)});
    const manufacturerRef = await Manufacturer.save();
    return apiResponse.successResponseWithData(
      res,
      "user created sucessfully !..",
      manufacturerRef
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
      customer.findOne({customerAddress:req.params.id}).then((cust)=>{
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
      customer.findOne({customerAddress:req.params.id}).then((cust)=>{
      cust.productConfirmations.push({ productId:data.productId});
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

const confirmProduct = async (req, res, next) => {
  try {
    const data = (req.body);
    const uniqueCustomer=await customer.findOne({customerAddress:req.params.id});
    console.log("Here is the error: ", uniqueCustomer)
    if(uniqueCustomer){
      console.log("inside if")
      customer.findOne({customerAddress:req.params.id}).then((cust)=>{
      var arr = cust.productConfirmations;
      var index;
      for(var i=0; i<arr.length; i++){
        if(arr[i].productId == data.productId){
          index=i;
          break;
        }
      }
      console.log("indx is ", index)
      cust.productConfirmations.splice(index, 1);
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
  createManufacturer,
  confirmProduct,
  acceptProductRequest,
  addRequest, 
  getDetailsByAddress,
  verifyManufacturer
};

