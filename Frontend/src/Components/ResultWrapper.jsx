import React from "react"
import axios from "axios"
import {Box}from "@mui/material"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
function ResultWrapper() {
  const columns = [
    { field: 'Course Name', headerName: 'Course Name', width: 150, editable:false},
    {field:"Marks",editable:false}
  ]
  const rows=[
    {
      
    }
  ]
 const retrieveData= async ()=>{
  await axios.post("http://localhost:3000/api/v1/users/fetch-result",{},{withCredentials:true}).then((response)=>{
   console.log(response.data)
  })
 
 }
  return (
    
      <TableContainer component="div" sx={{width:"50%", margin:"auto"}} className="bg-[#9e9e9e]">
      <Table sx={{ minWidth: 400}} aria-label="simple table">
        <TableHead>
          <TableRow>
           <TableCell>SI No.</TableCell>
            <TableCell align="right">Sem/Year</TableCell>
            <TableCell align="right">Examination</TableCell>
            <TableCell align="right">Class</TableCell>
            <TableCell align="right">Action</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
        
        </TableBody>  
        </Table>
      </TableContainer>
  )
}

export default ResultWrapper