import express from "express";
import{signup,login,logOut } from "../controllers/authController.js"


const authRouter = express.Router()

authRouter.post("/signup",signup)
authRouter.post("/signIn",login)
authRouter.get("/logout",logOut)

export default authRouter;