import React, { useContext } from "react";
import { userDataContext } from "../context/userContext";

function Topbar({ onCustomizeClick }) {
  const { userData } = useContext(userDataContext);

return (
  <div className="flex justify-between items-center px-8 py-4 border-b border-gray-800">

    {/* LEFT */}
    <div>
      <h2 className="text-xl font-bold text-purple-400">
        {userData?.assistantName || "JARVIS AI"}
      </h2>
      <p className="text-xs text-gray-500">
        Your Personal Assistant
      </p>
    </div>

    {/* SEARCH */}
    <div className="w-[400px]">
      <input
        type="text"
        placeholder="Search anything..."
        className="w-full bg-[#0f172a] px-5 py-2 rounded-full border border-gray-700 outline-none"
      />
    </div>

    {/* RIGHT */}
    <div className="flex items-center gap-4">
      <button
        onClick={onCustomizeClick}
        className="bg-purple-600 px-4 py-2 rounded-lg"
      >
        Customize
      </button>

      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
        {userData?.name?.[0]}
      </div>
    </div>

  </div>
);
}

export default Topbar;