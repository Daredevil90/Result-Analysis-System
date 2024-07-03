import React from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Result() {
  const userData = useSelector((state) => state.auth.userData);
  const location = useLocation();
  const { row } = location.state || {};
  const record = row.total_Subjects_and_Marks_Info;

  const userResult = {
    "Header": record.find((row) => row[0] === "Roll No."),
    "Marks": record.find((row) => row[0] === userData.rollno),
  };

  return (
    <TableContainer component="div" sx={{ width: "30%", margin: "auto" }} className="bg-[#9e9e9e]" alignItems="center">
      <Table sx={{ minWidth: 200 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">SI No.</TableCell>
            <TableCell align="center">Course Name</TableCell>
            <TableCell align="center">Marks</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {userResult.Header.slice(1).map((header, index) => (
            <TableRow key={index}  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell align="center">{index + 1}</TableCell>
              <TableCell align="center">{header}</TableCell>
              <TableCell align="center">{userResult.Marks[index + 1]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default Result;
