const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequestSchema");
const User = require("../models/user");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["interested", "ignored"];
      if (!allowedStatus.includes(status)) {
       return  res.status(400).json({
          message:
            "Error enocunterest check the url it cannot accept such status",
        });
      }

      //if user does not exist
      const toUser = await User.findById(toUserId);
      if (!toUser){
       return  res.status(400).json("the user does not exost in our databse");}

      //if they are sending to request to oneself

      if (fromUserId == toUserId)
        return res.status(400).json("Hey you cannot send request from you to you");

      //if x has request already sent we cannot let y send it again to x
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
        ],
      });

      if (existingConnectionRequest) {
        return res
          .status(400)
          .send("Error has occured due to same id have been found check it");
      }
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();
      res.json({
        message: "Connection Request sent Successfully",
        data,
      });
    } catch {
      res
        .status(400)
        .send(
          "Error you are encoutring we would say it is because of requestRouter"
        );
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ messaage: "Status not allowed!" });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: "Connection Request not found" });
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.json({ message: "ConnectionRequest" + status, data });
    } catch (err) {
      res
        .status(400)
        .send("Error encounter in working with request accepting and ignoring");
    }
  }
);
module.exports = requestRouter;
