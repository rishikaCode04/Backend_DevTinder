const express = require("express");
const authRouter = express.Router();


const User = require("../models/user");
const bcrypt = require("bcrypt");
const { validationSetup } = require("../utils/validation");

authRouter.post("/signup", async (req, res) => {
    try {
      validationSetup(req);
      const { firstName, lastName, emailId, password } = req.body;
  
      const passwordHash = await bcrypt.hash(password, 10);
  
      const user = new User({
        firstName,
        lastName,
        password: passwordHash,
        emailId,
      });
  
      await user.save();
      res.send("Data is saved successfully");
    } catch (err) {
      console.error(err);
      res.status(400).send("error is sotirng the data");
    }
  });
  
authRouter.post("/login", async (req, res) => {
    try {
      const { emailId, password } = req.body;
      const user = await User.findOne({ emailId: emailId });
      if (!user) {
        throw new Error("Error: Invalid creads mind trying it again");
      }
      const isPasswordValid = await user.validatePassword(password); ///passing all the passwords standards
      if (isPasswordValid) {
        const token = await user.getJWT();  // get a jsonwebtoken
        console.log(token);
        res.cookie("token", token);   //wrap it inside a cookie
        res.send(user);
      } else
      { throw new Error("Error: Wrong password");}
    } catch (err) {
      console.log(err);
      res.status(400).send(err.message);
    }
  });

authRouter.post("/logout",async(req,res)=>{
    res.cookie("token",null,{
        expires: new Date(Date.now()),
    });
    res.send("Account has been logged out");
  })


module.exports = authRouter;