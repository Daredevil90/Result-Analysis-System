import React, { useEffect, useState } from "react";
import { TextField, Typography, Select } from "@mui/material";
import { Box } from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import { useForm, Controller } from 'react-hook-form';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { DatePicker } from "@mui/x-date-pickers";
import { toast, ToastContainer } from 'react-toastify';
import {FormControl} from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
function AdminFileUpload() {
  const authStatus = useSelector((state) => state.auth.status);
  const [successStatus, setSuccessStatus] = useState(false);
  const [error, setError] = useState(null);
  const { register, handleSubmit, control } = useForm();
  const [examName, setExamName] = useState('');
  const handleChange = (event) => {
   setExamName(event.target.value)
  };
  const FileSubmit = async (data) => {
    const formData = new FormData();
    formData.append('excelFile', data.excelFile[0]);
    formData.append('exam_name', data.exam_name);
    formData.append("exam_date", data.exam_date);
    formData.append("exam_sem", data.exam_sem);
    try {
      await axios.post("http://localhost:3000/api/v1/users/uploadExcel", formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }).then((response) => {
        console.log(response.data);
        if (response.status === 200) {
          setSuccessStatus(true);
        } else if (response.status === 500) {
          setError(response.data.message);
        } else {
          setSuccessStatus(false);
        }
      });
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    if (successStatus) {
      toast.success("Data Uploaded Successfully", {
        position: "top-center"
      });
      setSuccessStatus(false);
    } else if (error) {
      toast.error(error, {
        position: "top-center"
      });
      setError(null);
    }
  }, [successStatus, error]);

  return (
    authStatus ? (
      <Box component="form" alignItems={'center'} justifyContent={'center'} flexDirection="column" className="bg-[#e0e0e0]" display={'flex'} padding={3} minWidth="xs" maxWidth="sm" margin={"auto"} my={13} gap={3} onSubmit={handleSubmit(FileSubmit)} borderRadius={4}>
      <Typography variant='h4'>Upload Result Data</Typography>
      <FormControl sx={{ width: "50%" }}>
      <InputLabel id="exam-name-label">Exam Name</InputLabel>
      <Controller
        name="exam_name"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <Select
            {...field}
            labelId="exam-name-label"
            value={examName}
            onChange={(event) => {
              handleChange(event);
              field.onChange(event);
            }}
            label="Exam Name"
             required
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={"IA-1"}>IA-1</MenuItem>
            <MenuItem value={"IA-2"}>IA-2</MenuItem>
            <MenuItem value={"Mid-Semester"}>Mid-Semester</MenuItem>
            <MenuItem value={"End-Semester"}>End-Semester</MenuItem>
          </Select>
        )}
      />
    </FormControl>
        <TextField variant="outlined" label="Semester" {...register("exam_sem")} required sx={{ width: "50%" }} color="secondary" />
        <Controller
          name="exam_date"
          control={control}
          defaultValue={null}
          render={({ field }) => (
            <DatePicker
              className="sm:w-1/2"
              label="Exam Date"
              sx={{ width: "50%" }}
              slotProps={{ textField: { variant: "outlined" } }}
              {...field}
            />
          )}
        />
        <TextField variant='outlined' type='file' {...register("excelFile")} name='excelFile' inputProps={{ accept: '.xls,.xlsx' }} color="secondary" required sx={{ width: "50%" }} />
        <Button variant='contained' type='submit' color="inherit" startIcon={<CloudUploadIcon />}>Submit</Button>
        <ToastContainer />
      </Box>
    ) : (
      <Navigate to="/" />
    )
  );
}

export default AdminFileUpload;
