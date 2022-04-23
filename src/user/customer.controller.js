



const customer = require("./models/customer.js");
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

const createCustomer = async (req, res, next) => {
  try {
    const data = (req.body);
    const uniqueCustomer=await customer.findOne({customerAddress:data.customerAddress});
    console.log("Here is the error: ", uniqueCustomer)
    if(uniqueCustomer){
      return apiResponse.successResponseWithData(res, "Customer Details were updated", uniqueCustomer);
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

const signIn = async (req, res, next) => {
  try {
    const data = (req.body);
    const uniqueCustomer=await customer.findOne({customerAddress:req.params.id});
    console.log("Here is the error: ", uniqueCustomer)
    if(uniqueCustomer){
      return apiResponse.successResponseWithData(res, "customer", uniqueCustomer);
    }
    const uniqueManufacturer=await manufacturer.findOne({manufacturerAddress:req.params.id});
    console.log("Here is the error: ", uniqueManufacturer)
    if(uniqueManufacturer){
      return apiResponse.successResponseWithData(res, "manufacturer", uniqueManufacturer);
    }
    return apiResponse.successResponseWithData(res, "Sorry this address does not exists");
    
  } catch (err) {
    console.log(err);
    return handlerError(res, err);
  }
};



const updateCustomer = async (req, res, next) => {
  try {
    const data = (req.body);
    const uniqueCustomer=await customer.findOne({customerAddress:data.customerAddress});
    console.log("Here is the error: ", uniqueCustomer)
    if(uniqueCustomer){
      const updatedCustomer = await customer.findOneAndUpdate({customerAddress:data.customerAddress},data,{new:true}) 
      return apiResponse.successResponseWithData(res, "Customer Details were updated", updatedCustomer);

    }else{
      throw Error("account with this address already exists!");
    }
  } catch (err) {
    console.log(err);
    return handlerError(res, err);
  }
};


const addRequest = async (req, res, next) => {
  try {
    const data = (req.body);
    const uniqueCustomer=await customer.findOne({customerAddress:req.params.id});
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
      const uniqueManufacturer=await manufacturer.findOne({manufacturerAddress:req.params.id});
      if(uniqueManufacturer){
        manufacturer.findOne({manufacturerAddress:req.params.id}).then((manufac)=>{
        manufac.incomingRequest.push({walletAddress:data.walletAddress, productId:data.productId});
        manufac
           .save()
              .then(updatedManufacturer => {
                
                return apiResponse.successResponseWithData(res, "owner: manufacturer was updated", updatedManufacturer);
                            
               })
               .catch(err => console.log(err));
        })
    }else{
      throw Error("owner with this address does not exists!");
    }
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
    if(uniqueCustomer){
      if(data.isCustomer=="true"){
        console.log("yea a customer")
        customer.findOne({customerAddress:data.walletAddress}).then((cust)=>{
          var arr = cust.incomingRequest;
          var index;
          for(var i=0; i<arr.length; i++){
            if(arr[i].productId == data.productId){
              index=i;
              break;
            }
          }
          console.log("indx is ", index)
          cust.incomingRequest.splice(index, 1);
          cust
             .save()
                .then(updatedCustomer => {
                 })
                 .catch(err => console.log(err));
        })
      }else{
        console.log("ye a manufacturer")
        manufacturer.findOne({manufacturerAddress:data.walletAddress}).then((manufac)=>{
          var arr = manufac.incomingRequest;
          var index;
          for(var i=0; i<arr.length; i++){
            if(arr[i].productId == data.productId){
              index=i;
              break;
            }
          }
          console.log("indx is ", index)
          manufac.incomingRequest.splice(index, 1);
          manufac
             .save()
                .then(updatedManufacturer => {
                console.log(",...")                              
                 })
                 .catch(err => console.log(err));
        })
      }

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
    if(uniqueCustomer){
      customer.findOne({customerAddress:req.params.id}).then((cust)=>{
      var arr = cust.productConfirmations;
      var index;
      for(var i=0; i<arr.length; i++){
        if(arr[i].productId == data.productId){
          index=i;
          break;
        }
      }
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
  confirmProduct,
  signIn,
  updateCustomer,
  createCustomer,
  acceptProductRequest,
  addRequest, 
  getDetailsByAddress,
  verifyManufacturer
};

