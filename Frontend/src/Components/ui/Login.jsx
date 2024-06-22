import React from "react";
import { TextField, Typography } from "@mui/material";
import Button from '@mui/material/Button';
import {useDispatch} from "react-redux"
import { login } from "../../store/authSlice.js";
import { useForm } from "react-hook-form";
import axios from "axios";
import { logout } from "../../store/authSlice.js";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {Box} from "@mui/material";
import { toast,ToastContainer } from "react-toastify";
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
      if (response.status === 200) {
      dispatch(login(response.data.updatedUser));
         
      } else {
         dispatch(logout())
         
      }
      
    } catch (error) {
      console.log(error);
    
    }
  };
    return( 
          <Box  component="form"  display="flex" flexDirection="column" gap={4} 
         alignItems="center" textAlign="center" minWidth="xs" maxWidth="sm" className=" m-auto my-32  " onSubmit={handleSubmit(sendData)}>
        {/* // <form className="login-form"  onSubmit={handleSubmit(sendData)}> */}
        <Typography variant="h3" className="text-center">Sign In</Typography>
    {/* <div className="input-group">
    <label>Email Address</label>
    <input type="text"></input>
    </div>
    <div className="input-group">
    <label>Password </label>
    <input type="password"></input>
    </div>
   <button className="submitButton">Submit</button> */}
   <TextField id="outlined-basic" label="Email Address" variant="outlined" {...register("email")}  className="sm:w-1/2 m-1"/>
   <TextField id="outlined-basic" label="Password" type="password" variant="outlined" {...register("password")}  className="sm:w-1/2 m-1" />
   <Button variant="contained" id="RegButton" type="submit">Sign In</Button>
   {authStatus &&(toast.success("Logged In Successfully",{position:"top-right"}))&&(<Navigate to="/"/>)}
    {/* </form> */}
    </Box>
    )
}