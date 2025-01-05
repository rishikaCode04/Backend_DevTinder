const mongoose = require("mongoose");
const connectDB = async()=>{
    await mongoose.connect(
        "mongodb+srv://gandhirishika7:9zOiGYUDXgFg39zS@namasterishika.dsg6o.mongodb.net/devTinder"
    );
};

module.exports=connectDB
