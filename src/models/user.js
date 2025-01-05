const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
 const bcrypt = require("bcrypt");


 //database schema
const userSchema = new mongoose.Schema({
    firstName:{type:String},
    lastName:{type:String},
    emailId:{type:String,unique:true},
    password:{type:String},
    age:{type:Number},
    gender:{type:String},
    photoUrl:{type:String},
    skills:{type:[String]}
});



userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user = this;
    const passwordHash= user.password;
    const isPasswordValid = await bcrypt.compare(passwordInputByUser,passwordHash);

    return isPasswordValid;
}


userSchema.methods.getJWT = async function(){
    const user = this;
    const token = await jwt.sign({_id:user._id},"Dev@Tinder$790",{expiresIn:"7d",})
    return token;
    };



const userModel = mongoose.model("User",userSchema);
module.exports = userModel;