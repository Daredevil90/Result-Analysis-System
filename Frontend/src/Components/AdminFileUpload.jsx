import React, { useEffect, useState } from "react";
import { TextField, Typography, Select, Box, MenuItem, InputLabel, Button, FormControl, Paper } from "@mui/material";
import { useForm, Controller } from 'react-hook-form';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { DatePicker } from "@mui/x-date-pickers";
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

function AdminFileUpload() {
  const authStatus = useSelector((state) => state.auth.status);
  const [successStatus, setSuccessStatus] = useState(false);
  const [error, setError] = useState(null);
  const { register, handleSubmit, control } = useForm();
  const [examName, setExamName] = useState('');

  const handleChange = (event) => {
    setExamName(event.target.value);
  };

  const FileSubmit = async (data) => {
    const formData = new FormData();
    formData.append('excelFile', data.excelFile[0]);
    formData.append('exam_name', data.exam_name);
    formData.append("exam_date", data.exam_date);
    formData.append("exam_sem", data.exam_sem);
    try {
      await axios.post("http://localhost:3000/api/v1/users//upload-excel", formData, {
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

  if (!authStatus) {
    return <Navigate to="/" />;
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f0f2f5"
    >
      <Paper
        elevation={3}
        component="form"
        onSubmit={handleSubmit(FileSubmit)}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 500,
          borderRadius: 2,
        }}
      >
        <Typography variant="h4" align="center" gutterBottom color="primary">
          Upload Result Data
        </Typography>
        
        <FormControl fullWidth margin="normal">
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
                <MenuItem value=""><em>None</em></MenuItem>
                <MenuItem value="IA-1">IA-1</MenuItem>
                <MenuItem value="IA-2">IA-2</MenuItem>
                <MenuItem value="Mid-Semester">Mid-Semester</MenuItem>
                <MenuItem value="End-Semester">End-Semester</MenuItem>
              </Select>
            )}
          />
        </FormControl>

        <TextField
          fullWidth
          margin="normal"
          variant="outlined"
          label="Semester"
          {...register("exam_sem")}
          required
          color="primary"
        />

        <Controller
          name="exam_date"
          control={control}
          defaultValue={null}
          render={({ field }) => (
            <DatePicker
              label="Exam Date"
              slotProps={{ textField: { variant: "outlined", fullWidth: true, margin: "normal" } }}
              {...field}
            />
          )}
        />

        <Button
          variant="outlined"
          component="label"
          fullWidth
          sx={{ mt: 2, mb: 2 }}
          startIcon={<CloudUploadIcon />}
        >
          Upload Excel File
          <input
            type="file"
            hidden
            {...register("excelFile")}
            name="excelFile"
            accept=".xls,.xlsx"
          />
        </Button>

        <Button
          variant="contained"
          type="submit"
          fullWidth
          sx={{ mt: 2 }}
          startIcon={<CloudUploadIcon />}
        >
          Submit
        </Button>

        <ToastContainer />
      </Paper>
    </Box>
  );
}

export default AdminFileUpload;