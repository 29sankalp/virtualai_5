import { useState, createContext, useEffect } from "react";
import axios from "axios";

export const userDataContext = createContext();

function UserContext({ children }) {
  const serverUrl = "http://localhost:8000";

  const [userData, setUserData] = useState(null);
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const handleCurrentUser = async () => {
    try {
      setLoadingUser(true);
      const result = await axios.get(`${serverUrl}/api/user/current`, {
        withCredentials: true,
      });
      setUserData(result.data);
      console.log(result.data);
    } catch (error) {
      setUserData(null);
      console.log(error);
    } finally {
      setLoadingUser(false);
    }
  };

  const getGeminiResponse = async (command) => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/user/asktoassistant`,
        { command },
        { withCredentials: true }
      );

      if (result?.data?.response && command?.trim()) {
        setUserData((prev) => {
          if (!prev) return prev;

          const oldHistory = Array.isArray(prev.history) ? prev.history : [];
          return {
            ...prev,
            history: [...oldHistory, command],
          };
        });
      }

      return result.data;
    } catch (error) {
      console.log(error);
      return {
        response: "Sorry, I couldn't process that request.",
      };
    }
  };

  useEffect(() => {
    handleCurrentUser();
  }, []);

  const value = {
    serverUrl,
    userData,
    setUserData,
    backendImage,
    setBackendImage,
    frontendImage,
    setFrontendImage,
    selectedImage,
    setSelectedImage,
    getGeminiResponse,
    loadingUser,
    refreshUser: handleCurrentUser,
  };

  return (
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  );
}

export default UserContext;