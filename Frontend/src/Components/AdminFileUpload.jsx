import React from 'react'
import { TextField, Typography } from "@mui/material";
import {Box} from "@mui/material";
import { useForm } from 'react-hook-form';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
function AdminFileUpload() {
    const authStatus= useSelector((state)=>state.auth.status);
 const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm(); 
 const FileSubmit=async (data)=>{
       try {
        console.log(data)
         await axios.post("http://localhost:3000/api/v1/users/uploadExcel",data,{withCredentials:true}).then((response)=>{
            console.log(response.data);
         })
       } catch (error) {
        console.log(error)
       }
     }
        return (
         authStatus?(<Box component="form" alignItems={'center'} justifyContent={'center'} flexDirection="column" className="bg-blue" display={'flex'} height={400}  minWidth="xs" maxWidth="sm" margin={"auto"} my={13} gap={5} onSubmit={handleSubmit(FileSubmit)} >
                <Typography variant='h3'>Upload Result Data</Typography>
          {/* <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
          >
            Upload file
            <VisuallyHiddenInput type="file" name='excelFile' {...register("excelFile")} />
          </Button> */}
          <TextField variant='outlined' type='file' {...register("excelFile")} />
          <Button variant='contained' type='submit'  >Submit</Button>
          </Box>):(<Navigate to="/"/>)
        );
}

export default AdminFileUpload