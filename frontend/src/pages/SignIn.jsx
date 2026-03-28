import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { userDataContext } from "../context/userContext";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import { githubProvider } from "../firebase";
import Robot3D from "../components/Robot3D";
import BubbleReveal from "../components/BubbleReveal";

import {
  GithubAuthProvider,
  fetchSignInMethodsForEmail,
  linkWithCredential
} from "firebase/auth";


function SignIn() {

  const { serverUrl, setUserData } = useContext(userDataContext);
  const navigate = useNavigate();

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [err,setErr] = useState("");
  const [loading,setLoading] = useState(false);

  const handleSignIn = async(e)=>{
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {

      let result = await axios.post(`${serverUrl}/api/auth/signIn`,{
        email,password
      },{withCredentials:true});
      
setUserData(result.data);
setLoading(false);
navigate("/customize");

    } catch (error) {

      setUserData(null);
      setLoading(false);
      setErr(error.response?.data?.message || "Something went wrong");

    }
  };


  const handleGoogleLogin = async () => {
  try {

    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const response = await axios.post(
      `${serverUrl}/api/auth/google`,
      {
        name: user.displayName,
        email: user.email
      },
      { withCredentials: true }
    );

    setUserData(response.data);
    navigate("/");

  } catch (error) {
    console.log(error);
    setErr("Google login failed");
  }
};


const handleGithubLogin = async () => {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    const user = result.user;

    console.log("GitHub login success:", user);

  } catch (error) {
    console.log("GitHub login error:", error);

    if (error.code === "auth/account-exists-with-different-credential") {
      const email = error.customData.email;
      const pendingCred = GithubAuthProvider.credentialFromError(error);

      try {
        const methods = await fetchSignInMethodsForEmail(auth, email);

        if (methods.includes("google.com")) {
          alert("This email is already registered with Google. Please continue with Google first.");

          const googleResult = await signInWithPopup(auth, googleProvider);

          await linkWithCredential(googleResult.user, pendingCred);

          alert("GitHub account linked successfully!");
        } else if (methods.includes("password")) {
          alert("This email is already registered with email/password. Please login with email first, then link GitHub from profile settings.");
        } else {
          alert(`This email is already registered with: ${methods.join(", ")}`);
        }
      } catch (linkError) {
        console.log("Linking error:", linkError);
        alert("Could not link account.");
      }
    } else {
      alert("GitHub login failed");
    }
  }
};
  return (
<BubbleReveal>
    <div className="flex h-screen w-full">

<div className="hidden md:block w-1/2 h-screen">
  <Robot3D />
</div>

      {/* RIGHT FORM */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white">

        <form
          onSubmit={handleSignIn}
          className="w-80 md:w-96 flex flex-col items-center"
        >

          <h2 className="text-4xl font-semibold text-gray-800">Sign in</h2>
          <p className="text-gray-500 text-sm mt-2">
            Welcome back! Please sign in to continue
          </p>


          {/* GOOGLE BUTTON */}
       <button
type="button"
onClick={handleGoogleLogin}
className="w-full mt-8 h-12 rounded-full bg-gray-100 flex items-center justify-center"
>
            <img
              src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleLogo.svg"
              alt="google"
            />
          </button>

          <button
  type="button"
  onClick={handleGithubLogin}
  className="w-full mt-4 h-12 rounded-full bg-gray-900 text-white flex items-center justify-center gap-2"
>
  <img
    src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
    className="w-5"
  />
  Continue with GitHub
</button>


          {/* DIVIDER */}
          <div className="flex items-center gap-4 w-full my-6">
            <div className="h-px w-full bg-gray-300"></div>
            <p className="text-sm text-gray-500 whitespace-nowrap">
              or sign in with email
            </p>
            <div className="h-px w-full bg-gray-300"></div>
          </div>


          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email id"
            className="w-full h-12 border border-gray-300 rounded-full px-6 outline-none text-sm"
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
          {err.length>0 && (
            <p className="text-red-500 text-sm mt-2">
              *{err}
            </p>
          )}


          {/* REMEMBER + FORGOT */}
          <div className="w-full flex justify-between mt-5 text-sm text-gray-500">
            <label className="flex gap-2">
              <input type="checkbox"/>
              Remember me
            </label>

            <button type="button" className="underline">
              Forgot password
            </button>
          </div>


          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full h-11 rounded-full bg-indigo-500 text-white"
          >
            {loading ? "Loading..." : "Login"}
          </button>


          <p className="text-sm text-gray-500 mt-4">
            Don't have an account?
            <span
              className="text-indigo-500 cursor-pointer ml-1"
              onClick={()=>navigate("/signup")}
            >
              Sign up
            </span>
          </p>

        </form>

      </div>
    </div>
    </BubbleReveal>
  );
}

export default SignIn;