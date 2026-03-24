import { Router } from "express";
import {register,get_me} from "../Controllers/auth.controllers.js";

const authRouter = Router();

authRouter.post("/register",register)
authRouter.get("/get-me",get_me)


export default authRouter