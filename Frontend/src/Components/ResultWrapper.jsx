import { useState,useEffect, React } from "react";
import axios from "axios"
import { Button } from "@mui/material";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useNavigate } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
function ResultWrapper() {
  
 const navigate = useNavigate();
 const columns = [
    { field: 'Course Name', headerName: 'Course Name', width: 150, editable:false},
    {field:"Marks",editable:false}
  ]
  const [record, setRecord] = useState([]);

  useEffect(() => {
    const retrieveData = async () => {
      try {
        const response = await axios.post("http://localhost:3000/api/v1/users/fetch-result", {}, { withCredentials: true });
        setRecord(  response.data.record);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    retrieveData();
  }, []); // Empty dependency array means this effect runs once after initial render

  if (!record) {
    return(
      <Box sx={{ display: 'flex' }}>
      <CircularProgress />
    </Box>
    )
  }
const handleClick = (row) => {
  console.log(row)
  navigate('/result', { state: { row } });
  };
  return (
    
      <TableContainer component="div" sx={{width:"30%", margin:"auto"}} className="bg-[#9e9e9e]">
      <Table sx={{ minWidth: 200}}  aria-label="simple table" >
        <TableHead>
          <TableRow>
           <TableCell align="center">SI No.</TableCell>
            <TableCell align="center">Sem/Year</TableCell>
            <TableCell align="center">Examination</TableCell>
            <TableCell align="center">Action</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
        {
          record.map((row,index)=>{
           return(
          <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row" align="center">
                {index+1}
              </TableCell> 
              <TableCell align="center" key={row.semester} >{row.semester}/{new Date(row.exam_date).getFullYear()}</TableCell>
              <TableCell align="center" key={row.examination_name}>{row.examination_name}</TableCell>
              <TableCell key={row._id}><Button variant="contained" color="inherit" onClick={() => handleClick(row)}>View</Button></TableCell>
          </TableRow>)
          })  
        }
        </TableBody>  
        </Table>
      </TableContainer>
  )
}

export default ResultWrapper