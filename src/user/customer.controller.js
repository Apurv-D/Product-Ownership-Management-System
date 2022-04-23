



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
      return apiResponse.successResponseWithData(res, "Customer already Existed!", uniqueCustomer);
    }
    const Customer = new customer({...(data)});
    const customerRef = await Customer.save();
    return apiResponse.successResponseWithData(
      res,
      "NEW Customer created sucessfully !..",
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
    if(uniqueCustomer){
      const updatedCustomer = await customer.findOneAndUpdate({customerAddress:data.customerAddress},data,{new:true}) 
      return apiResponse.successResponseWithData(res, "Customer Details were updated", updatedCustomer);

    }else{
      throw Error("Sorry No customer exists with this address!");
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
    var index = -1;
    if(uniqueCustomer){
      customer.findOne({customerAddress:req.params.id}).then((cust)=>{
      var arr = cust.incomingRequest;
      for(var i=0; i<arr.length; i++){
        console.log(arr[i].walletAddress == req.params.id)
        if(arr[i].productId == data.productId && arr[i].walletAddress == data.walletAddress){

          index=i;
          break;
        }
      }
      if (index == -1){
      cust.incomingRequest.push({walletAddress:data.walletAddress, productId:data.productId});
      cust
         .save()
            .then(updatedCustomer => {
              
              return apiResponse.successResponseWithData(res, "Customer Details were updated", updatedCustomer);
                          
             })
             .catch(err => console.log(err));
       }else{
          return apiResponse.successResponseWithData(res, "youve already requested");           

       }
      })


    }else{
      const uniqueManufacturer=await manufacturer.findOne({manufacturerAddress:req.params.id});
      if(uniqueManufacturer){
        manufacturer.findOne({manufacturerAddress:req.params.id}).then((manufac)=>{
        var arr = manufac.incomingRequest;
        for(var i=0; i<arr.length; i++){
          console.log(arr[i].walletAddress == req.params.id)
          if(arr[i].productId == data.productId && arr[i].walletAddress == data.walletAddress){
            index=i;
            break;
          }
        }
        if (index == -1){
        manufac.incomingRequest.push({walletAddress:data.walletAddress, productId:data.productId});
        manufac
           .save()
              .then(updatedManufacturer => {
                
                return apiResponse.successResponseWithData(res, "owner: manufacturer was updated", updatedManufacturer);
                            
               })
               .catch(err => console.log(err));
             }
             else{
                return apiResponse.successResponseWithData(res, "youve already requested");           
             }
        })

      }else{
        throw Error("Following address ", req.params.id, "is invalid");
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
    var index = -1;
    if(uniqueCustomer){
      if(data.isCustomer=="true"){
        await customer.findOne({customerAddress:data.walletAddress}).then((cust)=>{
          var arr = cust.incomingRequest;
          
          for(var i=0; i<arr.length; i++){
            console.log(arr[i].walletAddress == req.params.id)
            if(arr[i].productId == data.productId && arr[i].walletAddress == req.params.id){

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
        await manufacturer.findOne({manufacturerAddress:data.walletAddress}).then((manufac)=>{
          var arr = manufac.incomingRequest;
          
          for(var i=0; i<arr.length; i++){
            console.log(arr[i].walletAddress == req.params.id)
            if(arr[i].productId == data.productId && arr[i].walletAddress == req.params.id){
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
      console.log("index", index)
      if (index == -1){
        return apiResponse.successResponseWithData(res, "No product was found in the incomingRequest");
      }else{
        customer.findOne({customerAddress:req.params.id}).then((cust)=>{
        cust.productConfirmations.push({ productId:data.productId});
        cust
           .save()
              .then(updatedCustomer => {
                
                return apiResponse.successResponseWithData(res, "Customer Details were updated", updatedCustomer);
                            
               })
               .catch(err => console.log(err));
        })
      }

    }else{
      throw Error("Sorry no customer exists for the given address!");
    }
  } catch (err) {
    console.log(err);
    return handlerError(res, err);
  }
};

const declineProductRequest = async (req, res, next) => {
  try {
    const data = (req.body);
    const uniqueCustomer=await customer.findOne({customerAddress:req.params.id});
    var index = -1;
    if(uniqueCustomer){
      if(data.isCustomer=="true"){
        await customer.findOne({customerAddress:data.walletAddress}).then((cust)=>{
          var arr = cust.incomingRequest;
          
          for(var i=0; i<arr.length; i++){
            console.log(arr[i].walletAddress == req.params.id)
            if(arr[i].productId == data.productId && arr[i].walletAddress == req.params.id){

              index=i;
              break;
            }
          }
          if (index != -1){
          console.log("indx is ", index)
          cust.incomingRequest.splice(index, 1);
          cust
             .save()
                .then(updatedCustomer => {
                  return apiResponse.successResponseWithData(res, "request rejected", updatedCustomer);
                 })
                 .catch(err => console.log(err));
          }
        })
      }else{
        console.log("ye a manufacturer")
        await manufacturer.findOne({manufacturerAddress:data.walletAddress}).then((manufac)=>{
          var arr = manufac.incomingRequest;
          
          for(var i=0; i<arr.length; i++){
            console.log(arr[i].walletAddress == req.params.id)
            if(arr[i].productId == data.productId && arr[i].walletAddress == req.params.id){
              index=i;
              break;
            }
          }
          if (index != -1){
          console.log("indx is ", index)
          manufac.incomingRequest.splice(index, 1);
          manufac
             .save()
                .then(updatedManufacturer => {
                  return apiResponse.successResponseWithData(res, "request rejected", updatedManufacturer);
                          
                 })
                 .catch(err => console.log(err));
          }
        })
      }
      console.log("index", index)
      if (index == -1){
        return apiResponse.successResponseWithData(res, "No product was found in the incomingRequest");
      }

    }else{
      throw Error("Sorry no customer exists for the given address!");
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
      var index = -1;
      for(var i=0; i<arr.length; i++){
        if(arr[i].productId == data.productId){
          index=i;
          break;
        }
      }
      if (index == -1){
        return apiResponse.successResponseWithData(res, "No confirmation request was found");
      }
      cust.productConfirmations.splice(index, 1);
      cust
         .save()
            .then(updatedCustomer => {
              
              return apiResponse.successResponseWithData(res, "One confirmation was accepted", updatedCustomer);
                          
             })
             .catch(err => console.log(err));
      })

    }else{
      throw Error("Sorry no customer exists for the given address!");
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
  verifyManufacturer,
  declineProductRequest
};

