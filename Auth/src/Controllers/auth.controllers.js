import UserModel from "../Models/user.model.js";
import sessionModel from "../Models/session.model.js";
import crypto from "crypto"
import jwt from "jsonwebtoken"
import config from "../config/config.js";



async function register(req, res) {

    const { email, password, username } = req.body;

    const userExists = await UserModel.findOne({

        $or: [
            { username }, { email }
        ]
    })

    if (userExists) {
        return res.status(409).json({
            message: "user is exists"
        })
    }

    const hashPassword = crypto.createHash("sha256").update(password).digest("hex")
    
    const user = await UserModel.create({
        username,
        email,
        password: hashPassword,
    })
    
    
    const refreshToken = jwt.sign({
        user: user._id,
    }, config.JWT_TOKEN, { expiresIn: "7d" })

  

    
        
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    

    const refreshHash =crypto.createHash("sha256").update(refreshToken).digest("hex")
   
  
    

    const session = await sessionModel.create({
        userId:user._id,
        refreshToken:refreshHash,
        ip:req.ip,
        userAgent:req.headers["user-agent"]
        
    })
    
    const accessToken = jwt.sign({
        id: user._id,
        
    }, config.JWT_TOKEN, {
        expiresIn: "15m"
    }
    )
    
    res.status(201).json({
        message: "user created successfully",
        user: {
            username: user.username,
            email: user.email,
        },
        accessToken
    })

}



async function get_me(req, res) {

    const token = req.headers.authorization?.split(" ")[1]

    if (!token) {
        return res.status(401).json({
            message: "token not found."
        })
    }

    const decoded = jwt.verify(token, config.JWT_TOKEN);
    
    if (!decoded) {
        return res.status(401).json({
            message: "token is invalid"
        })
    }

    const user = await UserModel.findById(decoded.id);


    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    res.status(200).json({
        message: "token is valid",
        user: {
            username: user.username,
            email: user.email,
        }
    })

}




async function refreshToken(req, res) {

    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) {
        return res.status(401).json({
            message: "refreshToken not Found."
        })
    }

    const decoded = jwt.verify(refreshToken, config.JWT_TOKEN);
    

    if (!decoded) {
        return res.status(401).json({
            message: "refreshToken invalid Found."
        })
    }


    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex")

   

    const session = await sessionModel.findOne({
        refreshToken:refreshTokenHash,
    })

    if(!session){
        return res.status(401).json({
            message:"Invalid refresh token by session"
        })
    }

    
    const accessToken = jwt.sign({
        id: decoded.id,
    }, config.JWT_TOKEN, { expiresIn: "15m" })


    const newRefreshToken = jwt.sign({
        id: decoded.id,
    }, config.JWT_TOKEN, { expiresIn: "7d" })

    const newrefreshTokenHash = crypto.createHash("sha256").update(newRefreshToken).digest("hex")

    session.refreshToken = newrefreshTokenHash
    await session.save();

    res.cookie("refreshToken",newRefreshToken,{
        httpOnly:true,
        secure:true,
        sameSite:"strict",
        maxAge:7*24*60*60*1000
    })

    res.status(200).json({
        message: "AccessToken refreshed sucessfully.",
        accessToken
    })



}



async function logout(req,res){

    const refreshToken = req.cookies.refreshToken;

    if(!refreshToken){
           return res.status(400).json({
                message:"Refresh token not found"
            })
    }

    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex")

    

    const session = await sessionModel.findOne({
        refreshToken:refreshTokenHash,
        revoke:false
    })

    if(!session){
        return res.status(400).json({
            message : "Refresh invalid by the logout session"
        })
    }

    session.revoke =true
    await session.save();

    res.clearCookie("refreshToken")

    res.status(200).json({
        message:"logout Sucessfully"
    })

}

async function logoutAll(req,res){

    const refreshToken = req.cookies.refreshToken

    if(!refreshToken){
        return res.status(401).json({
            message:"Token Not Found."
        })
    }

    

    const decoded = jwt.verify(refreshToken,config.JWT_TOKEN)

    await sessionModel.updateMany({
        userId:decoded.id,
        revoke:false
    },{revoke:true})


    res.clearCookie("refreshToken")

    res.status(200).json({
        message:"Logout All the session "
    })
}

async function login(req,res){
    const {email,password} = req.body;
    
    if(!email||!password){
        return res.status(400).json({message:"Field is required"})
    }

    const user = await UserModel.findOne({email})

    if(!user){
        return res.status(401).json({message:"User is not Register"})
    }

    const hashPassword = crypto.createHash("sha256").update(password).digest("hex")


    if(!user||user.password!==hashPassword){
        return res.status(401).json({
            message:"Credintals is invalid"
        })
    }

    const refreshToken = jwt.sign({id:user._id},config.JWT_TOKEN,{expiresIn:"7d"})
    const accessToken = jwt.sign({id:user._id},config.JWT_TOKEN,{expiresIn:"15m"})


    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex")

    await sessionModel.create({
        userId:user._id,
        refreshToken:refreshTokenHash,
        ip:req.ip,
        userAgent:req.headers["user-agent"]
    })

    res.cookie("refreshToken",refreshToken, {
        httpOnly:true,
        secure:true,
        sameSite:"strict",
        maxAge:7*24*60*60*1000,
    })


    res.status(200).json({
        message:"login is the suessfully",
        user:{
            username:user.username,
            email : user.email
        }
    })
    

}

export { register, get_me, refreshToken , logout,logoutAll,login}