import mongoose from "mongoose";

const connectDb =async()=>{
try {
    await mongoose.connect(process.env.MONGODB_URI)
  console.log("MONGO is connected")
} catch (error) {
    console.log("MONGO is not connected")
}
}
export default connectDb;