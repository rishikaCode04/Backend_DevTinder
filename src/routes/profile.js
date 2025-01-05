const express = require("express");
const profileRouter = express.Router();
const {userAuth} = require("../middleware/auth");
const {validateEditProfileData}=require("../utils/validation")

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
      const user = req.user;
      res.send(user);
      if(!user){
        throw new Error("User does not exist");
      }} catch (err) {
      res.status(400).send("Error");
    }
  });
  
profileRouter.patch("/profile/edit",userAuth,async (req,res)=>{
    try{
      if(!validateEditProfileData(req)){
        throw new Error("Error - some fields can not be edited has been requested for an edit");}
    
    const loggedInUser = req.user;
    console.log(loggedInUser);

    Object.keys(req.body).forEach((key)=>loggedInUser[key]=req.body[key]);
    await loggedInUser.save();
    console.log(loggedInUser);
    res.json({
      message: `${loggedInUser.firstName}, your profile updated successfuly`,
      data: loggedInUser,
    });
}
    catch(err){
        res.status(400).send("We are facing error on editing profile")
    }
})

profileRouter.patch("/profile/editpassword",async (req,res)=>{
    try{
     
    }catch(err)
    {
        res.status(400).send("We are facing difficulties in editing the passwordss");
    }
})
module.exports = profileRouter;