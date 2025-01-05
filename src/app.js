const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}));
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user")

app.use('/',authRouter);
app.use('/',profileRouter);
app.use('/',requestRouter);
app.use('/',userRouter);


app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    console.error(err);
    res.status(400).send("Error has been encountered");
  }
});

app.get("/find", async (req, res) => {
  const _id = req.query._id; // Use query params for GET requests
  try {
    const users = await User.findByIdAndDelete(_id);
    res.send(users);
  } catch (err) {
    console.error(err);
    res.status(400).send("Error has been discovered");
  }
});



connectDB()
  .then(() => {
    console.log("Connection to cluster is established");
    app.listen(7777, () => {
      console.log("Listening on port 7777");
    });
  })
  .catch((err) => {
    console.error("We encountered an error, mind rechecking it", err);
  });
