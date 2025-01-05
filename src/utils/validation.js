const validator = require('validator');
const validationSetup=(req)=>{
    const {firstName,lastName,emailId,password}=req.body;
    if(!firstName || !lastName)
        throw new Error("Error of first or lastName");
    else if(!validator.isEmail(emailId))
        throw new Error("EmailId error has occured");
    else if(!validator.isStrongPassword(password))
        throw new Error("Password is eror");

}
const validateEditProfileData = (req)=>{
    const allowedEditMethods= ["firstName","lastName","age","gender","skills","about"];
    const isEditAllowed = Object.keys(req.body).every((field)=>  allowedEditFields.includes(field));
    return isEditAllowed;
}
module.exports= {validationSetup,validateEditProfileData};