import mongoose from "mongoose";
import config from "./config.js";

async function connectDB() {

    try{
        await mongoose.connect(config.MONGO_URI);
        console.log("Mongodb Connected...")
    }
    catch(err){
        console.log("MongoDb Error : ", err.message );
    }

}

export default connectDB;