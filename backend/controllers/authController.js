import User from "../models/userModel.js"
import bcrypt from "bcrypt";
import genToken from "../config/token.js"
import axios from "axios";

export const signup = async (req, res) => {
  try {

    const { name, email, password, captchaToken } = req.body;

    // CAPTCHA verification
    if (!captchaToken) {
      return res.status(400).json({ message: "Captcha not verified" });
    }

    const secretKey = process.env.RECAPTCHA_SECRET;

    const captchaVerify = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      null,
      {
        params: {
          secret: secretKey,
          response: captchaToken
        }
      }
    );

    if (!captchaVerify.data.success) {
      return res.status(400).json({ message: "Captcha verification failed" });
    }

    const existEmail = await User.findOne({ email });

    if (existEmail) {
      return res.status(400).json({ message: "email already exists" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "password must be atleast 6 characters" });
    }

    const hashedPasswords = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPasswords
    });

    const token = await genToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "Strict",
      secure: false
    });

    return res.status(200).json(user);

  } catch (error) {
    return res.status(500).json({ message: "signUp error" });
  }
};

export const login = async(req,res)=>{
try {
  const{email,password}= req.body;

  const user = await User.findOne({email});
  if(!user) {
    return res.status(400).json({message:"email doesnot  exists"});
  }

   const isMatch = await bcrypt.compare(password,user.password);

     if(!isMatch) {
    return res.status(400).json({message:"incorrect password"});
  }

  const token = await genToken(user._id);
  res.cookie("token",token,{
    httpOnly:true,maxAge:7*24*60*60*1000,sameSite:"Strict",secure:false
  })
  return res.status(200).json(user)
} catch (error) {
  return res.status(500).json({message:"login error"});
}
}   


export const logOut = async(req,res)=>{
  try {
    res.clearCookie("token")
    return res.status(200).json({message:"LogOut successfully"});

  } catch (error) {
    res.status(500).json({message:"logout error"});
  }
}