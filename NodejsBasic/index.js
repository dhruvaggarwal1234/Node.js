import express from "express"

const app = express();

app.get('/',(req,res)=>{
    res.send("hello Bro what are you doing at all")
})

app.get('/about',(req,res)=>{
    res.send("This is the Hello form the about page")
})

app.listen(3000,()=>{
    console.log("Server is the connected");
})
