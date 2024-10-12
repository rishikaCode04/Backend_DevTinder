const express = require('express');
const app = express();
app.use('/web',(req,res)=>{
    res.send("Hey this is hello from web")
})
app.use('/test',(req,res)=>{
    res.send("Hey this is hello from testing environement ")
})
app.use('/',(req,res)=>{
    res.send("Hey this is from dashboard")
})
app.listen(3000,()=>{
    console.log("Hey this is listening from the port 3000")
});