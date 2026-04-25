import React, { useContext } from "react";
import { userDataContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Sidebar() {
  const { userData, setUserData, serverUrl } = useContext(userDataContext);
  const navigate = useNavigate();

  // ✅ LOGOUT FUNCTION
  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      setUserData(null);
      navigate("/signIn");
    } catch (error) {
      console.log(error);
    }
  };

 return (
  <div className="w-64 bg-[#050b18] p-6 flex flex-col justify-between border-r border-gray-800">

    {/* LOGO */}
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
          🤖
        </div>
        <div>
          <h1 className="text-lg font-bold">JARVIS AI</h1>
          <p className="text-xs text-gray-400">Your AI Assistant</p>
        </div>
      </div>

      {/* NAV */}
      <nav className="space-y-2">
        <div
          onClick={() => navigate("/")}
          className="bg-purple-600/20 border border-purple-500 text-white p-2 rounded-lg cursor-pointer"
        >
          🏠 Home
        </div>

        <div className="text-gray-400 p-2 hover:bg-[#111827] rounded-lg cursor-pointer">
          🕘 History
        </div>
      </nav>

      {/* NEW CHAT */}
      <button
        onClick={() => navigate("/")}
        className="mt-6 w-full bg-gradient-to-r from-purple-500 to-indigo-500 py-2 rounded-lg"
      >
        + New Chat
      </button>

      {/* COMMANDS */}
      <div className="mt-8">
        <p className="text-xs text-gray-500 mb-3">PREBUILT COMMANDS</p>

        <div className="space-y-2 text-sm">

          <div className="flex justify-between bg-[#0f172a] p-3 rounded-lg hover:bg-[#1e293b] cursor-pointer"
            onClick={() => window.open("https://www.youtube.com", "_blank")}>
            <span>▶ Open YouTube</span>
            <span>›</span>
          </div>

          <div className="flex justify-between bg-[#0f172a] p-3 rounded-lg hover:bg-[#1e293b] cursor-pointer"
            onClick={() => window.open("https://www.google.com/search?q=weather", "_blank")}>
            <span>☁ Weather</span>
            <span>›</span>
          </div>

          <div className="flex justify-between bg-[#0f172a] p-3 rounded-lg hover:bg-[#1e293b] cursor-pointer"
            onClick={() => window.open("https://www.google.com/search?q=calculator", "_blank")}>
            <span>🧮 Calculator</span>
            <span>›</span>
          </div>

        </div>
      </div>
    </div>

    {/* BOTTOM */}
    <div className="text-sm text-gray-400 space-y-3">
      <p className="cursor-pointer">⚙ Settings</p>
      <p onClick={handleLogout} className="cursor-pointer text-red-400">
        Logout
      </p>
    </div>

  </div>
);
}
export default Sidebar;