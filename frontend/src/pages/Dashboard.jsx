import ai_icon2 from "../assets/ai_icon2.png";
import React, { useContext, useEffect, useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import AssistantPanel from "../components/AssistantPanel";
import { userDataContext } from "../context/userContext";
import axios from "axios";
import Customize from "./Customize"; 


function Dashboard() {
  const [showCustomize, setShowCustomize] = useState(false);

  const { userData, getGeminiResponse, serverUrl } =
    useContext(userDataContext);

  const recognitionRef = useRef(null);
  const chatContainerRef = useRef(null);

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [spokenText, setSpokenText] = useState("");

  // ================= INTRO =================
  const hasSpokenIntro = useRef(false);
  useEffect(() => {
    if (!userData?.assistantName || hasSpokenIntro.current) return;

    const intro = `Hello. My name is ${userData?.assistantName}. What can I do for you today?`;

    setTimeout(() => {
      speak(intro);
      hasSpokenIntro.current = true;
    }, 800);
  }, [userData]);

  // ================= SCROLL =================
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // ================= SPEAK =================
  const speak = (text) => {
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.onstart = () => setIsAiSpeaking(true);
    utterance.onend = () => setIsAiSpeaking(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  // ================= 🔥 YOUTUBE BACKEND FUNCTION =================
  const playYoutubeVideo = async (query) => {
    try {
      const res = await axios.post(`${serverUrl}/api/youtube/play`, {
        query,
      });

      const videoUrl = res.data.videoUrl;

      if (videoUrl) {
        window.open(videoUrl, "_blank");
      }
    } catch (error) {
      console.log("youtube play error:", error);
    }
  };

  // ================= COMMAND =================
  const handleCommand = (data) => {
    if (!data) return;

    const { type, userInput } = data;

    if (type === "google-search") {
      window.open(
        `https://www.google.com/search?q=${encodeURIComponent(userInput)}`,
        "_blank"
      );
      return;
    }

    if (type === "calculator-open") {
      window.open("https://www.google.com/search?q=calculator", "_blank");
      return;
    }

    if (type === "instagram-open") {
      window.open("https://www.instagram.com/", "_blank");
      return;
    }

    if (type === "facebook-open") {
      window.open("https://www.facebook.com/", "_blank");
      return;
    }

    if (type === "weather-show") {
      window.open("https://www.google.com/search?q=weather", "_blank");
      return;
    }

    // ✅ FIXED (USING YOUR OLD BACKEND)
    if (type === "youtube-play") {
      playYoutubeVideo(userInput);
      return;
    }

    if (type === "youtube-search") {
      window.open(
        `https://www.youtube.com/results?search_query=${encodeURIComponent(userInput)}`,
        "_blank"
      );
      return;
    }

    if (type === "youtube-open") {
      window.open("https://www.youtube.com", "_blank");
      return;
    }

    // ✅ TIME
    if (type === "get-time") {
      const now = new Date();
      const msg = `Current time is ${now.toLocaleTimeString()} and date is ${now.toLocaleDateString()}`;
      setMessages((prev) => [...prev, { type: "ai", text: msg }]);
      speak(msg);
      return;
    }
  };

  // ================= PROCESS =================
  const processUserMessage = async (text) => {
    if (!text || isLoading) return;

    setMessages((prev) => [...prev, { type: "user", text }]);
    setIsLoading(true);

    try {
      const response = await getGeminiResponse(text);

      handleCommand(response);

      setMessages((prev) => [
        ...prev,
        { type: "ai", text: response?.response },
      ]);

      if (response?.response) speak(response.response);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  // ================= MIC =================
  const startListening = () => {
    if (!recognitionRef.current || isLoading) return;
    recognitionRef.current.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.lang = "mr-IN";

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript.trim();

      setSpokenText(transcript);
      recognition.stop();
      setIsListening(false);

      if (!transcript) return;

      // ✅ FIX: show chat
      // setMessages((prev) => [...prev, { type: "user", text: transcript }]);

      await processUserMessage(transcript);
    };

    recognition.onend = () => setIsListening(false);

    return () => recognition.stop();
  }, []);
return (
  <>
    <div className="flex h-screen overflow-hidden bg-[#0b1220] text-white">
      
      {/* LEFT */}
      <Sidebar />

      {/* CENTER */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* TOPBAR */}
        <Topbar onCustomizeClick={() => setShowCustomize(true)} />

        {/* MAIN CONTENT */}
        <div className="flex-1 px-6 md:px-10 py-6 flex flex-col gap-6 overflow-hidden">

          {/* HEADER */}
          <div className="text-center">
            <h1 className="text-3xl font-semibold">
              Welcome back, {userData?.name}
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              How can I help you today?
            </p>
          </div>

          {/* CHAT BOX */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto bg-gradient-to-br from-[#0f172a] to-[#020617] border border-purple-500/20 rounded-2xl p-6 flex items-center justify-center"
          >
            {messages.length === 0 ? (
              <div className="text-center space-y-4">

                {/* AI CORE */}
                <div className="relative w-24 h-24 mx-auto">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 blur-md opacity-70"></div>

                  <div className="relative w-24 h-24 rounded-full bg-[#0b1220] flex items-center justify-center border border-purple-500/30">
                    <img
                      src={ai_icon2}
                      alt="AI Icon"
                      className="w-14 h-14 object-contain"
                    />
                  </div>
                </div>

                <h2 className="text-2xl font-semibold">
                  I'm <span className="text-purple-400">Jarvis AI</span>
                </h2>

                <p className="text-gray-400 text-sm">
                  Click the mic or type your message
                </p>
              </div>
            ) : (
              <div className="w-full space-y-2">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={msg.type === "user" ? "text-right" : ""}
                  >
                    <span className="bg-gray-700 px-3 py-2 rounded-lg inline-block">
                      {msg.text}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* VOICE TEXT */}
          <p className="text-center text-sm text-purple-400">
            {spokenText ? `You said: ${spokenText}` : "Click mic and speak"}
          </p>

          {/* INPUT BAR */}
          <div className="flex items-center gap-3 bg-[#0f172a]/80 border border-purple-500/20 rounded-full px-4 py-2">

            <button
              onClick={isListening ? stopListening : startListening}
              className={`w-10 h-10 flex items-center justify-center rounded-full ${
                isListening ? "bg-red-500" : "bg-purple-600"
              }`}
            >
              🎤
            </button>

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-transparent outline-none text-sm text-gray-300"
            />

            <button
              onClick={() => processUserMessage(input)}
              className="bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-2 rounded-full font-medium hover:scale-105 transition"
            >
              Send
            </button>
          </div>

        </div>
      </div>

      {/* RIGHT PANEL */}
      <AssistantPanel
        isListening={isListening}
        isAiSpeaking={isAiSpeaking}
        onStartListening={startListening}
        onStopListening={stopListening}
      />
    </div>

    {/* MODAL ONLY (CORRECT WAY) */}
    {showCustomize && (
      <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
        <div className="w-[90%] max-w-3xl max-h-[90vh] bg-[#0b1220] rounded-2xl overflow-y-auto relative">

          <button
            onClick={() => setShowCustomize(false)}
            className="absolute top-4 right-4 bg-red-500 px-3 py-1 rounded"
          >
            X
          </button>

          <Customize />
        </div>
      </div>
    )}
  </>
);}

export default Dashboard;