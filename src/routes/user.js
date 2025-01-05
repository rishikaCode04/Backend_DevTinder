const express = require("express");
const userRouter = express.Router();

const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequestSchema");
const { connection } = require("mongoose");
const User = require("../models/user");


const USER_SAFE_DATA= "firstname lastname photoUrl age gender about skills";


userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    //find return an array and findOne will return object
    const connectionRequest = await ConnectionRequest.find({
        toUserId:loggedInUser._id,
        status:"interested",
       // firstName:loggedInUser.firstName

    })
    .populate("fromUserId", ["firstName", "lastName"]);
    //.populate("fromUserId",USER_SAFE_DATA);
    res.json({
        message:"Data fetched succuessfully",
        data:connectionRequest
    })
  } catch (err) {
    res.status(400).send("Error has been found");
  }
});


userRouter.get("/user/connections", userAuth, async (req, res)=>{
  try{
   const loggedInUser = req.user;
   const connectionRequests = await ConnectionRequest.find({
    $or:[
      {toUserId:loggedInUser._id,status:"accepted"},
      {fromUserId:loggedInUser._id,status:"accepted"}
    ]
   }).populate("fromUserId", ["firstName", "lastName"]).populate("toUserId", ["firstName", "lastName"]);

   const data = connectionRequests.map((row)=>{
    if(row.fromUserId._id.toString() === loggedInUser._id.toString())
     {return row.toUserId;
}
    return row.fromUserId;

   });
   res.json({data});
  }


  catch(err){
    res.status(400).send("Error has been found");
  }
} )


userRouter.get("/feed", userAuth, async (req,res) => {
  try{

    //people we need to avoid in feed are 
    // 1.already in connection list  
    // 2.already in request pending list not accepted or rejected
    // 3.User has already requested for connection list - someone he requesed to be friends with
    // 4.he himself
    //5 he rejected the connection 
   const loggedInUser = req.user;
   const page = parseInt(req.query.page)||1;
   const limit = parseInt(req.query.page)||10;
   const skip = (page-1) * limit;
   const connectionRequest = await ConnectionRequest.find({
    $or:[{
      fromUserId:loggedInUser._id,},
     { toUserId:loggedInUser._id}
    ]
   }).select("fromUserId toUserId");

   const hideUsersFromFeed = new Set();
   connectionRequest.forEach((req)=>{
    hideUsersFromFeed.add(req.fromUserId.toString());
    hideUsersFromFeed.add(req.toUserId.toString());
   });
   console.log(hideUsersFromFeed);
   
   const users = await User.find({
    $and:[
      {_id:{ $nin : Array.from(hideUsersFromFeed)}},
      {_id : {$ne : loggedInUser._id}},
    ],
   }).select(['firstName','lastName']).skip(skip).limit(limit);



   res.send(users);

  }
  catch (err){
   res.status(400).json({message:err.message});
  }

})
module.exports = userRouter;
