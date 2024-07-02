import React from "react"
import { Button } from "@mui/material";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux'

function Result() {
  const userdata= useSelector((state)=>state.auth.userData);
  const location = useLocation();
  const { row } = location.state || {};
 const record =row.total_Subjects_and_Marks_Info;
 console.log(record)
  const userResult= {
    "Header":record.filter((row)=>{
    if(row[0]=="Roll No."){
      return row
    }}),
"Marks":record.filter((row)=>{
  if(row[0]==userdata.rollno){
    return row
  }}),
}
console.log(userResult)
  return( <TableContainer component="div" sx={{width:"30%", margin:"auto"}} className="bg-[#9e9e9e]">
    <Table sx={{ minWidth: 200}}  aria-label="simple table" >
      <TableHead>
        <TableRow>
         <TableCell align="center">SI No.</TableCell>
          <TableCell align="center">Course Name</TableCell>
          <TableCell align="center">Marks</TableCell>
          </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
        { userResult.Header.map((row,index)=>{
          if(row!="Roll No."){
            console.log(row)
            return(
              <>
              <TableCell align="center" key={index}>{index+1}</TableCell>
              </>
            )
          }
        })
        }
         { userResult.Header.map((row,index)=>{
          if(row!="Roll No."){
            console.log(row)
            return(
              <>
              <TableCell align="center" >{row}</TableCell>
              </>
            )
          }
        })
        }
        </TableRow>
      </TableBody>  
      </Table>
    </TableContainer>)
}

export default Result