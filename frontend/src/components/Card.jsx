import React from 'react'
import { useContext } from 'react';
import { userDataContext } from '../context/userContext';

function Card({image}) {

    const {
      serverUrl,userData,setUserData,backendImage,setBackendImage,frontendImage,setFrontendImage, selectedImage,setSelectedImage
    } =useContext(userDataContext);

  return (
  <div className={`w-[70px] h-[140px]   lg:w-[150px] lg:h-[250px] bg-[#d6d6e4] border-2 border-[blue] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-950 cursor-pointer hover:border-4 hover-border-4 ${selectedImage==image?"border-4 border-white shadow-2xl hover:shadow-blue-950":null} `} onClick={()=>{setSelectedImage(image)
   setBackendImage(null);
   setFrontendImage(null);

  }}>
      <img src={image} className='h-full object-cover'/>
    </div> 
  )
}

export default Card
