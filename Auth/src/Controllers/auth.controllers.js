import UserModel from "../Models/user.model.js";
import crypto from "crypto"
import jwt from "jsonwebtoken"
import config from "../config/config.js";

async function register(req,res){

   const {email , password , username} = req.body;

   const userExists = await UserModel.findOne({

    $or:[
        {username},{email}
    ]
   })

   if(userExists){
        return res.status(409).json({
            message:"user is exists"
        })
   }

   const hashPassword = crypto.createHash("sha256").update(password).digest("hex")

   const user = await UserModel.create({
    username ,
    email,
    password:hashPassword,
   })

   const token = jwt.sign({
    id : user._id
   },config.JWT_TOKEN,{

        expiresIn:"1d"
   }
)
    res.status(201).json({
        message :"user created successfully",
        user:{
            username:user.username,
            email:user.email,
        },
        token
    })

}

async function get_me(req,res){

    const token = req.headers.authorization?.split(" ")[1]

    if(!token){
         return res.status(401).json({
            message:"token not found."
         })
    }

    const decoded = jwt.verify(token,config.JWT_TOKEN);

    if(!decoded){
        return res.status(401).json({
            message:"token is invalid"
        })
    }

    const user = await UserModel.findById(decoded.id);


    if(!user){
        return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json({
        message:"token is valid",
        user:{
        username: user.username,
        email:user.email,
    }
    })
    
}

export {register,get_me}