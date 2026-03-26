import { Router } from "express";
import {register,get_me,refreshToken,logout,logoutAll,login} from "../Controllers/auth.controllers.js";

const authRouter = Router();

authRouter.post("/register",register)
authRouter.get("/get-me",get_me)
authRouter.get("/refresh",refreshToken)
authRouter.get("/logout",logout)
authRouter.get("/logoutAll",logoutAll)
authRouter.get("/login",login)



export default authRouter