import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required :[true , "Username is Required."],
        unique : [true, "Username must be unique"]
    },

    email:{
          type: String,
        required :[true , "Email is Required."],
        unique : [true, "Email must be unique"]
    },

    password:{
        type:String,
        required : [true, "Password is Required."]
    },
    
})
const UserModel = mongoose.model("users" , userSchema);

export default UserModel