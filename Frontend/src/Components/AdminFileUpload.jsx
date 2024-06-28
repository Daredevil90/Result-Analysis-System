
import { TextField, Typography } from "@mui/material";
import {Box} from "@mui/material";
import { useForm,Controller} from 'react-hook-form';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { DatePicker } from "@mui/x-date-pickers";
function AdminFileUpload() {
    const authStatus= useSelector((state)=>state.auth.status);
    const { register, handleSubmit, control } = useForm();
 const FileSubmit=async (data)=>{
  const formData = new FormData();
  formData.append('excelFile', data.excelFile[0]);
  formData.append('exam_name', data.exam_name);
  const exam_date=new Date(data.exam_date);
  formData.append("exam_date",exam_date.toLocaleString())
       try {
        console.log(data)
         await axios.post("http://localhost:3000/api/v1/users/uploadExcel",formData,{withCredentials:true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
         }).then((response)=>{
            console.log(response.data);
         })
       } catch (error) {
        console.log(error)
       }
     }
        return (
         authStatus?(<Box component="form" alignItems={'center'} justifyContent={'center'} flexDirection="column" className="bg-[#9e9e9e]" display={'flex'} padding={3}  minWidth="xs" maxWidth="sm" margin={"auto"} my={13} gap={3} onSubmit={handleSubmit(FileSubmit)} >
                <Typography variant='h4'>Upload Result Data</Typography>
          <TextField variant="outlined" label="Exam Name" {...register("exam_name")}  required sx={{width:"50%"}}  color="secondary" />
          <Controller
        name="exam_date"
        control={control}
        defaultValue={null}
        render={({ field }) => (
          <DatePicker
            className="sm:w-1/2"
            label="Exam Date"
            sx={{width:"50%"}}
            slotProps={{ textField: { variant: "outlined" } }}
            {...field}
          />
        )}
      />
          <TextField variant='outlined' type='file' {...register("excelFile")} name='excelFile' inputProps={{ accept: '.xls,.xlsx' }} color="secondary" required sx={{width:"50%"}} />
          <Button variant='contained' type='submit' color="inherit" startIcon={<CloudUploadIcon />} >Submit</Button>
          </Box>):(<Navigate to="/"/>)
        );
}

export default AdminFileUpload