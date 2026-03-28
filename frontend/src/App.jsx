import React from 'react'
import {Route,Routes} from "react-router-dom"
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import Customize from "./pages/Customize"
import Customize2 from './pages/Customize2'
import { userDataContext } from './context/userContext'
import Home from './pages/Home'
import { useContext } from 'react'
import { Navigate } from 'react-router-dom'

function App () {
  const {userData,setUserData} = useContext(userDataContext);
  return (
    <Routes>
     <Route path='/' element={(userData?.assistantImage && userData?.assistantName)? <Home/> : <Navigate to={"/customize"}/>}/> 
      <Route path='/signUp' element={!userData?<SignUp/>:<Navigate to={"/"}/>}/>
      <Route path='/signIn' element={!userData?<SignIn/>:<Navigate to={"/"}/>}/>
      <Route path='/customize'element={userData?<Customize/>:<Navigate to={"/signUp"}/>}/>
      <Route path='/customize2'element={userData?<Customize2/>:<Navigate to={"/signUp"}/>}/>
    </Routes>
  )
}

export default App