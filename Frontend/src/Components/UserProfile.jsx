import React from 'react'
import Profile from './ui/Profile'
import axios from 'axios'
import { useSelector } from 'react-redux'
import Notauthenticated from './ui/Notauthenticated'

function UserProfile() {
    const authStatus= useSelector((state)=>state.auth.status);
    const userdata= useSelector((state)=>state.auth.userData);
    console.log(userdata)
  if(authStatus){
  return (
    <Profile role={"Student"} userData={userdata} />
  )
} 
else{
   return(<Notauthenticated/>)
}
}

export default UserProfile