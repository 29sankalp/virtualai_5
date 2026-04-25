import React, { useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { userDataContext } from "../context/userContext";
import ReCAPTCHA from "react-google-recaptcha";

function SignUp() {
  const { serverUrl, setUserData } = useContext(userDataContext);
  const navigate = useNavigate();

  const captchaRef = useRef(null);
  const [captchaToken, setCaptchaToken] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

const handleSignUp = async(e)=>{
  e.preventDefault();

  if(!captchaToken){
    setErr("Please verify the captcha");
    return;
  }

  setErr("");
  setLoading(true);

  try {

    let result = await axios.post(`${serverUrl}/api/auth/signup`,{
      name,
      email,
      password,
      captchaToken
    },{withCredentials:true});

 setUserData(null);
setLoading(false);
navigate("/signIn");

  } catch (error) {

    setUserData(null);
    setLoading(false);
    setErr(error.response?.data?.message || "Something went wrong");

  }
};

  return (

    <div className="flex h-screen w-full">

      {/* LEFT IMAGE */}
      <div className="hidden md:block w-1/2">
        <img
          className="h-full w-full object-cover"
          src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/leftSideImage.png"
          alt="ai"
        />
      </div>


      {/* RIGHT FORM */}
      <div className="w-full md:w-1/2 flex items-center justify-center">

        <form
          onSubmit={handleSignUp}
          className="w-80 md:w-96 flex flex-col items-center"
        >

          <h2 className="text-4xl font-semibold text-gray-800">Create Account</h2>
          <p className="text-gray-500 text-sm mt-2">
            Sign up to start using your virtual assistant
          </p>


          

          {/* DIVIDER */}
          <div className="flex items-center gap-4 w-full my-6">
            <div className="h-px w-full bg-gray-300"></div>
            <p className="text-sm text-gray-500 whitespace-nowrap">
              or sign up with email
            </p>
            <div className="h-px w-full bg-gray-300"></div>
          </div>


          {/* NAME */}
          <input
            type="text"
            placeholder="Full name"
            className="w-full h-12 border border-gray-300 rounded-full px-6 outline-none text-sm"
            required
            value={name}
            onChange={(e)=>setName(e.target.value)}
          />


          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email id"
            className="w-full h-12 border border-gray-300 rounded-full px-6 outline-none text-sm mt-5"
            required
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />


          {/* PASSWORD */}
          <input
            type="password"
            placeholder="Password"
            className="w-full h-12 border border-gray-300 rounded-full px-6 outline-none text-sm mt-5"
            required
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />


          {/* ERROR */}
          {err.length > 0 && (
            <p className="text-red-500 text-sm mt-2">
              *{err}
            </p>
          )}


        <div className="mt-5">
  <ReCAPTCHA
   ref={captchaRef}
    sitekey="6LfWQoosAAAAAJo_0NduoKkZHxhADKzBIEIwQR9w"
    onChange={(token)=>setCaptchaToken(token)}
  />
</div>

          {/* SIGNUP BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full h-11 rounded-full bg-indigo-500 text-white"
          >
            {loading ? "Loading..." : "Sign Up"}
          </button>


          {/* LOGIN LINK */}
          <p className="text-sm text-gray-500 mt-4">
            Already have an account?
            <span
              className="text-indigo-500 cursor-pointer ml-1"
              onClick={()=>navigate("/signIn")}
            >
              Sign in
            </span>
          </p>

        </form>

      </div>
    </div>
  );
}

export default SignUp;