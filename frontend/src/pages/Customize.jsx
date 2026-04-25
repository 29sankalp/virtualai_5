import React, { useRef, useContext } from "react";
import Card from "../components/Card";

import dummy1 from "../assets/dummy1.jpg";
import dummy2 from "../assets/dummy2.jpg";
import dummy3 from "../assets/dummy3.jpg";
import dumm4 from "../assets/dumm4.jpg";
import dummy5 from "../assets/dummy5.jpg";
import dummy6 from "../assets/dummy6.jpg";
import dummy7 from "../assets/dummy7.jpg";

import { TiUpload } from "react-icons/ti";
import { userDataContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import { IoArrowBackOutline } from "react-icons/io5";

function Customize() {
  const {
    setBackendImage,
    setFrontendImage,
    frontendImage,
    selectedImage,
    setSelectedImage,
  } = useContext(userDataContext);

  const navigate = useNavigate();
  const inputImage = useRef();

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
    setSelectedImage("input");
  };

  return (
    <div className="w-full h-full flex flex-col items-center pt-10 px-4 sm:px-6">

      {/* BACK BUTTON */}
      <IoArrowBackOutline
        className="absolute top-5 left-5 text-white w-6 h-6 cursor-pointer hover:text-purple-400"
        onClick={() => window.location.reload()}
      />

      {/* TITLE */}
      <h1 className="text-white text-2xl sm:text-3xl font-semibold mb-8 text-center">
        Choose Your Assistant Avatar
      </h1>

      {/* GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 w-full max-w-4xl">

        <Card image={dummy7} />
        <Card image={dummy1} />
        <Card image={dummy2} />
        <Card image={dummy3} />
        <Card image={dumm4} />
        <Card image={dummy5} />
        <Card image={dummy6} />

        {/* UPLOAD CARD */}
        <div
          onClick={() => inputImage.current.click()}
          className={`h-32 sm:h-36 rounded-xl flex items-center justify-center cursor-pointer 
          transition-all duration-300 border 
          ${
            selectedImage === "input"
              ? "border-purple-500 shadow-lg shadow-purple-500/30 scale-105"
              : "border-gray-700 hover:border-purple-400"
          } bg-[#0f172a]`}
        >
          {!frontendImage ? (
            <TiUpload className="text-gray-400 text-3xl" />
          ) : (
            <img
              src={frontendImage}
              className="h-full w-full object-cover rounded-xl"
              alt="upload"
            />
          )}
        </div>

        <input
          type="file"
          accept="image/*"
          ref={inputImage}
          hidden
          onChange={handleImage}
        />
      </div>

      {/* BUTTON */}
      <button
        onClick={() => navigate("/Customize2")}
        disabled={!selectedImage}
        className={`mt-8 px-8 py-3 rounded-full text-white font-medium transition-all duration-300
          ${
            selectedImage
              ? "bg-gradient-to-r from-purple-500 to-blue-500 hover:scale-105"
              : "bg-gray-600 cursor-not-allowed"
          }`}
      >
        Continue
      </button>
    </div>
  );
}

export default Customize;