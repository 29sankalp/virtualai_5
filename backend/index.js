import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDb from "./config/db.js"
import authRouter from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/userRoutes.js";
import youtubeRoutes from "./routes/youtubeRoutes.js";


let app = express();
app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
})); 
 


app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",authRouter); 
app.use("/api/user",userRouter); 
app.use("/api/youtube", youtubeRoutes);

const PORT = process.env.PORT 
app.listen(PORT,()=>{
  connectDb();
console.log(`The server is runing on the http://localhost:${PORT}`);
})










