import React, { useContext } from "react";
import { userDataContext } from "../context/userContext";

function AssistantPanel({
  isListening,
  isLoading,
  isAiSpeaking,
  onStartListening,
  onStopListening,
}) {
  const { userData } = useContext(userDataContext);

  const memoryPercentage = Math.min(
    100,
    Math.max(10, (userData?.history?.length || 0) * 10)
  );

  return (
  <div className="w-80 bg-[#050b18] p-6 pt-10 hidden lg:block border-l border-gray-800">
    {/* HEADER */}
    <div className="flex justify-between items-center mb-6">
      <h2 className="font-semibold text-lg">
        JARVIS AI
      </h2>

      <span className="text-green-400 text-xs">● ONLINE</span>
    </div>

    {/* CORE AI */}
    <div className="bg-[#0f172a] p-5 rounded-xl flex flex-col items-center">
      <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center mb-3">
        🤖
      </div>

      <h3 className="font-semibold">
        Core Consciousness
      </h3>

      <p className="text-gray-400 text-sm text-center mt-2">
        {isAiSpeaking
          ? "Assistant is speaking"
          : isListening
          ? "Listening..."
          : "Ready for your command"}
      </p>
    </div>

    {/* MIC */}
    <button
      onClick={isListening ? onStopListening : onStartListening}
      className="mt-6 w-full bg-purple-600 py-3 rounded-lg"
    >
      🎤 {isListening ? "Stop Voice" : "Start Voice Module"}
    </button>

    {/* MEMORY */}
    <div className="mt-6">
      <p className="text-sm text-gray-400 mb-2">Memory Usage</p>
      <div className="w-full h-2 bg-gray-700 rounded">
        <div
          className="h-full bg-purple-500 rounded"
          style={{ width: `${memoryPercentage}%` }}
        />
      </div>
    </div>

    {/* HISTORY */}
    <div className="mt-6">
      <div className="flex justify-between mb-3">
        <p className="text-sm text-gray-400">Recent History</p>
      </div>

      <div className="space-y-2">
        {userData?.history?.length > 0 ? (
          [...userData.history].slice(-5).reverse().map((item, i) => (
            <div key={i} className="bg-[#0f172a] p-3 rounded-lg text-xs">
              {item}
            </div>
          ))
        ) : (
          <p className="text-xs text-gray-500">No history</p>
        )}
      </div>
    </div>

  </div>
);
}

export default AssistantPanel;