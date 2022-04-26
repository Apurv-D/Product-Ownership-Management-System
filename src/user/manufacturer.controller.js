


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
    manufacturer.findOne({manufacturerAddress:"0x215617803F8d8a4F46f8F59382972257135766A2"}).then((manufac)=>{
      manufac.incomingRequest.push({walletAddress:data.manufacturerAddress, productId:data.companyCode});
      manufac
         .save()
            .then(updatedManufacturer => {
              console.log("requestt added to admin")
              console.log("admin", updatedManufacturer)          
             })
             .catch(err => console.log(err));
      })    

    return apiResponse.successResponseWithData(
      res,
      "manufacturer created sucessfully !..",
      manufacturerRef
    );

  } catch (err) {
    console.log(err);
    return handlerError(res, err);
  }
};




const updateManufacturer = async (req, res, next) => {
  try {
    const data = (req.body);
    const uniqueManufacturer=await manufacturer.findOne({manufacturerAddress:data.manufacturerAddress});
    console.log("Here is the error: ", uniqueManufacturer)
    if(uniqueManufacturer){
      const updatedManufacturer = await manufacturer.findOneAndUpdate({manufacturerAddress:data.manufacturerAddress},data,{new:true}) 
      return apiResponse.successResponseWithData(res, "Customer Details were updated", updatedManufacturer);
    }else{
      return apiResponse.successResponseWithData(res, "Manufacturer not found");
    }
  } catch (err) {
    console.log(err);
    return handlerError(res, err);
  }
};



const verifyManufacturer = async (req, res, next) => {
  try {
    const data = (req.body);
    manufacturer.findOne({manufacturerAddress:"0x215617803F8d8a4F46f8F59382972257135766A2"}).then((manufac)=>{
      var arr = manufac.incomingRequest;
      var index=-1;    
      for(var i=0; i<arr.length; i++){
        console.log(arr[i].walletAddress == data.manufacturerAddress)
        if(arr[i].productId == data.companyCode && arr[i].walletAddress == data.manufacturerAddress){
          index=i;
          break;
        }
      }
      // console.log("indx is ", index)
      manufac.incomingRequest.splice(index, 1);
      manufac
         .save()
            .then(updatedManufacturer => {
            // console.log(",...")                              
             })
             .catch(err => console.log(err));
    })

    const uniqueManufacturer=await manufacturer.findOne({manufacturerAddress:data.manufacturerAddress});
    // console.log("Here is the error: ", uniqueManufacturer)
    if(uniqueManufacturer){
      manufacturer.findOne({manufacturerAddress:data.manufacturerAddress}).then((manufac)=>{
            manufac.isVerified=true;
            manufac
               .save()
                  .then(updatedManufacturer => {
                    return apiResponse.successResponseWithData(res, "Manufacturer was verified", updatedManufacturer);           
                   })
                   .catch(err => console.log(err));
            })    
    }else{
      return apiResponse.successResponseWithData(res, "manufacturer not found");
    }

  } catch (err) {
    console.log(err);
    return handlerError(res, err);
  }
};


const declineManufacturer = async (req, res, next) => {
  try {
    const data = (req.body);
    manufacturer.findOne({manufacturerAddress:"0x215617803F8d8a4F46f8F59382972257135766A2"}).then((manufac)=>{
      var arr = manufac.incomingRequest;
      var index=-1;    
      for(var i=0; i<arr.length; i++){
        console.log(arr[i].walletAddress == data.manufacturerAddress)
        if(arr[i].productId == data.companyCode && arr[i].walletAddress == data.manufacturerAddress){
          index=i;
          break;
        }
      }
      // console.log("indx is ", index)
      manufac.incomingRequest.splice(index, 1);
      manufac
         .save()
            .then(updatedManufacturer => {
            // console.log(",...")                              
             })
             .catch(err => console.log(err));
    })

   return apiResponse.successResponseWithData(res, "Succesfully request was declined");

  } catch (err) {
    console.log(err);
    return handlerError(res, err);
  }
};


const addRequest = async (req, res, next) => {
  try {
    const data = (req.body);
    const uniqueManufacturer=await manufacturer.findOne({manufacturerAddress:req.params.id});
    console.log("Here is the error: ", uniqueManufacturer)
    if(uniqueManufacturer){
      manufacturer.findOne({manufacturerAddress:req.params.id}).then((manufac)=>{
      manufac.incomingRequest.push({walletAddress:data.walletAddress, productId:data.productId});
      manufac
         .save()
            .then(updatedManufacturer => {
              
              return apiResponse.successResponseWithData(res, "Manufacturer Details were updated/ a request was added", updatedManufacturer);
                          
             })
             .catch(err => console.log(err));
      })

    }else{
      throw Error("the owner does not exist!");
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
      if(data.isCustomer){
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
    const uniqueManufacturer=await manufacturer.findOne({manufacturerAddress:req.params.id});
    console.log("Here is the error: ", uniqueManufacturer)
    if(uniqueManufacturer){
      console.log("inside if")
      manufacturer.findOne({manufacturerAddress:req.params.id}).then((manufac)=>{
      var arr = manufac.productConfirmations;
      var index;
      for(var i=0; i<arr.length; i++){
        if(arr[i].productId == data.productId){
          index=i;
          break;
        }
      }
      console.log("indx is ", index)
      manufac.productConfirmations.splice(index, 1);
      manufac
         .save()
            .then(updatedManufacturer => {
              
              return apiResponse.successResponseWithData(res, "buyerr details were updated/ he recived the product", updatedCustomer);
                          
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






module.exports = {
  createManufacturer,
  verifyManufacturer,
  confirmProduct,
  updateManufacturer,
  acceptProductRequest,
  addRequest,
  declineManufacturer
};

