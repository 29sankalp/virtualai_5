import { useContext, useEffect, useRef, useState } from "react";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ai from "../assets/ai.gif";
import { CgMenuRight } from "react-icons/cg";
import { FaSkullCrossbones } from "react-icons/fa";
import speaker from "../assets/speaker.gif";

function Home() {

  const { userData, serverUrl, setUserData, getGeminiResponse } =
    useContext(userDataContext);

  const navigate = useNavigate();

  const recognitionRef = useRef(null);

  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [spokenText, setSpokenText] = useState("");
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [ham,setHam]=useState(false);

  // ================= LOGOUT =================

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      setUserData(null);
      navigate("/signin");
    } catch (error) {
      setUserData(null);
      console.log(error);
    }
  };

  // ================= SPEAK FUNCTION =================

  const speak = (text) => {
    if (!text) return;

    const synth = window.speechSynthesis;

    const speakNow = () => {
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = synth.getVoices();

      const selectedVoice =
        voices.find((voice) => voice.name === "Google UK English Female") ||
        voices.find((voice) => voice.lang === "en-GB") ||
        voices.find((voice) => voice.lang === "en-US") ||
        voices[0];

      if (selectedVoice) {
        utterance.voice = selectedVoice;
        utterance.lang = selectedVoice.lang;
      }

      utterance.rate = 0.95;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => {
        setIsAiSpeaking(true);
      };

      utterance.onend = () => {
        setIsAiSpeaking(false);
      };

      synth.cancel();
      synth.speak(utterance);
    };

    if (synth.getVoices().length > 0) {
      speakNow();
    } else {
      synth.onvoiceschanged = speakNow;
    }
  };



useEffect(() => {
  if (!userData?.assistantName) return;

const intro = `Hello.

My name is ${userData?.assistantName || "your assistant"}.

I am your personal AI assistant built using the MERN stack — MongoDB, Expressjs, React, and Nodejs. 
 what can I do for you today?`;

  setTimeout(() => {
    speak(intro);
  }, 800);

}, [userData]);

  // ================= COMMAND HANDLER =================

  const playYoutubeVideo = async (query) => {
  try {

    const res = await axios.post(`${serverUrl}/api/youtube/play`, {
      query
    });

    const videoUrl = res.data.videoUrl;

    if (videoUrl) {
      window.open(videoUrl, "_blank");
    }

  } catch (error) {
    console.log("youtube play error:", error);
  }
};

  const handleCommand = (data) => {

    if (!data) return;

    const { type, userInput } = data;

    if (type === "google-search") {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=${query}`, "_blank");
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

    if (type === "youtube-open") {
  window.open("https://www.youtube.com", "_blank");
  return;
}

if (type === "youtube-play") {
  playYoutubeVideo(userInput);
  return;
}

if (type === "youtube-search") {
  const query = encodeURIComponent(userInput || "youtube");
  window.open(`https://www.youtube.com/results?search_query=${query}`, "_blank");
  return;
}
  };

  // ================= START MIC =================

  const startListening = () => {

    if (!recognitionRef.current || isLoading) return;

    try {
      recognitionRef.current.start();
      setIsListening(true);
      setIsAiSpeaking(false);
    } catch (error) {
      console.log("Mic start error:", error);
    }

  };

  // ================= STOP MIC =================

  const stopListening = () => {

    if (!recognitionRef.current) return;

    recognitionRef.current.stop();
    setIsListening(false);

  };

  // ================= SPEECH RECOGNITION =================

  useEffect(() => {

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognitionRef.current = recognition;

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "mr-IN";

    recognition.onstart = () => {
      console.log("Microphone started");
      setIsListening(true);
      setIsAiSpeaking(false);
    };

    recognition.onresult = async (event) => {

      const transcript = event.results[0][0].transcript.trim();

      console.log("heard:", transcript);

      setSpokenText(transcript);

      recognition.stop();
      setIsListening(false);

      if (!transcript || isLoading) return;

      try {

        setIsLoading(true);

        const response = await getGeminiResponse(transcript);

        console.log("Gemini full response:", response);

        handleCommand(response);

        if (response?.response) {
          setTimeout(() => {
            speak(response.response);
          }, 200);
        }

      } catch (error) {

        console.log("API error:", error);

      } finally {

        setIsLoading(false);

      }

    };

    recognition.onerror = (event) => {
      console.log("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      console.log("Microphone stopped");
      setIsListening(false);
    };

    return () => {
      recognition.stop();
      window.speechSynthesis.cancel();
    };

  }, [getGeminiResponse]);

  // ================= UI =================

  return (

    <div className="w-full h-[100vh] bg-gradient-to-t from-black to-[#b0b0f5] flex flex-col items-center justify-center gap-5">

      <CgMenuRight
  className="lg:hidden text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]"
  onClick={() => setHam(true)}
/>
     <div className={`absolute lg:hidden top-0 w-full h-full z-50 bg-[#0000002c] backdrop-blur-lg transition-transform duration-300 ${ham ? "translate-x-0" : "translate-x-full"}`}>

        <FaSkullCrossbones
    className="lg:hidden text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]"
    onClick={() => setHam(false)}
  />
    


      <button
        className="min-w-[150px] h-[60px] text-black font-semibold rounded-full text-[19px]"
        onClick={handleLogOut}
      >
        Log Out
      </button>

      <button
        className="min-w-[150px] h-[60px] text-black font-semibold rounded-2xl text-[19px] px-[20px] py-[20px] "
        onClick={() => navigate("/customize")}
      >
        Customize Your Assistant
      </button>


      <div className="w-full h-[2px] bg-gray-400 "></div>
      <h1 className="text-white font-semibold text-[19px] ">
        History 
      </h1>

      <div className="w-full h-[60%] overflow-auto flex flex-col gap-[20px] ">
      {userData?.history?.map((his, index) => (
  <span
    key={index}
    className="text-white bg-[#ffffff20] p-2 rounded-md"
  >
    {his}
  </span>
))}

      </div>


    </div>





      <button
        className="min-w-[150px] h-[60px] text-black font-semibold absolute hidden  lg:block top-[20px] right-[20px] rounded-full text-[19px]"
        onClick={handleLogOut}
      >
        Log Out
      </button>

      <button
        className="min-w-[150px] h-[60px] text-black font-semibold absolute top-[100px] right-[20px] bg-white rounded-2xl text-[19px] px-[20px] py-[20px]  hidden  lg:block"
        onClick={() => navigate("/customize")}
      >
        Customize Your Assistant
      </button>

      <div className="w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl shadow-lg">
        <img
          src={userData?.assistantImage}
          className="h-full object-cover"
        />
      </div>

      <h1 className="text-white text-[18px] font-semibold">
        I'm {userData?.assistantName}
      </h1>

      {/* IMAGE SWITCHING */}
      {isAiSpeaking ? (
        <img src={ai} alt="AI Speaking" className="w-[200px]" />
      ) : (
        <img src={speaker} alt="User Speaking" className="w-[200px]" />
      )}

      <p className="text-white">
        {spokenText ? `You said: ${spokenText}` : "Click Start Mic and speak"}
      </p>

      <div className="flex gap-4">

        <button
          onClick={startListening}
          disabled={isListening || isLoading}
          className="px-6 py-3 rounded-full bg-green-600 disabled:bg-gray-500"
        >
          {isLoading ? "Processing..." : "Start Mic"}
        </button>

        <button
          onClick={stopListening}
          disabled={!isListening}
          className="px-6 py-3 rounded-full bg-red-600 disabled:bg-gray-500"
        >
          Stop Mic
        </button>

      </div>

    </div>

  );

}

export default Home;
