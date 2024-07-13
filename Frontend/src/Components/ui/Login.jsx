import React from "react";
import { Link as Mui_link, TextField, Typography } from "@mui/material";
import Button from '@mui/material/Button';
import {useDispatch} from "react-redux"
import { login,setAdmin } from "../../store/authSlice.js";
import { useForm } from "react-hook-form";
import axios from "axios";
import { logout } from "../../store/authSlice.js";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {Box} from "@mui/material";
import { Link } from "react-router-dom";
export default function Login()
{  const authStatus= useSelector((state)=>state.auth.status);
    console.log(authStatus);
    const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm(); 
  const dispatch = useDispatch()
  const sendData = async (data) => {
   
    try {
      // console.log(data)
      const response = await axios.post('http://localhost:3000/api/v1/users/login', data,{withCredentials:true});
      console.log("response data:", response.data.updatedUser, response.status);
      console.log(response.data.updatedUser.isAdmin);
      if (response.status === 200) {
      dispatch(login(response.data.updatedUser));
      }
      else {
         dispatch(logout())
      }
      if(response.data.updatedUser.isAdmin===true){
        dispatch(setAdmin())
      }
    } catch (error) {
      console.log(error);
    
    }
  };
    return( 
    <Box component="form"  display="flex" flexDirection="column" gap={4} 
    alignItems="center" textAlign="center" minWidth="xs" maxWidth="sm" className=" m-auto bg-[#e0e0e0] relative top-32" onSubmit={handleSubmit(sendData)}padding={2} borderRadius={10} width="35vw">
    <Typography variant="h4" className="text-center">Sign In</Typography>
    <TextField id="outlined-basic" label="Email Address" variant="outlined" {...register("email")}  className="sm:w-1/2 m-1" required/>
    <TextField id="outlined-basic" label="Password" type="password" variant="outlined" {...register("password")}  className="sm:w-1/2 m-1" required/>
    <Mui_link component="button" variant="h6" className="m-auto"><Link to="/register">New Here? Register Now</Link></Mui_link>
    <Button variant="contained" className="w-1/4" type="submit" color="inherit">Sign In</Button>
    {authStatus &&(<Navigate to="/"/>)}
    </Box>
    )
}