import  { useState } from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Link, Typography } from "@mui/material";
import {Box} from "@mui/material";

export default function Register() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const { register, handleSubmit, control} = useForm();

  const sendData = async (data) => {
    setIsClicked(true);
    try {
      const response = await axios.post('http://localhost:3000/api/v1/users/register', data);
      console.log("response data:", response.data, response.status);
      if (response.status === 200) {
        setIsRegistered(true);
      } else {
        setIsRegistered(false);
      }
    } catch (error) {
      console.log(error);
      setIsRegistered(false);
    }
  };

  return (
    <Box  component="form"  display="flex" flexDirection="column" gap={3} 
    alignItems="center" textAlign="center"  maxWidth="sm" className=" m-auto my-9" onSubmit={handleSubmit(sendData)}>
       <Typography variant="h4" alignSelf="center" className=""  >Sign Up</Typography> 
      <TextField 
         className="sm:w-1/2"
        id="outlined-basic"
        label="Email Address"
        variant="outlined"
        name="email"
        required
        {...register("email")}
      />
      <TextField
        id="outlined-basic"
        label="Password"
        variant="outlined"
        name="password"
        type="password"
        required
         className="sm:w-1/2"
        {...register("password")}
      />
      <TextField
        id="outlined-basic"
        label="Full Name"
        variant="outlined"
        name="fullname"
        required
       className="sm:w-1/2"
        {...register("fullname")}
      />
      <TextField
        id="outlined-basic"
        label="College Name"
        variant="outlined"
        name="collegeName"
        required
         className="sm:w-1/2"
        {...register("collegeName")}
      />
      <TextField
        id="outlined-basic"
        label="Roll No."
        variant="outlined"
        name="rollno"
        required
       className="sm:w-1/2"
        {...register("rollno")}
      />
      <Controller
        name="dob"
        control={control}
        defaultValue={null}
        render={({ field }) => (
          <DatePicker
            className="sm:w-1/2"
            label="Date of Birth"
            slotProps={{ textField: { variant: "outlined" } }}
            {...field}
          />
        )}
      />
      <Button variant="contained" id="RegButton" type="submit">Sign Up</Button>
      <Box component="div">
        <Typography><Link href="/login">Already have an account? Sign In</Link></Typography>
      </Box>
    </Box>
  );
}
