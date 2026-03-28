import React, { useState } from 'react'
import Card from "../components/Card"

import dummy1 from "../assets/dummy1.jpg"
import dummy2 from "../assets/dummy2.jpg"
import dummy3 from "../assets/dummy3.jpg"
import dumm4 from "../assets/dumm4.jpg"
import dummy5 from "../assets/dummy5.jpg"
import dummy6 from "../assets/dummy6.jpg"
import dummy7 from "../assets/dummy7.jpg"

import { TiUpload } from "react-icons/ti";
import {useRef} from "react"
import { userDataContext } from '../context/userContext';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowBackOutline } from "react-icons/io5";
  
function Customize() {

  const {
    serverUrl,userData,setUserData,backendImage,setBackendImage,frontendImage,setFrontendImage, selectedImage,setSelectedImage
  } =useContext(userDataContext);
   const navigate = useNavigate();

  const inputImage = useRef() 
  const handleImage=(e)=>{
    const file = e.target.files[0];

     if (!file) return;
     
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
  }
  

  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-[black] to-[#b0b0f5] flex justify-center items-center flex-col p-[20px]">

            <IoArrowBackOutline className='absolute top-[30px] left-[30px]  text-white w-[25px] h-[25px]
            ' onClick={()=> navigate("/")} />


    <h1 className='text-white mb-[30px] text-[30px] text-center '>Select your Assistant Image </h1>

    <div className='w-[90%] max-w-[60%]  flex justify-center items-center flex-wrap gap-[20px]'>
    <Card image={dummy7}/>
     <Card image={dummy1}/>  
      <Card image={dummy2}/>
       <Card image={dummy3}/>
        <Card image={dumm4}/>
         <Card image={dummy5}/>
          <Card image={dummy6}/>

  <div className={`w-[70px] h-[140px]   lg:w-[150px] lg:h-[250px]  bg-[#d6d6e4] border-2 border-[blue] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-950 cursor-pointer hover:border-4 hover-border flex items-center justify-center ${selectedImage=="input "?"border-4 border-white shadow-2xl hover:shadow-blue-950":null} `} onClick={()=>{
    inputImage.current.click()
    setSelectedImage("input")
    
    }}>

          {!frontendImage &&  <TiUpload className='text-white w-[25px] h-[25px]'/> }
          {frontendImage &&  <img src={frontendImage} className=' h-full object-cover'/>}


              </div>
              <input type="file" accept="image/*"  ref={inputImage}   hidden onChange={handleImage}/>
              </div>

            {selectedImage &&  <button
            className='min-w-[150px] h-[60px] mt-[30px] text-black font-semibold cursor-pointer bg-white rounded-2xl text-[19px]' onClick={()=>navigate("/Customize2")}>Next</button> }


          
          </div>
  )
}

export default Customize
